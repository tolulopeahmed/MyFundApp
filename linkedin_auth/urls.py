from django.urls import path
from .views import get_linkedin_auth_url, exchange_linkedin_code

urlpatterns = [
    path('get-linkedin-auth-url/', get_linkedin_auth_url, name='get-linkedin-auth-url'),
    path('exchange-linkedin-code/', exchange_linkedin_code, name='exchange-linkedin-code'),
]
