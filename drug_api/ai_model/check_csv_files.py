import os

# Versiunile folosite în cod
train_versions = [
    '4.1','4.3','4.5','5.0.0','5.0.1','5.0.2','5.0.3',
    '5.0.5','5.0.6','5.0.7','5.0.8','5.0.9','5.0.10',
    '5.0.11','5.1.0','5.1.1','5.1.2','5.1.3','5.1.4',
    '5.1.5','5.1.6','5.1.7','5.1.8','5.1.9','5.1.10',
    '5.1.11','5.1.12'
]
test_version = '5.1.13'

needed = [f'dti-{v}.csv' for v in train_versions + [test_version]]

# Calea absolută către folderul DrugBank dataset la rădăcina proiectului
csv_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'DrugBank dataset'))

missing = [f for f in needed if not os.path.exists(os.path.join(csv_folder, f))]

if missing:
    print('Lipsesc următoarele fișiere CSV:')
    for f in missing:
        print(f'-', f)
else:
    print('Toate fișierele CSV necesare există în', csv_folder)
