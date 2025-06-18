import csv
import os
from .risks import RISKY_TARGETS

CSV_PATH = os.path.join(os.path.dirname(__file__), 'approved_drug_targets.csv')

def find_alternatives(predicted_target_id):
    alternatives = []
    with open(CSV_PATH, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['Target ID'] not in RISKY_TARGETS and row['Target ID'] != predicted_target_id:
                alternatives.append({
                    'drug_id': row['DrugBank ID'],
                    'target_id': row['Target ID'],
                    'drug_name': row['Drug Name']
                })
    return alternatives
