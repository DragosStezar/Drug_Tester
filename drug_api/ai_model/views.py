from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .predictor import Predictor
from .alternatives import find_alternatives
from .serializers import CheckDrugsSerializer

class CheckDrugsView(APIView):
    def post(self, request):
        serializer = CheckDrugsSerializer(data=request.data)
        if serializer.is_valid():
            predictor = Predictor()
            results = []
            for drug_id in serializer.validated_data['drug_ids']:
                prediction = predictor.predict_target_and_risk(drug_id)
                predicted_target_id = prediction['target_id']
                risky = prediction.get('risky', False)
                side_effects = prediction.get('side_effects', [])
                alternatives = find_alternatives(predicted_target_id) if risky else []
                results.append({
                    'drug_id': drug_id,
                    'predicted_target_id': predicted_target_id,
                    'risky': risky,
                    'side_effects': side_effects,
                    'alternatives': alternatives
                })
            return Response({'results': results})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.
