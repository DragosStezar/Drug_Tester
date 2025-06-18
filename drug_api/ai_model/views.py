from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .predictor import predict_target_and_risk, predict_interaction, predict_top_targets
from .alternatives import find_alternatives
from .serializers import CheckDrugsSerializer
import csv
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), 'approved_drug_targets.csv')

def get_drugbankid_to_name():
    mapping = {}
    with open(CSV_PATH, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            mapping[row['DrugBank ID']] = row['Drug Name']
    return mapping

class CheckDrugsView(APIView):
    def post(self, request):
        serializer = CheckDrugsSerializer(data=request.data)
        if serializer.is_valid():
            drugbankid_to_name = get_drugbankid_to_name()
            # Construiește lista de nume medicamente pentru toți drug_id
            drug_names = [drugbankid_to_name.get(drug_id) for drug_id in serializer.validated_data['drug_ids'] if drugbankid_to_name.get(drug_id)]
            results = []
            for drug_id in serializer.validated_data['drug_ids']:
                # Folosește direct DrugBank ID pentru predicție
                if not drug_id:
                    results.append({
                        'drug_id': drug_id,
                        'error': 'DrugBank ID not found in CSV',
                        'top_targets': []
                    })
                    continue
                # Top 5 interacțiuni drug-target (doar target_id-uri reale)
                top_targets = predict_top_targets(drug_id, top_n=6)
                drug_name = drugbankid_to_name.get(drug_id)
                results.append({
                    'drug_id': drug_id,
                    'drug_name': drug_name,
                    'top_targets': top_targets
                })
            return Response({'results': results})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DrugListView(APIView):
    def get(self, request):
        query = request.GET.get('q', '').strip().lower()
        drugs = []
        with open(CSV_PATH, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                name = row['Drug Name']
                drug_id = row['DrugBank ID']
                if query:
                    if query in name.lower():
                        drugs.append({'drug_id': drug_id, 'drug_name': name})
                else:
                    drugs.append({'drug_id': drug_id, 'drug_name': name})
        # Elimină duplicatele după drug_id
        unique_drugs = {d['drug_id']: d for d in drugs}.values()
        return Response(list(unique_drugs))

# Create your views here.
