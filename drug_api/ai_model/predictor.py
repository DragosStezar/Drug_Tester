import pickle
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

class Predictor:
    def __init__(self):
        with open(MODEL_PATH, 'rb') as f:
            self.model = pickle.load(f)

    def predict_target_and_risk(self, drug_id: str) -> dict:
        # Exemplu: modelul trebuie să returneze dict cu target, risky, efecte
        # Înlocuiește cu logica reală a modelului tău
        result = self.model.predict([drug_id])[0]
        # Exemplu dummy:
        # return {'target_id': 'BE0005', 'risky': True, 'side_effects': ['nausea']}
        return result
