from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('confirm-otp/', views.confirm_otp, name='confirm-otp'),
    path('login/', views.CustomObtainAuthToken.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('test-email/', views.test_email, name='test-email'), #Use this to test if your email sending functionality is working.
]
