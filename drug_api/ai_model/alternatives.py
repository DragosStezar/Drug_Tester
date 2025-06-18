import csv
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), 'approved_drug_targets.csv')

def find_alternatives(predicted_target_id, original_drug_id=None, top_n=5):
    alternatives = []
    with open(CSV_PATH, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['Target ID'] != predicted_target_id:
                if original_drug_id and row['DrugBank ID'] == original_drug_id:
                    continue  # exclude medicamentul original
                alternatives.append({
                    'drug_id': row['DrugBank ID'],
                    'target_id': row['Target ID'],
                    'drug_name': row['Drug Name']
                })
    # Poți adăuga sortare după un criteriu dacă ai (ex: alfabetică sau alt scor)
    return alternatives[:top_n]
