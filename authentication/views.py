from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view, authentication_classes, permission_classes
)
from rest_framework.permissions import (
    IsAuthenticated, AllowAny
)
from .serializers import (
    SignupSerializer, ConfirmOTPSerializer, UserSerializer
)
import random
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.views import APIView
from django.contrib.auth import logout
from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from .models import CustomUser
from django.contrib.auth import get_user_model
from rest_framework.authentication import SessionAuthentication
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserProfileUpdateSerializer



@api_view(['POST'])
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
@csrf_exempt
def confirm_otp(request):
    serializer = ConfirmOTPSerializer(data=request.data)
    if serializer.is_valid():
        otp = serializer.validated_data['otp']

        try:
            user = CustomUser.objects.get(otp=otp)
            if user.is_active:
                return Response({'message': 'Account already confirmed.'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.is_active = True
            user.save()
            print("Account confirmed successfully.")
            return Response({'message': 'Account confirmed successfully.'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            print("Invalid OTP.")
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


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def confirm_otp(request):
    serializer = ConfirmOTPSerializer(data=request.data)
    if serializer.is_valid():
        otp = serializer.validated_data['otp']

        try:
            user = CustomUser.objects.get(otp=otp, is_confirmed=False)  # Only confirm if not already confirmed
            user.is_confirmed = True
            user.save()
            return Response({'message': 'Account confirmed successfully.'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'message': 'Invalid OTP or account already confirmed.'}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





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
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,
        })


from rest_framework.permissions import AllowAny

class LogoutView(APIView):
    permission_classes = [AllowAny]  # Allow any user to access this endpoint

    def post(self, request):
        logout(request)
        return Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)



class OTPVerificationView(APIView):
    def post(self, request, *args, **kwargs):
        received_otp = request.data.get('otp')
        user = request.user  # Assuming the user is authenticated

        if user.otp == received_otp and not user.otp_verified:
            # OTP matches and is not yet verified
            user.otp_verified = True
            user.save()
            return Response({'success': True})
        else:
            return Response({'success': False})





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
        password = request.data.get('password')  # Retrieve from request data
        confirm_password = request.data.get('confirm_password')  # Retrieve from request data
        
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




@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    print("Headers:", request.headers)
    print("Data:", request.data)
    print("Token:", request.auth)  # Print the token to verify it's being extracted
    
    if request.user.is_authenticated:
        print("Authenticated user:", request.user)
    else:
        print("User not authenticated.")
        
    user = request.user
    profile_data = {
        "firstName": user.first_name,
        "lastName": user.last_name,
        "mobileNumber": user.phone_number,
        "email": user.email,
        # ... other fields you want to include
    }
    return Response(profile_data)

            


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user

    serializer = UserProfileUpdateSerializer(data=request.data)
    if serializer.is_valid():
        user.first_name = serializer.validated_data.get('first_name', user.first_name)
        user.last_name = serializer.validated_data.get('last_name', user.last_name)
        user.phone_number = serializer.validated_data.get('phone_number', user.phone_number)
        user.save()
        return Response({'message': 'Profile updated successfully.'}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)