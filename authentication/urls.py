from django.urls import path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.urls import re_path
from .consumers import ChatConsumer
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from .views import CardListCreateView, CardDetailView, UserCardListView, AccountBalancesAPIView


router = DefaultRouter()
router.register(r'bank-accounts', views.BankAccountViewSet, basename='bank-account')


urlpatterns = [
    # Authentication APIs
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

    # Savings-related APIs
    path('update-savings-goal/', views.update_savings_goal, name='update-savings-goal'),

    # Admin-related APIs
    path('send-message/<int:recipient_id>/', views.send_message, name='send-message'),
    path('get-messages/<int:recipient_id>/', views.get_messages, name='get-messages'),
    path('send-admin-reply/<int:message_id>/', views.send_admin_reply, name='send-admin-reply'),
    path('admin/authentication/message/<int:message_id>/reply/', views.reply_to_message, name='admin-reply-to-message'),
    
    # Bank-related APIs
    path('api/', include(router.urls)),
    path('add-bank-account/', views.add_bank_account, name='add-bank-account'),
    path('delete-bank-account/<str:account_number>/', views.delete_bank_account, name='delete-bank-account'),
    path('bank-accounts/get-bank-accounts/', views.get_user_banks, name='get_user_banks'),

    # Card-related APIs
    path('add-card/', CardListCreateView.as_view(), name='card-list-create'),
    path('cards/<int:pk>/', CardDetailView.as_view(), name='card-detail'),
    path('get-cards/', UserCardListView.as_view(), name='user-card-list'),

    # Accounts-related APIs
    path('get-account-balances/', AccountBalancesAPIView.as_view(), name='get-account-balances'),

    ]


websocket_urlpatterns = [
    re_path(r'ws/chat/$', ChatConsumer.as_asgi()),
]