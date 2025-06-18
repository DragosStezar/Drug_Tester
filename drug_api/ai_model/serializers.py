from rest_framework import serializers

class CheckDrugsSerializer(serializers.Serializer):
    drug_ids = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False
    )
