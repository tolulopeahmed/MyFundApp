from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('confirm-otp/', views.confirm_otp, name='confirm-otp'),
    path('login/', views.CustomObtainAuthToken.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('test-email/', views.test_email, name='test-email'), #Use this to test if your email sending functionality is working.
    path('request-password-reset/', views.request_password_reset, name='request-password-reset'),
    path('reset-password/', views.reset_password, name='reset-password'),

    # Profile-related APIs
    path('get_user_profile/', views.get_user_profile, name='get_user_profile'),
    path('update_user_profile/', views.update_user_profile, name='update_user_profile'),

]
