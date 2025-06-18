import pickle
import os
import csv
import torch
import torch.nn as nn
import pennylane as qml
import networkx as nx

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

# =====================
# 1. Încarcă graful și nodurile comune
# =====================
train_versions = [
    '4.1','4.3','4.5','5.0.0','5.0.1','5.0.2','5.0.3',
    '5.0.5','5.0.6','5.0.7','5.0.8','5.0.9','5.0.10',
    '5.0.11','5.1.0','5.1.1','5.1.2','5.1.3','5.1.4',
    '5.1.5','5.1.6','5.1.7','5.1.8','5.1.9','5.1.10',
    '5.1.11','5.1.12'
]
test_version = '5.1.13'

def load_graph(v):
    G = nx.Graph()
    with open(os.path.join(os.path.dirname(__file__), f'dti-{v}.csv'), encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            drug_id = row['DrugBank ID'].strip()
            targets = row['Target Interactions'].split(';') if row['Target Interactions'] else []
            for target_id in targets:
                target_id = target_id.strip()
                if drug_id and target_id:
                    G.add_edge(drug_id, target_id)
    return G

graphs  = [load_graph(v) for v in train_versions + [test_version]]
T_train = len(train_versions)
G_test  = graphs[-1]

global_common = set(graphs[0].nodes())
for g in graphs[1:]:
    global_common &= set(g.nodes())
nodes = sorted(global_common)
idx   = {n: i for i, n in enumerate(nodes)}
N     = len(nodes)

# =====================
# 2. Modelul AI (identic cu antrenarea)
# =====================
@qml.qnode(qml.device("default.qubit", wires=2), interface="torch")
def qubit_p01(theta, phi, wire=0):
    qml.RY(theta, wires=wire)
    qml.RX(phi,   wires=wire)
    return qml.expval(qml.PauliZ(wire))

class QSSM2qPairFE(nn.Module):
    def __init__(self, N, k, d):
        super().__init__()
        self.theta1 = nn.Parameter(torch.tensor(0.2))
        self.phi1   = nn.Parameter(torch.tensor(0.1))
        self.theta2 = nn.Parameter(torch.tensor(0.3))
        self.phi2   = nn.Parameter(torch.tensor(0.05))
        self.alpha  = nn.Parameter(torch.tensor(0.0))

        self.P = nn.Linear(N+3, k, bias=False)
        self.W = nn.Linear(k, d)
        self.b = nn.Parameter(torch.zeros(d))

        self.dec = nn.Sequential(
            nn.Linear(2*d+4, d),
            nn.ReLU(),
            nn.Linear(d, 1)
        )

    def g1(self): return 0.5 * (1 - qubit_p01(self.theta1, self.phi1, wire=0))
    def g2(self): return 0.5 * (1 - qubit_p01(self.theta2, self.phi2, wire=1))

    def forward(self, Aseq, Fseq): pass  # Not folosit la inferență

    def score(self, H, pairs, pair2feat_agg):
        out = []
        for u, v in pairs:
            hu, hv = H[u], H[v]
            cn, aa, pa, jc = pair2feat_agg.get((u,v), (0.,0.,0.,0.))
            feat = torch.tensor([cn, aa, pa, jc], dtype=torch.float, device=H.device)
            out.append(self.dec(torch.cat([hu, hv, feat], dim=0)))
        return torch.cat(out, dim=0)

# =====================
# 3. Încarcă modelul și vectorii H
# =====================
k, d = 128, 64
model = QSSM2qPairFE(N, k, d)
checkpoint = torch.load(os.path.join(os.path.dirname(__file__), "quantum_model.pth"), map_location="cpu", weights_only=False)
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()

H_dummy = torch.randn(N, d)

def compute_pair_features(graph, u, v):
    from networkx.algorithms.link_prediction import adamic_adar_index, preferential_attachment, jaccard_coefficient
    neigh_u = set(graph.neighbors(u))
    neigh_v = set(graph.neighbors(v))
    cn = len(neigh_u & neigh_v)
    aa_dict = { (a, b): p for a, b, p in adamic_adar_index(graph, [(u, v)]) }
    pa_dict = { (a, b): p for a, b, p in preferential_attachment(graph, [(u, v)]) }
    jc_dict = { (a, b): p for a, b, p in jaccard_coefficient(graph, [(u, v)]) }
    key = tuple(sorted((u, v)))
    aa = aa_dict.get(key, 0.0)
    pa = pa_dict.get(key, 0.0)
    jc = jc_dict.get(key, 0.0)
    return (cn, aa, pa, jc)

# =====================
# 4. Funcție de predicție pentru API
# =====================
def predict_interaction(drug_name, target_name):
    if drug_name not in idx or target_name not in idx:
        raise ValueError("Numele nu există în graful comun.")
    u, v = idx[drug_name], idx[target_name]
    feats = { (u, v): compute_pair_features(G_test, drug_name, target_name) }
    with torch.no_grad():
        score = model.score(H_dummy, [(u, v)], feats)
        prob  = torch.sigmoid(score).item()
        return prob

# =====================
# 5. Funcție pentru API: dat un drug_id, returnează targetul cu cea mai mare probabilitate
# =====================
def predict_target_and_risk(drug_id: str):
    # Caută targetul cu probabilitatea maximă
    best_target = None
    best_prob = 0.0
    for target in nodes:
        if target == drug_id:
            continue
        try:
            prob = predict_interaction(drug_id, target)
            if prob > best_prob:
                best_prob = prob
                best_target = target
        except Exception:
            continue
    return {
        'target_id': best_target,
        'probability': best_prob,
        'linked': best_prob > 0.5
    }

def predict_top_targets(drug_id: str, top_n=5):
    # Încarcă mapping target_id -> target_name din CSV
    target_id_to_name = {}
    with open(os.path.join(os.path.dirname(__file__), 'approved_drug_targets.csv'), newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            target_id_to_name[row['Target ID']] = row['Target Name']
    # Folosește doar target_id-urile care încep cu 'BE'
    scores = []
    for target_id in target_id_to_name:
        try:
            prob = predict_interaction(drug_id, target_id)
            scores.append({'target_id': target_id, 'target_name': target_id_to_name[target_id], 'probability': prob})
        except Exception:
            continue
    # Sortează descrescător după probabilitate
    scores = sorted(scores, key=lambda x: x['probability'], reverse=True)
    return scores[:top_n]

print("DB00002 in nodes:", "DB00002" in nodes)
print("BE0000048 in nodes:", "BE0000048" in nodes)