from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from .serializers import SignupSerializer, ConfirmOTPSerializer
import random
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.views import APIView
from django.contrib.auth import logout
from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse

from django.utils import timezone
from .models import CustomUser

from django.contrib.auth import get_user_model




@api_view(['POST'])
@permission_classes([])
@csrf_exempt
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Generate OTP (you can use your own logic here)
        otp = generate_otp()
        user.otp = otp
        user.save()

        # Send OTP to user's email
        send_otp_email(user, otp)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
# @permission_classes([IsAuthenticated])  # Require authentication for this view
@permission_classes([AllowAny])  # Allow any user (authenticated or not) to test
@csrf_exempt
def confirm_otp(request):
    serializer = ConfirmOTPSerializer(data=request.data)
    if serializer.is_valid():
        otp = serializer.validated_data['otp']
        user = request.user  # Assuming the user is authenticated

        if user.otp == otp:
            user.is_active = True  # Confirm the account
            user.save()
            return Response({'message': 'Account confirmed successfully.'}, status=status.HTTP_200_OK)
            
            # If OTP doesn't match
        return Response({'message': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def generate_otp():
    return ''.join(random.choices('0123456789', k=6))

def send_otp_email(user, otp):
    subject = "OTP Code for MyFund"
    message = f"Your MyFund OTP code is: {otp}"
    from_email = settings.EMAIL_HOST_USER  # Replace with your sender email
    recipient_list = [user.email]
    send_mail(subject, message, from_email, recipient_list)


def test_email(request):
    send_mail(
        'Test Email',
        'This is a test email body.',
        'myfundmobile@gmail.com',
        ['valueplusrecords@gmail.com'],
        fail_silently=False,
    )
    return HttpResponse("Test email sent. This shows the email system is working")



class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(CustomObtainAuthToken, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        user = token.user
        return Response({'token': token.key, 'user_id': user.id})




class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)
    


CustomUser = get_user_model()

@api_view(['POST'])
@csrf_exempt
def request_password_reset(request):
    if request.method == 'POST':
        email = request.data.get('email')

        try:
            user = CustomUser.objects.get(email=email)
            user.generate_reset_token()
            user.send_password_reset_email()
            
            return Response({'detail': 'Password reset email sent successfully.'})
        except ObjectDoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'detail': 'Invalid request.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@csrf_exempt
def reset_password(request):
    if request.method == 'POST':
        token = request.GET.get('token')  # Get the token from URL parameters
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        
        if token:  # Check if token is provided
            try:
                user = CustomUser.objects.get(reset_token=token, reset_token_expires__gte=timezone.now())
                if password == confirm_password:
                    print("Updating password...")
                    user.set_password(password)
                    user.reset_token = None
                    user.reset_token_expires = None
                    user.save()
                    print("Password update completed")
                    return JsonResponse({'message': 'Password reset successful'})
                else:
                    return JsonResponse({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
            except CustomUser.DoesNotExist:
                return JsonResponse({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return JsonResponse({'error': 'Token not provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    return JsonResponse({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
