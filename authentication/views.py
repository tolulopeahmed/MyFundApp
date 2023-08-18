from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view, authentication_classes, permission_classes, api_view, 
    permission_classes, parser_classes
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
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserProfileUpdateSerializer
from rest_framework.permissions import IsAuthenticated
from .serializers import ProfilePictureUpdateSerializer
from rest_framework.parsers import FileUploadParser
from datetime import datetime
from django.utils.safestring import mark_safe



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
    subject = "[OTP] Did you just signup?"

    current_year = datetime.now().year  # Get the current year

    logo_url = "https://drive.google.com/uc?export=view&id=1MorbW_xLg4k2txNQdhUnBVxad8xeni-N"

    message = f"""
    <p><img src="{logo_url}" alt="MyFund Logo" style="display: block; margin: 0 auto; max-width: 100px; height: auto;"></p>

    <p>Hi {user.first_name}, </p>

    <p>We heard you'd like a shiny new MyFund account. Use the One-Time-Password (OTP) below to complete your signup. This code is valid only for 20 minutes, so chop-chop!</p>

    <h1 style="text-align: center; font-size: 24px;">{otp}</h1>

    <p>If you did not request to create a MyFund account, kindly ignore this email. Otherwise, buckle up, you're in for a treat!</p>

    <p>Cheers!<br>Your friends at MyFund</p>

    
    ...
    <p>Save, Buy Properties, Earn Rent<br>
    13, Gbajabiamila Street, Ayobo, Lagos.<br>
    www.myfundmobile.com</p>

    <p>MyFund ©{current_year}</p>


    """

    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    send_mail(subject, mark_safe(message), from_email, recipient_list, html_message=mark_safe(message))









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
        "profile_picture": user.profile_picture.url,  # Include the profile picture URL
    }
    return Response(profile_data)

            


@api_view(['PATCH'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    phone_number = request.data.get('phone_number')

    if first_name:
        user.first_name = first_name
    if last_name:
        user.last_name = last_name
    if phone_number:
        user.phone_number = phone_number

    user.save()
    return Response({'message': 'Profile updated successfully.'}, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def profile_picture_update(request):
    user = request.user
    serializer = ProfilePictureUpdateSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        
        # Get the updated user instance
        updated_user = CustomUser.objects.get(id=user.id)
        
        # Create a dictionary with the updated user information
        updated_user_data = {
            "firstName": updated_user.first_name,
            "lastName": updated_user.last_name,
            "mobileNumber": updated_user.phone_number,
            "email": updated_user.email,
            "profile_picture": updated_user.profile_picture.url,
        }
        
        return Response({'message': 'Profile picture updated successfully.', 'user': updated_user_data})
    
    return Response(serializer.errors, status=400)


