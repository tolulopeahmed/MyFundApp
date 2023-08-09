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