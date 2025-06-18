from django.urls import path
from .views import CheckDrugsView

urlpatterns = [
    path('check_drugs/', CheckDrugsView.as_view(), name='check_drugs'),
]
