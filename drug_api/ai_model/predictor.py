import pickle
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

class Predictor:
    def __init__(self):
        with open(MODEL_PATH, 'rb') as f:
            self.model = pickle.load(f)

    def predict_target(self, drug_id: str) -> str:
        return self.model.predict([drug_id])[0]
