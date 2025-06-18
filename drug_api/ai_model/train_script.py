import csv
import networkx as nx

def load_graph(v):
    G = nx.Graph()
    with open(f'dti-{v}.csv', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            drug_id = row['DrugBank ID'].strip()
            targets = row['Target Interactions'].split(';') if row['Target Interactions'] else []
            for target_id in targets:
                target_id = target_id.strip()
                if drug_id and target_id:
                    G.add_edge(drug_id, target_id)
    return G

# ...existing code...