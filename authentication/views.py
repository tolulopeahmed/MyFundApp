from rest_framework import status, viewsets
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
from authentication.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserProfileUpdateSerializer
from rest_framework.permissions import IsAuthenticated
from .serializers import ProfilePictureUpdateSerializer
from rest_framework.parsers import FileUploadParser
from datetime import datetime
from django.utils.safestring import mark_safe
from django.db.models import F
import uuid

@api_view(['POST'])
@csrf_exempt
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Check if the user has a referrer (referral relationship)
        if user.referral:
            transaction_id = str(uuid.uuid4())[:10]  # Generate a UUID and truncate it to 10 characters

            # Create pending credit transactions for both the referrer and the referred user
            credit_transaction_referrer = Transaction.objects.create(
                user=user.referral,
                referral_email=user.email,  # Include the referral email
                transaction_type='pending',
                amount=1000,
                description="Referral Reward (Pending)",
                transaction_id=transaction_id,
            )
            credit_transaction_referrer.save()

            transaction_id = str(uuid.uuid4())[:10]  # Generate a UUID and truncate it to 10 characters
            credit_transaction_referred = Transaction.objects.create(
                user=user,
                referral_email=user.referral.email,  # Include the referrer's email
                transaction_type='pending',
                amount=1000,
                description="Referral Reward (Pending)",
                transaction_id=transaction_id,
            )
            credit_transaction_referred.save()

            # Update the user and referrer's pending reward
            user.referral.pending_referral_reward = F('pending_referral_reward') + 1000
            user.pending_referral_reward = F('pending_referral_reward') + 1000

            user.referral.save()

            # Send an email to the referrer (old user)
            send_referrer_pending_reward_email(user.referral, user.email)

            # Send an email to the referred user (new user)
            send_referred_pending_reward_email(user)

        # Generate OTP (you can use your own logic here)
        otp = generate_otp()
        user.otp = otp
        user.is_active = False  # Set the user as inactive until OTP confirmation
        user.save()

        # Send OTP to the user's email
        send_otp_email(user, otp)

        # Modify the response data to include the referral email for pending transactions
        response_data = serializer.data
        if user.referral:
            response_data['referral_email'] = user.referral.email

        return Response(response_data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def send_referrer_pending_reward_email(referrer, referred_email):
    subject = f"{referrer.first_name}, Your Referral Reward is Pending..."
    message = f"Hi {referrer.first_name},\n\nYour referral reward is pending. When your friend ({referred_email}) becomes active by making their first savings/investment, your reward will be confirmed in your wallet.\n\nThank you for using MyFund!\n\nKeep growing your funds.🥂\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."

    from_email = "MyFund <info@myfundmobile.com>"
    recipient_list = [referrer.email]

    send_mail(subject, message, from_email, recipient_list, fail_silently=False)

def send_referred_pending_reward_email(user):
    subject = f"{user.first_name}, Your Referral Reward is Pending"
    message = f"Hi {user.first_name},\n\nYou have received a referral reward for signing up with a referral. It will be confirmed in your wallet when you make your first savings of up to ₦20,000.\n\nThank you for using MyFund!\n\nKeep growing your funds.🥂\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."

    from_email = "MyFund <info@myfundmobile.com>"
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list, fail_silently=False)



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
    subject = "[OTP] Did You Just Signup?"
    current_year = datetime.now().year  # Get the current year
    logo_url = "https://drive.google.com/uc?export=view&id=1MorbW_xLg4k2txNQdhUnBVxad8xeni-N"
    message = f"""
    <p><img src="{logo_url}" alt="MyFund Logo" style="display: block; margin: 0 auto; max-width: 100px; height: auto;"></p>

    <p>Hi {user.first_name}, </p>

    <p>We heard you'd like a shiny new MyFund account. Use the One-Time-Password (OTP) below to complete your signup. This code is valid only for 20 minutes, so chop-chop!</p>

    <h1 style="text-align: center; font-size: 24px;">{otp}</h1>

    <p>If you did not request to create a MyFund account, kindly ignore this email. Otherwise, buckle up, you're in for a treat!</p>

    <p>Cheers! 🥂</p>

    
    ...
    <p>MyFund <br>
    Save, Buy Properties, Earn Rent<br>
    www.myfundmobile.com<br>
    13, Gbajabiamila Street, Ayobo, Lagos.</p>

    <p>MyFund ©{current_year}</p>


    """

    from_email = "MyFund <info@myfundmobile.com>"
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list, html_message=message)



def send_otp_reset_email(user, otp):
    subject = "[OTP] Password Reset"
    current_year = datetime.now().year
    logo_url = "https://drive.google.com/uc?export=view&id=1MorbW_xLg4k2txNQdhUnBVxad8xeni-N"
    message = f"""
    <p><img src="{logo_url}" alt="MyFund Logo" style="display: block; margin: 0 auto; max-width: 100px; height: auto;"></p>

    <p>Hi {user.first_name}, </p>

    <p>You have requested to reset your password. Use the One-Time-Password (OTP) below to complete the password reset. This code is valid only for a short time, so act quickly!</p>

    <h1 style="text-align: center; font-size: 24px;">{otp}</h1>

    <p>If you did not request a password reset, please ignore this email.</p>

    <p>Thank you,</p>
    
    <p>MyFund <br>
    Save, Buy Properties, Earn Rent<br>
    www.myfundmobile.com<br>
    13, Gbajabiamila Street, Ayobo, Lagos.</p>

    <p>MyFund ©{current_year}</p>
    """

    from_email = "MyFund <info@myfundmobile.com>"
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list, html_message=message)




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




from .models import CustomUser, PasswordReset  
@api_view(['POST'])
@csrf_exempt
def request_password_reset(request):
    if request.method == 'POST':
        email = request.data.get('email')

        try:
            user = CustomUser.objects.get(email=email)
            # Generate and store OTP
            otp = generate_otp()
            password_reset = PasswordReset.objects.create(user=user, otp=otp)

            # Send OTP reset email
            send_otp_reset_email(user, otp)

            return Response({'detail': 'Password reset OTP sent successfully.'})
        except CustomUser.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'detail': 'Invalid request.'}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@csrf_exempt
def reset_password(request):
    if request.method == 'POST':
        email = request.data.get('email')
        otp = request.data.get('otp')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')
        
        try:
            user = CustomUser.objects.get(email=email)
            # Check if the OTP is valid
            password_reset = PasswordReset.objects.get(user=user, otp=otp)
            
            if password == confirm_password:
                # Reset the password
                user.set_password(password)
                user.save()
                password_reset.delete()  # Delete the used OTP entry
                return Response({'message': 'Password reset successful'})
            else:
                return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
        except (CustomUser.DoesNotExist, PasswordReset.DoesNotExist):
            return Response({'error': 'Invalid email or OTP'}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)




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
        "profile_picture": user.profile_picture.url if user.profile_picture else None,
        'preferred_asset': user.preferred_asset,
        'savings_goal_amount': user.savings_goal_amount,
        'time_period': user.time_period,
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




from .serializers import SavingsGoalUpdateSerializer
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_savings_goal(request):
    user = request.user

    serializer = SavingsGoalUpdateSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()

        # Set is_first_time_signup flag to False after first login
        if user.is_first_time_signup:
            user.is_first_time_signup = False
            user.save()
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from .serializers import MessageSerializer  # Create a serializer for AdminMessage if needed
from .models import AutoSave, Message
from django.contrib.auth import get_user_model
from channels.layers import get_channel_layer
from rest_framework.parsers import MultiPartParser


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser])
def send_message(request, recipient_id):
    user = request.user
    content = request.data.get('content')
    image = request.data.get('image')

    recipient_id = 1

    try:
        recipient = get_user_model().objects.get(id=recipient_id)
    except get_user_model().DoesNotExist:
        return Response({'error': 'Recipient not found'}, status=status.HTTP_404_NOT_FOUND)

    if not content and not image:
        return Response({'error': 'Message content or image is required'}, status=status.HTTP_400_BAD_REQUEST)

    message = Message.objects.create(sender=user, recipient=recipient, content=content, image=image)

    message_data = {
        'type': 'chat.message',
        'message': {
            'content': message.content,
            'image': message.image.url if message.image else None,
            'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'sender_id': message.sender.id,
        }
    }

    return Response({'success': True})




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, recipient_id):
    user = request.user
    recipient = get_user_model().objects.get(id=recipient_id)

    # Retrieve messages from the database
    messages = Message.objects.filter(sender__in=[user, recipient], recipient__in=[user, recipient]).order_by('timestamp')

    # Serialize messages and create a list of message data
    message_data_list = []
    for message in messages:
        message_data = {
            'content': message.content,
            'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'sender_id': message.sender.id,
            'image': message.image.url if message.image else None,  # Include the image URL if available
        }
        message_data_list.append(message_data)

    return Response(message_data_list)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_admin_reply(request, message_id):
    admin_user = request.user
    content = request.data.get('content')

    try:
        message = Message.objects.get(id=message_id)
        if message.recipient != admin_user:
            return Response({'error': 'You are not authorized to reply to this message'}, status=status.HTTP_403_FORBIDDEN)

    except Message.DoesNotExist:
        return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)

    if not content:
        return Response({'error': 'Message content is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Create a new message from admin to user
    reply_message = Message.objects.create(sender=admin_user, recipient=message.sender, content=content)

    return Response({'success': True})










from django.contrib import messages
from django.urls import reverse

def reply_to_message(request, message_id):
    # Logic to handle replying to a message
    if request.method == 'POST':
        # Process the reply message and save it to the database
        reply_content = request.POST.get('content')  # Get the reply content from the form
        if reply_content:
            # Process the reply content and save it to the database
            # For example, you can create a new message instance and save it
            
            messages.success(request, 'Reply message sent successfully.')
            return redirect(reverse('admin:authentication_message_changelist'))
        else:
            messages.error(request, 'Reply content cannot be empty.')
            return redirect(reverse('admin:authentication_message_changelist'))
    
    # Render a form to reply to the message
    context = {
        'message_id': message_id,
    }
    return render(request, 'admin/message/reply_message.html', context)




from .serializers import BankAccountSerializer
from .models import BankAccount
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from .serializers import BankAccountSerializer
import requests

class BankAccountViewSet(viewsets.ModelViewSet):
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def get_user_banks(self, request):
        user_banks = BankAccount.objects.filter(user=request.user)
        serializer = BankAccountSerializer(user_banks, many=True)
        return Response(serializer.data)

    def resolve_account(self, account_number, bank_code):
        secret_key = "sk_test_dacd07b029231eed22f407b3da805ecafdf2668f"
        url = f"https://api.paystack.co/bank/resolve?account_number={account_number}&bank_code={bank_code}"
        headers = {"Authorization": f"Bearer {secret_key}"}

        response = requests.get(url, headers=headers)

        if response.status_code == status.HTTP_200_OK:
            response_data = response.json()
            account_name = response_data.get("data", {}).get("account_name", "")
            return account_name
        else:
            return None

def perform_create(self, serializer):
    account_number = self.request.data.get("accountNumber")
    bank_code = self.request.data.get("bankCode")

    if account_number and bank_code:
        account_name = self.resolve_account(account_number, bank_code)

        if account_name is not None:
            # Create a dictionary with all the data to save
            data_to_save = {
                "user": self.request.user,
                "bank_name": serializer.validated_data.get("bank_name", ""),
                "account_number": account_number,
                "bank_code": bank_code,
                "account_name": account_name,
            }

            paystack_recipient_code = create_paystack_recipient(account_name, account_number, bank_code)
            data_to_save["paystack_recipient_code"] = paystack_recipient_code

            serializer = BankAccountSerializer(data=data_to_save)

            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Bank account added successfully."}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "Failed to resolve account details."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        data_to_save = {
            "user": self.request.user,
            "bank_name": "",
            "account_number": "",
            "bank_code": "",
            "account_name": "",
        }

        serializer = BankAccountSerializer(data=data_to_save)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Bank account added without account details resolution."}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.db import IntegrityError

import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_bank_account(request):
    bank_name = request.data.get("bankName")
    account_number = request.data.get("accountNumber")
    account_name = request.data.get("accountName")
    bank_code = request.data.get("bankCode")  # Add this line to get the bank_code

    if bank_name and account_number and account_name and bank_code:
        try:
            paystack_recipient_code = create_paystack_recipient(bank_name, account_number, bank_code)  # Pass bank_code

            if paystack_recipient_code:
                bank_account = BankAccount(
                    user=request.user,
                    bank_name=bank_name,
                    account_number=account_number,
                    account_name=account_name,
                    bank_code=bank_code,  # Include bank_code here
                    is_default=False,
                    paystack_recipient_code=paystack_recipient_code  # Store the recipient code
                )
                bank_account.save()

                serializer = BankAccountSerializer(bank_account)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                error_message = "Failed to create Paystack recipient."
                logger.error(error_message)
                return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)

        except IntegrityError:
            error_message = "This bank account is already associated with another user."
            logger.error(error_message)
            return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            error_message = f"An error occurred: {str(e)}"
            logger.error(error_message)
            return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)

    else:
        error_message = "accountNumber, bankName, bankCode, and accountName are required."
        logger.error(error_message)
        return Response({"error": error_message}, status=status.HTTP_400_BAD_REQUEST)

    
    
from django.db.models import Count
from django.db import transaction


@api_view(['DELETE'])
def delete_bank_account(request, account_number):
    try:
        bank_account = BankAccount.objects.get(account_number=account_number)
    except BankAccount.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        duplicates = BankAccount.objects.filter(account_number=account_number).annotate(count=Count('id')).filter(count__gt=1)

        with transaction.atomic():
            for duplicate in duplicates:
                if duplicate.id != bank_account.id:
                    duplicate.delete()

            bank_account.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_banks(request):
    user_banks = BankAccount.objects.filter(user=request.user)
    serializer = BankAccountSerializer(user_banks, many=True)
    return Response(serializer.data)




from .models import Card
from .serializers import CardSerializer, TransactionSerializer
from rest_framework import generics


class BankAccountListCreateView(generics.ListCreateAPIView):
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BankAccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        instance.delete()

class UserBankAccountListView(generics.ListAPIView):
    serializer_class = BankAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BankAccount.objects.filter(user=self.request.user)






class CardListCreateView(generics.ListCreateAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CardDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

class UserCardListView(generics.ListAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Card.objects.filter(user=self.request.user)
    
class DeleteCardView(generics.DestroyAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        card = self.get_object()
        card.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




class TransactionCreateView(generics.CreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,  # Set the user field to the authenticated user
            description="Add Card Transaction"  # Provide a transaction description
        )

from .models import Transaction

channel_layer = get_channel_layer()

# Modify UserTransactionListView to use the Transaction model
class UserTransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        transactions = Transaction.objects.filter(user=user).order_by('-date', '-time')
        return transactions



from .serializers import AccountBalancesSerializer

class AccountBalancesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = AccountBalancesSerializer(user)
        return Response(serializer.data)


from graphene_django.views import GraphQLView
from graphql_jwt.decorators import jwt_cookie
from django.utils.decorators import method_decorator

class CustomGraphQLView(GraphQLView):
    @method_decorator(jwt_cookie)
    def dispatch(self, request, *args, **kwargs):
        # Your existing authentication logic
        if request.user.is_authenticated:
            print("User is authenticated:", request.user)
            return super().dispatch(request, *args, **kwargs)
        else:
            print("User is not authenticated. Sending 401 response.")
            return JsonResponse({'error': 'Authentication required. Login first'}, status=401)






paystack_secret_key = "sk_test_dacd07b029231eed22f407b3da805ecafdf2668f"  # Use your actual secret key

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def quicksave(request):
    # Get the selected card details from the request
    card_id = request.data.get('card_id')
    amount = request.data.get('amount')

    # Retrieve the card details from your database
    try:
        card = Card.objects.get(id=card_id)
    except Card.DoesNotExist:
        return Response({'error': 'Selected card not found'}, status=status.HTTP_404_NOT_FOUND)

    # Use the card details to initiate a payment with Paystack
    paystack_url = "https://api.paystack.co/charge"

    payload = {
        "card": {
            "number": card.card_number,
            "cvv": card.cvv,
            "expiry_month": card.expiry_date.split('/')[0],
            "expiry_year": card.expiry_date.split('/')[1],
        },
        "email": request.user.email,  # Assuming you have a user authenticated with a JWT token
        "amount": int(amount) * 100,  # Amount in kobo (multiply by 100)
    }

    headers = {
        "Authorization": f"Bearer {paystack_secret_key}",
        "Content-Type": "application/json",
    }

    response = requests.post(paystack_url, json=payload, headers=headers)
    paystack_response = response.json()

    if paystack_response.get("status"):
        # Payment successful, update user's savings and create a transaction
        user = request.user
        user.savings += int(amount)
        user.save()

        # Call the confirm_referral_rewards method here
        is_referrer = True  # Determine whether the user is the referrer or the referred user
        user.confirm_referral_rewards(is_referrer=True)  # Pass True if the user is a referrer, or False if not

        # Send a confirmation email
        subject = "QuickSave Successful!"
        message = f"Well done {user.first_name},\n\nYour QuickSave was successful and ₦{amount} has been successfully added to your SAVINGS account. \n\nKeep growing your funds.🥂\n\nMyFund"
        from_email = "MyFund <info@myfundmobile.com>"
        recipient_list = [user.email]

        send_mail(subject, message, from_email, recipient_list, fail_silently=False)

        # Create a transaction record
        transaction = Transaction.objects.create(
            user=user,
            transaction_type="credit",
            amount=int(amount),
            date=timezone.now().date(),
            time=timezone.now().time(),
            description=f"QuickSave",
            transaction_id=paystack_response.get("data", {}).get("reference"), 
        )

        # After processing a savings or investment transaction
        user.update_total_savings_and_investment_this_month()

        # Return a success response
        return Response({'message': 'QuickSave successful', 'transaction_id': transaction.transaction_id}, status=status.HTTP_200_OK)
    else:
        # Payment failed, return an error response
        return Response({'error': 'QuickSave failed'}, status=status.HTTP_400_BAD_REQUEST)



import time
import threading
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def autosave(request):
    user = request.user
    card_id = request.data.get('card_id')
    amount = request.data.get('amount')
    frequency = request.data.get('frequency')

    # Validate frequency (should be one of 'hourly', 'daily', 'weekly', 'monthly')
    valid_frequencies = ['hourly', 'daily', 'weekly', 'monthly']
    if frequency not in valid_frequencies:
        return Response({'error': 'Invalid frequency'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        active_autosave = AutoSave.objects.get(user=user, active=True)
        return Response({'error': 'User already has an active autosave'}, status=status.HTTP_400_BAD_REQUEST)
    except AutoSave.DoesNotExist:
        pass

        card = Card.objects.get(id=card_id)
    except Card.DoesNotExist:
        return Response({'error': 'Selected card not found'}, status=status.HTTP_404_NOT_FOUND)

    # Calculate the interval based on the selected frequency (in seconds)
    intervals = {
        'hourly': 3600,
        'daily': 86400,
        'weekly': 604800,
        'monthly': 2419200,  # Approximation for 28-31 days
    }

    interval_seconds = intervals.get(frequency)

    if not interval_seconds:
        return Response({'error': 'Invalid frequency'}, status=status.HTTP_400_BAD_REQUEST)

    # Create an 'AutoSave' record
    AutoSave.objects.create(user=user, frequency=frequency, amount=amount, active=True)

    # Use the card details to initiate a payment with Paystack periodically
    def auto_charge():
        while True:
            # Delay for the specified interval
            time.sleep(interval_seconds)

            # Perform the auto charge
            paystack_url = "https://api.paystack.co/charge"

            payload = {
                "card": {
                    "number": card.card_number,
                    "cvv": card.cvv,
                    "expiry_month": card.expiry_date.split('/')[0],
                    "expiry_year": card.expiry_date.split('/')[1],
                },
                "email": user.email,
                "amount": int(amount) * 100,  # Amount in kobo (multiply by 100)
            }

            headers = {
                "Authorization": f"Bearer {paystack_secret_key}",
                "Content-Type": "application/json",
            }

            response = requests.post(paystack_url, json=payload, headers=headers)
            paystack_response = response.json()

            if paystack_response.get("status"):
                # Payment successful, update user's savings and create a transaction
                user.savings += int(amount)
                user.save()

                # Create a transaction record
                Transaction.objects.create(
                    user=user,
                    transaction_type="credit",
                    amount=int(amount),
                    date=timezone.now().date(),
                    time=timezone.now().time(),
                    description=f"AutoSave",
                    transaction_id=paystack_response.get("data", {}).get("reference"),
                )

                # Call the confirm_referral_rewards method here
                user.confirm_referral_rewards(is_referrer=True)  # Pass True if the user is a referrer, or False if not
               
                # After processing a savings or investment transaction
                user.update_total_savings_and_investment_this_month()

                # Send a confirmation email
                subject = "AutoSave Successful!"
                message = f"Hi {user.first_name},\n\nYour AutoSave ({frequency}) of ₦{amount} was successful. It has been added to your SAVINGS account. \n\nKeep growing your funds.🥂\n\n\nMyFund \nSave, Buy Properties, Earn Rent \nwww.myfundmobile.com \n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
                from_email = "MyFund <info@myfundmobile.com>"
                recipient_list = [user.email]

                send_mail(subject, message, from_email, recipient_list, fail_silently=False)



    # Start a new thread for the auto charge process
    threading.Thread(target=auto_charge).start()

    user.autosave_enabled = True
    user.save()

    # Send an immediate email alert for activation
    subject = "AutoSave Activated!"
    message = f"Well done {user.first_name},\n\nAutoSave ({frequency}) was successfully activated. You are now saving ₦{amount} {frequency} and your next autosave transaction will happen in the next selected periodic interval. \n\n\nKeep growing your funds.🥂\n\nMyFund  \nSave, Buy Properties, Earn Rent \nwww.myfundmobile.com \n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
    from_email = "MyFund <info@myfundmobile.com>"
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list, fail_silently=False)
    # Return a success response indicating that AutoSave has been activated
    return Response({'message': 'AutoSave activated'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deactivate_autosave(request):
    user = request.user
    frequency = request.data.get('frequency')

    try:
        # Find the active AutoSave for the user with the given frequency
        autosave = AutoSave.objects.get(user=user, frequency=frequency, active=True)

        # Deactivate the AutoSave by setting it to False
        autosave.active = False
        autosave.save()

        # Delete the AutoSave object from the database
        autosave.delete()

        user.autosave_enabled = False
        user.save()

        # Send a confirmation email
        subject = "AutoSave Deactivated!"
        message = f"Hi {user.first_name},\n\nYour AutoSave ({frequency}) has been deactivated. \n\nKeep growing your funds.🥂\n\n\nMyFund  \nSave, Buy Properties, Earn Rent \nwww.myfundmobile.com \n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
        from_email = "MyFund <info@myfundmobile.com>"
        recipient_list = [user.email]

        send_mail(subject, message, from_email, recipient_list)

        # Return a success response indicating that AutoSave has been deactivated
        return Response({'message': 'AutoSave deactivated'}, status=status.HTTP_200_OK)

    except AutoSave.DoesNotExist:
        return Response({'error': 'AutoSave not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_autosave_status(request):
    user = request.user
    autosave_enabled = user.autosave_enabled
    
    # You can retrieve the user's active auto-save settings here
    try:
        active_autosave = AutoSave.objects.get(user=user, active=True)
        autoSaveSettings = {
            'active': True,
            'amount': active_autosave.amount,
            'frequency': active_autosave.frequency,
        }
    except AutoSave.DoesNotExist:
        autoSaveSettings = {
            'active': False,
            'amount': 0,
            'frequency': '',
        }
    
    return Response({'autosave_enabled': autosave_enabled, 'autoSaveSettings': autoSaveSettings}, status=status.HTTP_200_OK)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def quickinvest(request):
    # Get the selected card details from the request
    card_id = request.data.get('card_id')
    amount = request.data.get('amount')

    # Retrieve the card details from your database
    try:
        card = Card.objects.get(id=card_id)
    except Card.DoesNotExist:
        return Response({'error': 'Selected card not found'}, status=status.HTTP_404_NOT_FOUND)

    # Use the card details to initiate a payment with Paystack
    paystack_url = "https://api.paystack.co/charge"

    payload = {
        "card": {
            "number": card.card_number,
            "cvv": card.cvv,
            "expiry_month": card.expiry_date.split('/')[0],
            "expiry_year": card.expiry_date.split('/')[1],
        },
        "email": request.user.email,  # Assuming you have a user authenticated with a JWT token
        "amount": int(amount) * 100,  # Amount in kobo (multiply by 100)
    }

    headers = {
        "Authorization": f"Bearer {paystack_secret_key}",
        "Content-Type": "application/json",
    }

    response = requests.post(paystack_url, json=payload, headers=headers)
    paystack_response = response.json()

    if paystack_response.get("status"):
        # Payment successful, update user's investments and create a transaction
        user = request.user
        user.investment += int(amount)
        user.save()

        # Call the confirm_referral_rewards method here
        user.confirm_referral_rewards(is_referrer=True)  # Pass True if the user is a referrer, or False if not

        # Send a confirmation email
        subject = "QuickInvest Successful!"
        message = f"Well done {user.first_name},\n\nYour QuickInvest was successful and ₦{amount} has been successfully added to your INVESTMENTS account. \n\nKeep growing your funds.🥂\n\n\nMyFund \nSave, Buy Properties, Earn Rent \nwww.myfundmobile.com \n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
        from_email = "MyFund <info@myfundmobile.com>"
        recipient_list = [user.email]

        send_mail(subject, message, from_email, recipient_list, fail_silently=False)

        # Create a transaction record
        transaction = Transaction.objects.create(
            user=user,
            transaction_type="credit",
            amount=int(amount),
            date=timezone.now().date(),
            time=timezone.now().time(),
            description=f"QuickInvest",
            transaction_id=paystack_response.get("data", {}).get("reference"),
        )

        # After processing a savings or investment transaction
        user.update_total_savings_and_investment_this_month()
        
        # Return a success response
        return Response({'message': 'QuickInvest successful', 'transaction_id': transaction.transaction_id}, status=status.HTTP_200_OK)
    else:
        # Payment failed, return an error response
        return Response({'error': 'QuickInvest failed'}, status=status.HTTP_400_BAD_REQUEST)
    


from .models import AutoInvest
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def autoinvest(request):
    user = request.user
    card_id = request.data.get('card_id')
    amount = request.data.get('amount')
    frequency = request.data.get('frequency')

    # Validate frequency (should be one of 'hourly', 'daily', 'weekly', 'monthly')
    valid_frequencies = ['hourly', 'daily', 'weekly', 'monthly']
    if frequency not in valid_frequencies:
        return Response({'error': 'Invalid frequency'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        active_autoinvest = AutoInvest.objects.get(user=user, active=True)
        return Response({'error': 'User already has an active autoinvest'}, status=status.HTTP_400_BAD_REQUEST)
    except AutoInvest.DoesNotExist:
        pass

    card = Card.objects.get(id=card_id)
    if not card:
        return Response({'error': 'Selected card not found'}, status=status.HTTP_404_NOT_FOUND)

    # Calculate the interval based on the selected frequency (in seconds)
    intervals = {
        'hourly': 3600,
        'daily': 86400,
        'weekly': 604800,
        'monthly': 2419200,  # Approximation for 28-31 days
    }

    interval_seconds = intervals.get(frequency)

    if not interval_seconds:
        return Response({'error': 'Invalid frequency'}, status=status.HTTP_400_BAD_REQUEST)

    # Create an 'AutoInvest' record
    autoinvest = AutoInvest.objects.create(user=user, frequency=frequency, amount=amount, active=True)

    # Set the 'autoinvest_enabled' field to True
    user.autoinvest_enabled = True  # Add this line
    user.save()

    # Use the card details to initiate a payment with Paystack periodically
    def auto_invest():
        while True:
            # Delay for the specified interval
            time.sleep(interval_seconds)

            # Perform the auto invest
            paystack_url = "https://api.paystack.co/charge"

            payload = {
                "card": {
                    "number": card.card_number,
                    "cvv": card.cvv,
                    "expiry_month": card.expiry_date.split('/')[0],
                    "expiry_year": card.expiry_date.split('/')[1],
                },
                "email": user.email,
                "amount": int(amount) * 100,  # Amount in kobo (multiply by 100)
            }

            headers = {
                "Authorization": f"Bearer {paystack_secret_key}",
                "Content-Type": "application/json",
            }

            response = requests.post(paystack_url, json=payload, headers=headers)
            paystack_response = response.json()

            if paystack_response.get("status"):
                # Investment successful, update user's investments and create a transaction
                user.investment += int(amount)
                user.save()

                # Call the confirm_referral_rewards method here
                user.confirm_referral_rewards(is_referrer=True)  # Pass True if the user is a referrer, or False if not

                # Create a transaction record
                Transaction.objects.create(
                    user=user,
                    transaction_type="credit",
                    amount=int(amount),
                    date=timezone.now().date(),
                    time=timezone.now().time(),
                    description=f"AutoInvest",
                    transaction_id=paystack_response.get("data", {}).get("reference"),
                )

                # After processing a savings or investment transaction
                user.update_total_savings_and_investment_this_month()

                # Send a confirmation email
                subject = "AutoInvest Successful!"
                message = f"Hi {user.first_name},\n\nYour AutoInvest ({frequency}) of ₦{amount} was successful. It has been added to your INVESTMENTS account. \n\nKeep growing your funds.🥂\n\n\nMyFund \nSave, Buy Properties, Earn Rent \nwww.myfundmobile.com \n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
                from_email = "MyFund <info@myfundmobile.com>"
                recipient_list = [user.email]

                send_mail(subject, message, from_email, recipient_list, fail_silently=False)



    # Start a new thread for the auto invest process
    threading.Thread(target=auto_invest).start()

    # Send an immediate email alert for activation
    subject = "AutoInvest Activated!"
    message = f"Well done {user.first_name},\n\nAutoInvest ({frequency}) was successfully activated. You are now investing ₦{amount} {frequency} and your next AutoInvest transaction will happen in the next selected periodic interval. \n\n\nKeep growing your funds.🥂\n\nMyFund  \nSave, Buy Properties, Earn Rent \nwww.myfundmobile.com \n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
    from_email = "MyFund <info@myfundmobile.com>"
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list, fail_silently=False)
    # Return a success response indicating that AutoInvest has been activated
    return Response({'message': 'AutoInvest activated'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deactivate_autoinvest(request):
    user = request.user
    frequency = request.data.get('frequency')

    try:
        # Find the active AutoInvest for the user with the given frequency
        autoinvest = AutoInvest.objects.get(user=user, frequency=frequency, active=True)

        # Deactivate the AutoInvest by setting it to False
        autoinvest.active = False
        autoinvest.save()

        # Delete the AutoInvest object from the database
        autoinvest.delete()

        user.autoinvest_enabled = False
        user.save()

        # Send a confirmation email
        subject = "AutoInvest Deactivated!"
        message = f"Hi {user.first_name},\n\nYour AutoInvest ({frequency}) has been deactivated. \n\nKeep growing your funds.🥂\n\n\nMyFund  \nSave, Buy Properties, Earn Rent \nwww.myfundmobile.com \n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
        from_email = "MyFund <info@myfundmobile.com>"
        recipient_list = [user.email]

        send_mail(subject, message, from_email, recipient_list)

        # Return a success response indicating that AutoInvest has been deactivated
        return Response({'message': 'AutoInvest deactivated'}, status=status.HTTP_200_OK)

    except AutoInvest.DoesNotExist:
        return Response({'error': 'AutoInvest not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_autoinvest_status(request):
    user = request.user
    autoinvest_enabled = user.autoinvest_enabled
    
    # You can retrieve the user's active auto-invest settings here
    try:
        active_autoinvest = AutoInvest.objects.get(user=user, active=True)
        autoInvestSettings = {
            'active': True,
            'amount': active_autoinvest.amount,
            'frequency': active_autoinvest.frequency,
        }
    except AutoInvest.DoesNotExist:
        autoInvestSettings = {
            'active': False,
            'amount': 0,
            'frequency': '',
        }
    
    return Response({'autoinvest_enabled': autoinvest_enabled, 'autoInvestSettings': autoInvestSettings}, status=status.HTTP_200_OK)



from decimal import Decimal
import uuid  # Import the uuid library
random_uuid = uuid.uuid4()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def savings_to_investment(request):
    user = request.user
    amount = Decimal(request.data.get('amount', 0))

    # Validate that the user has enough savings
    if user.savings < amount:
        return Response({'error': 'Insufficient savings balance.'}, status=status.HTTP_400_BAD_REQUEST)

    # Generate a unique transaction ID
    transaction_id = str(uuid.uuid4())[:16]

    try:
        # Create a transaction record with the details
        transaction = Transaction(
            user=user,
            transaction_type='credit',
            amount=amount,
            date=timezone.now().date(),
            time=timezone.now().time(),
            description='Withdrawal (Savings > Investment)',
            transaction_id=transaction_id
        )
        transaction.save()

        # Perform the savings to investment transfer
        user.savings -= amount
        user.investment += amount
        user.save()

        return Response({'message': 'Savings to investment transfer successful.', 'transaction_id': transaction_id}, status=status.HTTP_200_OK)

    except IntegrityError:
        # Handle the case where a unique constraint (transaction_id) is violated
        return Response({'error': 'Transaction ID conflict. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def investment_to_savings(request):
    user = request.user
    amount = Decimal(request.data.get('amount', 0))

    # Validate that the user has enough investment balance
    if user.investment < amount:
        return Response({'error': 'Insufficient investment balance.'}, status=status.HTTP_400_BAD_REQUEST)

    # Generate a unique transaction ID
    transaction_id = str(uuid.uuid4())[:16]

    try:
        # Create a transaction record with the details
        transaction = Transaction(
            user=user,
            transaction_type='credit',  # Change to 'credit' for funds going back to savings
            amount=amount,
            date=timezone.now().date(),
            time=timezone.now().time(),
            description='Withdrawal (Investment > Savings)',  # Update description
            transaction_id=transaction_id
        )
        transaction.save()

        # Perform the investment to savings transfer
        user.investment -= amount
        user.savings += amount  # Adjust savings
        user.save()

        return Response({'message': 'Investment to savings transfer successful.', 'transaction_id': transaction_id}, status=status.HTTP_200_OK)

    except IntegrityError:
        # Handle the case where a unique constraint (transaction_id) is violated
        return Response({'error': 'Transaction ID conflict. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wallet_to_savings(request):
    user = request.user
    amount = Decimal(request.data.get('amount', 0))

    # Validate that the user has enough wallet balance
    if user.wallet < amount:
        return Response({'error': 'Insufficient wallet balance.'}, status=status.HTTP_400_BAD_REQUEST)

    # Generate a unique transaction ID
    transaction_id = str(uuid.uuid4())[:16]

    try:
        # Create a transaction record with the details
        transaction = Transaction(
            user=user,
            transaction_type='credit',  # Debit for withdrawal
            amount=amount,
            date=timezone.now().date(),
            time=timezone.now().time(),
            description='Withdrawal (Wallet > Savings)',
            transaction_id=transaction_id
        )
        transaction.save()

        # Perform the wallet to savings transfer
        user.wallet -= amount
        user.savings += amount
        user.save()

        return Response({'message': 'Wallet to savings transfer successful.', 'transaction_id': transaction_id}, status=status.HTTP_200_OK)

    except IntegrityError:
        # Handle the case where a unique constraint (transaction_id) is violated
        return Response({'error': 'Transaction ID conflict. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wallet_to_investment(request):
    user = request.user
    amount = Decimal(request.data.get('amount', 0))

    # Validate that the user has enough wallet balance
    if user.wallet < amount:
        return Response({'error': 'Insufficient wallet balance.'}, status=status.HTTP_400_BAD_REQUEST)

    # Generate a unique transaction ID
    transaction_id = str(uuid.uuid4())[:16]

    try:
        # Create a transaction record with the details
        transaction = Transaction(
            user=user,
            transaction_type='credit',  # Debit for withdrawal
            amount=amount,
            date=timezone.now().date(),
            time=timezone.now().time(),
            description='Withdrawal (Wallet > Investment)',
            transaction_id=transaction_id
        )
        transaction.save()

        # Perform the wallet to investment transfer
        user.wallet -= amount
        user.investment += amount
        user.save()

        return Response({'message': 'Wallet to investment transfer successful.', 'transaction_id': transaction_id}, status=status.HTTP_200_OK)

    except IntegrityError:
        # Handle the case where a unique constraint (transaction_id) is violated
        return Response({'error': 'Transaction ID conflict. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)





@api_view(['POST'])
@permission_classes([IsAuthenticated])
def withdraw_to_local_bank(request):
    user = request.user
    source_account = request.data.get('source_account', '')  # 'savings', 'investment', 'wallet'
    target_bank_account_id = request.data.get('target_bank_account_id', '')
    amount = Decimal(request.data.get('amount', 0))

    # Validate that the user has enough balance in the source account
    if source_account == 'savings' and user.savings < amount:
        return Response({'error': 'Insufficient savings balance.'}, status=status.HTTP_400_BAD_REQUEST)
    elif source_account == 'investment' and user.investment < amount:
        return Response({'error': 'Insufficient investment balance.'}, status=status.HTTP_400_BAD_REQUEST)
    elif source_account == 'wallet' and user.wallet < amount:
        return Response({'error': 'Insufficient wallet balance.'}, status=status.HTTP_400_BAD_REQUEST)

    # Validate that the target_bank_account_id belongs to the user
    try:
        target_bank_account = BankAccount.objects.get(id=target_bank_account_id, user=user)
    except BankAccount.DoesNotExist:
        return Response({'error': 'Target bank account not found.'}, status=status.HTTP_400_BAD_REQUEST)

    # Calculate the service charge based on the source account
    service_charge_percentage = 0.0
    if source_account == 'savings':
        service_charge_percentage = 5
    elif source_account == 'investment':
        service_charge_percentage = 10

    # Calculate the service charge and total withdrawal amount
    service_charge = (service_charge_percentage / 100) * float(amount)
    total_amount = float(amount) + service_charge

    # Generate a unique transaction ID
    transaction_id = str(uuid.uuid4())[:16]

    try:
        # Create a transaction record with the details
        transaction = Transaction(
            user=user,
            transaction_type='debit',
            amount=amount,
            service_charge=service_charge,
            total_amount=total_amount,
            date=timezone.now().date(),
            time=timezone.now().time(),
            description=f'Withdrawal ({source_account.capitalize()} > Bank)',
            transaction_id=transaction_id
        )
        transaction.save()

        # Perform the withdrawal to the local bank using Paystack API
        paystack_response = make_withdrawal_to_local_bank(user, target_bank_account, total_amount)
        print("Paystack API Response:", paystack_response)

        if paystack_response.get('data', {}).get('status') == 'success':
            # Deduct the total amount (including service charge) from the source account
            # Convert total_amount to Decimal
            total_amount_decimal = Decimal(total_amount)
            print(f"Before deduction - {source_account.capitalize()} balance: {user.savings if source_account == 'savings' else user.investment if source_account == 'investment' else user.wallet}")

            # Deduct the total amount (including service charge) from the source account
            # Convert total_amount to Decimal
            total_amount_decimal = Decimal(total_amount)
            print(f"Before deduction - {source_account.capitalize()} balance: {user.savings if source_account == 'savings' else user.investment if source_account == 'investment' else user.wallet}")

            if source_account == 'savings':
                if user.savings >= total_amount_decimal:
                    user.savings -= total_amount_decimal
                    user.save()
                else:
                    return Response({'error': 'Insufficient savings balance.'}, status=status.HTTP_400_BAD_REQUEST)
            elif source_account == 'investment':
                if user.investment >= total_amount_decimal:
                    user.investment -= total_amount_decimal
                    user.save()
                else:
                    return Response({'error': 'Insufficient investment balance.'}, status=status.HTTP_400_BAD_REQUEST)
            elif source_account == 'wallet':
                if user.wallet >= total_amount_decimal:
                    user.wallet -= total_amount_decimal
                    user.save()
                else:
                    return Response({'error': 'Insufficient wallet balance.'}, status=status.HTTP_400_BAD_REQUEST)

            print(f"After deduction - {source_account.capitalize()} balance: {user.savings if source_account == 'savings' else user.investment if source_account == 'investment' else user.wallet}")

            updated_balance = {
                'savings': user.savings,
                'investment': user.investment,
                'wallet': user.wallet,
            }

            user.save()


            bank_name = target_bank_account.bank_name
            # Send a confirmation email to the user
            subject = f"Withdrawal from {source_account.capitalize()} Successful!"
            message = f"Hi {user.first_name},\n\nYour withdrawal of ₦{amount} from your {source_account.capitalize()} account has been sent to your {bank_name} account successfully.\n\nThank you for using MyFund.\n\nKeep growing your funds.🥂\n\n\nMyFund \nSave, Buy Properties, Earn Rent \nwww.myfundmobile.com \n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
            from_email = "MyFund <info@myfundmobile.com>"
            recipient_list = [user.email]


            send_mail(subject, message, from_email, recipient_list, fail_silently=False)

            return Response({
                'message': 'Withdrawal to local bank successful.',
                'transaction_id': transaction_id,
                'updated_balance': updated_balance,  # Include the updated balance here
            }, status=status.HTTP_200_OK)        
        else:
            # Handle Paystack withdrawal failure
            return Response({'error': 'Withdrawal to local bank failed. Please try again later.'}, status=status.HTTP_400_BAD_REQUEST)

    except IntegrityError:
        # Handle the case where a unique constraint (transaction_id) is violated
        return Response({'error': 'Transaction ID conflict. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)


import logging

logger = logging.getLogger(__name__)

def create_paystack_recipient(bank_name, account_number, bank_code):
    try:
        # Make a request to the Paystack API to create a recipient
        url = 'https://api.paystack.co/transferrecipient'
        headers = {
            'Authorization': f'Bearer {paystack_secret_key}',
            'Content-Type': 'application/json',
        }
        data = {
            'type': 'nuban',
            'name': bank_name,
            'account_number': account_number,
            'bank_code': bank_code,  # Use the actual bank code
            'currency': 'NGN',
        }
        
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code == status.HTTP_201_CREATED:
            recipient_data = response.json().get('data', {})
            return recipient_data.get('recipient_code')
        else:
            error_message = f"Failed to create Paystack recipient. Paystack API Response: {response.status_code}, {response.text}"
            logger.error(error_message)
            return None
    except Exception as e:
        error_message = f"An error occurred while creating Paystack recipient: {str(e)}"
        logger.error(error_message)
        return None




def make_withdrawal_to_local_bank(user, target_bank_account, amount):
    # Make a withdrawal request to Paystack API
    url = 'https://api.paystack.co/transfer'
    headers = {
        'Authorization': f'Bearer {paystack_secret_key}',
        'Content-Type': 'application/json',
    }
    data = {
        'source': 'balance',
        'amount': int(amount * 100),  # Amount in kobo (100 kobo = 1 Naira)
        'recipient': target_bank_account.paystack_recipient_code,  # Paystack recipient code of the target bank account
    }

    # Log the Paystack API request
    print("Paystack API Request:")
    print("URL:", url)
    print("Headers:", headers)
    print("Data:", data)
    
    response = requests.post(url, headers=headers, json=data)
    
    # Log the Paystack API response for debugging
    print("Paystack API Response Status Code:", response.status_code)
    print("Paystack API Response Text:", response.text)  # This will print the response body

    return response.json()


from decimal import Decimal

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_wallet_transfer(request):
    sender = request.user
    data = request.data
    target_email = data.get('recipient_email')  # Update to match the key in the request data
    amount = Decimal(data.get('amount'))

    # Verify that the sender has enough balance in their wallet
    if sender.wallet < amount:
        return Response({'error': 'Insufficient balance in the wallet.'}, status=status.HTTP_BAD_REQUEST)

    # Find the target user by email
    try:
        target_user = CustomUser.objects.get(email=target_email)
    except CustomUser.DoesNotExist:
        return Response({'error': 'Target user not found.'}, status=status.HTTP_404_NOT_FOUND)  # Use the correct status code

    # Perform the wallet-to-wallet transfer
    sender.wallet -= amount
    target_user.wallet += amount
    sender.save()
    target_user.save()

    # Generate unique transaction IDs
    sender_transaction_id = str(uuid.uuid4())[:16]
    target_transaction_id = str(uuid.uuid4())[:16]

    # Create transaction records for sender and target
    sender_transaction = Transaction(
        user=sender,
        transaction_type='debit',
        amount=amount,
        date=timezone.now().date(),
        time=timezone.now().time(),
        description=f'Sent to User',
        transaction_id=sender_transaction_id
    )
    sender_transaction.save()

    target_transaction = Transaction(
        user=target_user,
        transaction_type='credit',
        amount=amount,
        date=timezone.now().date(),
        time=timezone.now().time(),
        description=f'Received from User',
        transaction_id=target_transaction_id
    )
    target_transaction.save()

    # Send confirmation emails to both users
    subject_sender = f'You Sent ₦{amount} to {target_user.first_name}'
    message_sender = f'Hi {sender.first_name}, \n\nYou have successfully transferred ₦{amount} to {target_user.first_name} ({target_user.email}). \n\nThank you for using MyFund!\n\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria.'
    from_email_sender = "MyFund <info@myfundmobile.com>"  # Replace with a valid sender email
    recipient_list_sender = [sender.email]

    subject_target = f'You Received ₦{amount} from {sender.first_name}'
    message_target = f'Hi {target_user.first_name}, \n\nYou have received ₦{amount} from {sender.first_name} ({sender.email}). \n\nThank you for using MyFund!\n\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria.'
    from_email_target = "MyFund <info@myfundmobile.com>"  # Replace with a valid target email
    recipient_list_target = [target_user.email]

    send_mail(subject_sender, message_sender, from_email_sender, recipient_list_sender, fail_silently=False)
    send_mail(subject_target, message_target, from_email_target, recipient_list_target, fail_silently=False)

    return Response({'success': True})


from rest_framework import generics, status
from rest_framework.response import Response
from .models import Property, Transaction
from .serializers import BuyPropertySerializer
from datetime import datetime, timedelta
from django.utils import timezone
import uuid


def schedule_rent_reward(user_id, rent_reward, transaction_id, property_name):
    # Calculate the next payment date (365 days from now)
    next_payment_date = timezone.now() + timedelta(days=1)

    # Create a transaction for the rent reward with the unique transaction_id
    transaction = Transaction(
        user_id=user_id,
        transaction_type='credit',
        amount=rent_reward,
        description="Annual rental income reward",
        date=timezone.now().date(),
        time=timezone.now().time(),
        transaction_id=transaction_id  # Include the unique transaction_id
    )
    transaction.save()

    # Update the user's wallet with the rent reward
    user = transaction.user
    user.wallet += Decimal(rent_reward)  # Convert rent_reward to Decimal
    user.save()

    # Send an email to the user for the rental income
    subject = "You've Earned a Rental Income!"
    message = f"Hi {user.first_name},\n\nYou've received an annual rental income of ₦{rent_reward} from your {property_name} property. Keep growing your portfolio to enjoy more returns on your investment.🥂 \n\nThank you for using MyFund!\n\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
    from_email = "MyFund <info@myfundmobile.com>"
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list, fail_silently=False)



class BuyPropertyView(generics.CreateAPIView):
    queryset = Property.objects.all()
    serializer_class = BuyPropertySerializer
    permission_classes = [IsAuthenticated]  # Make sure the user is authenticated

    def create(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        property = serializer.validated_data['property']
        num_units = serializer.validated_data['num_units']
        payment_source = serializer.validated_data.get('payment_source')
        card_id = request.data.get('card_id')

        if property.units_available < num_units:
            return Response({"detail": "Not enough units available for purchase."}, status=status.HTTP_400_BAD_REQUEST)

        total_price = float(property.price) * num_units

        if payment_source == 'savings' and float(user.savings) < total_price:
            return Response({"detail": "Insufficient funds in savings account."}, status=status.HTTP_400_BAD_REQUEST)
        elif payment_source == 'investment' and float(user.investment) < total_price:
            return Response({"detail": "Insufficient funds in investment account."}, status=status.HTTP_400_BAD_REQUEST)
        elif payment_source == 'wallet' and float(user.wallet) < total_price:
            return Response({"detail": "Insufficient funds in wallet."}, status=status.HTTP_400_BAD_REQUEST)

        if payment_source in ['savings', 'investment', 'wallet']:
            if payment_source == 'savings':
                user.savings = float(user.savings) - total_price
            elif payment_source == 'investment':
                user.investment = float(user.investment) - total_price
            else:  # 'wallet'
                user.wallet = float(user.wallet) - total_price
            user.save()

            property.units_available -= num_units
            property.owner = user
            property.save()

            user.properties += num_units
            user.save()

            rent_reward = float(total_price) * 0.075
            transaction_id = uuid.uuid4()

            # Generate a unique ID with 15 characters
            def generate_short_id():
                unique_id = str(uuid.uuid4().int)
                return unique_id[:10]


            transaction = Transaction(
                user=user,
                transaction_type='credit',
                amount=total_price,
                description=f"{property.name}",
                property_name=property.name,
                property_value=property.price,
                rent_earned_annually=rent_reward,
                date=timezone.now().date(),
                time=timezone.now().time(),
                transaction_id = generate_short_id()
            )
            transaction.save()

            subject = f"Congratulations {user.first_name} on Your Property Purchase!"
            num_units_text = "unit" if num_units == 1 else "units"
            message = f"Hi {user.first_name},\n\nYou've successfully purchased {num_units} {num_units_text} of {property.name} property valued at {property.price}.\n\nYou will earn an annual rental income of ₦{rent_reward} on this property.\n\nCongratulations on being a landlord!\n\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
            from_email = "MyFund <info@myfundmobile.com>"
            recipient_list = [user.email]

            send_mail(subject, message, from_email, recipient_list, fail_silently=False)

            schedule_rent_reward(user.id, rent_reward, uuid.uuid4(), property.name)


            total_price = float(property.price) * num_units


        if payment_source == 'saved_cards':
            try:
                # Retrieve the card information
                card = Card.objects.get(id=card_id)
            except Card.DoesNotExist:
                return Response({"detail": "Selected card not found."}, status=status.HTTP_404_NOT_FOUND)

            card_number = card.card_number
            cvv = card.cvv
            expiry_month = card.expiry_date.split('/')[0]
            expiry_year = card.expiry_date.split('/')[1]

            # Define your payment gateway credentials and headers
            paystack_secret_key = "sk_test_dacd07b029231eed22f407b3da805ecafdf2668f"
            headers = {
                'Authorization': f'Bearer {paystack_secret_key}',
                'Content-Type': 'application/json',
            }
            payload = {
                "email": user.email,
                "amount": total_price * 100,  # Amount in kobo
                "card": {
                    "number": card_number,
                    "cvv": cvv,
                    "expiry_month": expiry_month,
                    "expiry_year": expiry_year,
                },
            }

            try:
                # Make a payment request to the payment gateway
                response = requests.post('https://api.paystack.co/charge', json=payload, headers=headers)
                response_data = response.json()
                print("Payment gateway response:", response_data)  # Log the response for debugging

                if response.status_code == 200 and response_data.get('status') is True:
                    # Payment successful, update property ownership and user's properties
                    property.units_available -= num_units
                    property.owner = user
                    property.save()

                    user.properties += num_units
                    user.save()

                    rent_reward = total_price * 0.075

                    transaction_id = str(uuid.uuid4())
                    # Generate a unique ID with 15 characters
                    def generate_short_id():
                        unique_id = str(uuid.uuid4().int)
                        return unique_id[:15]


                    transaction = Transaction(
                        user=user,
                        transaction_type='credit',
                        amount=total_price,
                        description=f"{property.name}",
                        property_name=property.name,
                        property_value=property.price,
                        rent_earned_annually=rent_reward,
                        date=timezone.now().date(),
                        time=timezone.now().time(),
                        transaction_id = generate_short_id()
                    )
                    transaction.save()

                    subject = f"Congratulations {user.first_name} on Your Property Purchase!"
                    num_units_text = "unit" if num_units == 1 else "units"
                    message = f"Hi {user.first_name},\n\nYou've successfully purchased {num_units} {num_units_text} of {property.name} property valued at {property.price}.\n\nYou will earn an annual rental income of ₦{rent_reward} on this property.\n\nCongratulations on being a landlord!\n\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
                    from_email = "MyFund <info@myfundmobile.com>"
                    recipient_list = [user.email]

                    send_mail(subject, message, from_email, recipient_list, fail_silently=False)

                    return Response({"detail": "Property purchased successfully."}, status=status.HTTP_200_OK)
                else:
                    return Response({"detail": "Payment failed. Please check your card details."}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print("Payment processing error:", str(e))
                return Response({"detail": "Payment processing error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        elif payment_source == 'bank_transfer':
            # Implement bank transfer payment confirmation logic here
            pass  # Add your implementation here

        return Response({"detail": "Property purchased successfully."}, status=status.HTTP_200_OK)
    


from .serializers import CustomUserSerializer
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_top_savers(request):
    users = CustomUser.objects.filter(total_savings_and_investments_this_month__gt=0)
    top_savers = []

    for user in users:
        user.update_total_savings_and_investment_this_month()
        serializer = CustomUserSerializer(user)
        top_savers.append(serializer.data)

    top_savers.sort(key=lambda user: user['individual_percentage'], reverse=True)

    current_user = request.user
    current_user_serializer = CustomUserSerializer(current_user)
    current_user_data = current_user_serializer.data

    response_data = {
        "top_savers": top_savers,
        "current_user": current_user_data
    }

    return Response(response_data)






from .serializers import KYCUpdateSerializer
class KYCUpdateView(generics.UpdateAPIView):
    serializer_class = KYCUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Use the authenticated user as the object to update
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if user.kyc_status != 'Updated!':
            user.kyc_status = "Pending..."  # Only update to "Pending..." if not already "Updated!"
            user.save()

        # Notify admin that a KYC update is pending approval
        admin_email = ["info@myfundmobile.com", "company@myfundmobile.com"]
        subject = f"KYC Update for {user.first_name} Pending Approval"
        message = f"Hello Admin, \n\n{user.first_name} ({user.email}) has submitted a KYC update for approval. Please review it in the admin panel.\n\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
        from_email = "MyFund <info@myfundmobile.com>"

        send_mail(subject, message, from_email, admin_email, fail_silently=False)

        return Response(serializer.data)

kyc_update_view = KYCUpdateView.as_view()


class GetKYCStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        kyc_status = user.kyc_status
        message = ""

        if kyc_status is None:
            message = "You haven't started your KYC process."
        elif kyc_status == 'Pending...':
            message = "KYC status is pending approval."
        elif kyc_status == 'Updated!':
            message = "KYC status has been updated."
        elif kyc_status == 'Failed':
            message = "KYC update has been rejected."

        return Response({'kycStatus': kyc_status, 'message': message}, status=status.HTTP_200_OK)





class KYCApprovalViewSet(viewsets.ViewSet):
    def approve_kyc(self, request, pk=None):
        user = CustomUser.objects.get(pk=pk)
        user.kyc_updated = True  # Mark KYC as updated
        user.save()
        # Send an email notification here
        return Response({'message': 'KYC Approved'})

    def reject_kyc(self, request, pk=None):
        user = CustomUser.objects.get(pk=pk)
        user.kyc_updated = False  # Mark KYC as not updated
        user.save()
        # Send an email notification here
        return Response({'message': 'KYC Rejected'})



from .serializers import AlertMessageSerializer  # Create a serializer for AlertMessage if needed
from .models import AlertMessage

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_alert_message(request):
    user = request.user
    text = request.data.get('text')
    date = request.data.get('date')  # You can set this in your frontend or use server time

    alert_message = AlertMessage(user=user, text=text, date=date)
    alert_message.save()

    return Response(status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_alert_messages(request):
    user = request.user
    alert_messages = AlertMessage.objects.filter(user=user)
    serializer = AlertMessageSerializer(alert_messages, many=True)  # Use your serializer to format the data

    return Response(serializer.data, status=status.HTTP_200_OK)



from .models import BankTransferRequest, InvestTransferRequest

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_bank_transfer(request):
    try:
        user = request.user
        print(f"User: {user}")  # Add this line for debugging
        amount = request.data.get('amount')

        # Create a BankTransferRequest record
        request = BankTransferRequest(user=user, amount=amount)
        request.save()

        # Send an email to admin
        subject = f"[CHECK] {user.first_name} Made A QuickSave Request"
        message = f"Hi Admin, \n\nA bank transfer request of ₦{amount} has just been initiated by {user.first_name} ({user.email}).\n\nPlease log in to the admin panel for review.\n\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
        from_email = "MyFund <info@myfundmobile.com>"
        recipient_list = ["company@myfundmobile.com", "info@myfundmobile.com"]  # Replace with the admin's email address

        send_mail(subject, message, from_email, recipient_list, fail_silently=False)

        # Send a pending quicksave email to the user
        user_subject = "QuickSave Pending..."
        user_message = f"Hi {user.first_name},\n\nYour bank transfer request of ₦{amount} is pending approval. We will notify you once it's processed. \n\nThank you for using MyFund. \n\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
        user_email = user.email

        send_mail(user_subject, user_message, from_email, [user_email], fail_silently=False)

        # Create a pending transaction for the user with date and time
        current_datetime = timezone.now()  # Get the current date and time
        referral_email = user.referral.email if user.referral else None  # Check if referral is set

        transaction = Transaction.objects.create(
            user=user,
            referral_email=referral_email,  # Include the referrer's email if it exists
            transaction_type='pending',
            amount=amount,
            date=current_datetime.date(),  # Set the date to the current date
            time=current_datetime.time(),  # Set the time to the current time
            description="QuickSave (Pending)",  # Adjust the description as needed
            transaction_id=str(uuid.uuid4())[:10]
        )
        transaction.save()

        return Response({"message": "Bank transfer request created and pending admin approval"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_invest_transfer(request):
    try:
        user = request.user
        amount = request.data.get('amount')

        # Create an InvestTransferRequest record
        request = InvestTransferRequest(user=user, amount=amount)
        request.save()

        # Send an email to admin
        subject = f"[CHECK] {user.first_name} Made A QuickInvest Request"
        message = f"Hi Admin, \n\nAn investment transfer request of ₦{amount} has just been initiated by {user.first_name} ({user.email}).\n\nPlease log in to the admin panel for review.\n\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
        from_email = "MyFund <info@myfundmobile.com>"
        recipient_list = ["company@myfundmobile.com", "info@myfundmobile.com"]  # Replace with the admin's email address

        send_mail(subject, message, from_email, recipient_list, fail_silently=False)

        # Send a pending invest email to the user
        user_subject = "QuickInvest Pending..."
        user_message = f"Hi {user.first_name},\n\nYour investment transfer request of ₦{amount} is pending approval. We will notify you once it's processed. \n\nThank you for using MyFund. \n\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
        user_email = user.email

        send_mail(user_subject, user_message, from_email, [user_email], fail_silently=False)

        # Create a pending transaction for the user with date and time
        current_datetime = timezone.now()
        referral_email = user.referral.email if user.referral else None

        transaction = Transaction.objects.create(
            user=user,
            referral_email=referral_email,
            transaction_type='pending',
            amount=amount,
            date=current_datetime.date(),
            time=current_datetime.time(),
            description="QuickInvest (Pending)",
            transaction_id=str(uuid.uuid4())[:10]
        )
        transaction.save()

        return Response({"message": "Investment transfer request created and pending admin approval"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

