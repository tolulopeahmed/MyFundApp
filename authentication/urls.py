from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('confirm-otp/', views.confirm_otp, name='confirm-otp'),
    path('login/', views.CustomObtainAuthToken.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('test-email/', views.test_email, name='test-email'), #Use this to test if your email sending functionality is working.
    path('request-password-reset/', views.request_password_reset, name='request-password-reset'),
    path('reset-password/', views.reset_password, name='reset-password'),

    # Profile-related APIs
    path('get-user-profile/', views.get_user_profile, name='get-user-profile'),
    path('update-user-profile/', views.update_user_profile, name='update-user-profile'),
    path('profile-picture-update/', views.profile_picture_update, name='profile-picture-update'),

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)