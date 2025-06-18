from django.urls import path
from .views import CheckDrugsView, DrugListView

urlpatterns = [
    path('check_drugs/', CheckDrugsView.as_view(), name='check_drugs'),
    path('drugs/', DrugListView.as_view(), name='drug_list'),
]
