from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CustomUser, Message



class SignupSerializer(serializers.ModelSerializer):
    referral = serializers.CharField(max_length=40, required=False)  # Allow referral code to be optional

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'password', 'referral']

    def create(self, validated_data):
        # Extract the referral code and remove it from the data dictionary
        referral_code = validated_data.pop('referral', None)

        # Create a new user
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()

        # Check if a referrer exists with the given referral code
        if referral_code:
            try:
                referrer = CustomUser.objects.get(email=referral_code)
                user.referral = referrer
                user.save()
            except CustomUser.DoesNotExist:
                pass  # Handle invalid referral codes here
    
        return user

class ConfirmOTPSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6)  # Assuming OTP is a 6-digit string



class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_confirmed = serializers.BooleanField(read_only=True)
    profile_picture = serializers.SerializerMethodField()


    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'password', 'phone_number', 'referral', 'profile_picture', 'how_did_you_hear']

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            return obj.profile_picture.url
        else:
            return None
        
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone_number=validated_data['phone_number'],
            referral=validated_data['referral']
        )
        return user
    

    
    
from authentication.models import CustomUser
class KYCUpdateSerializer(serializers.ModelSerializer):
    id_upload = serializers.ImageField(max_length=None, use_url=True)  # This handles image uploads

    class Meta:
        model = CustomUser
        fields = '__all__'

class KYCStatusUpdateSerializer(serializers.Serializer):
    kyc_status = serializers.CharField(max_length=10)





from django.contrib.auth import authenticate

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        # Retrieve user using case-insensitive email match
        user = authenticate(request=self.context.get('request'), email__iexact=email, password=password)

        if user:
            if not user.is_active:
                raise serializers.ValidationError("User account is not active.")
            return user
        else:
            raise serializers.ValidationError("Invalid email or password.")


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField()




class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'phone_number']

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance



class ProfilePictureUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['profile_picture']



class SavingsGoalUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['preferred_asset', 'savings_goal_amount', 'time_period']



class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


class OutgoingMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'  # Or list the specific fields you want to include

class IncomingMessageSerializer(serializers.Serializer):
    content = serializers.CharField()
    # Add other fields as needed



from .models import BankAccount, Card
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = '__all__'  # Or list the specific fields you want to include


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ('id', 'bank_name', 'card_number', 'expiry_date', 'cvv', 'is_default')
        read_only_fields = ('id', 'is_default')  # Make id and is_default read-only

class CardListCreateView(generics.ListCreateAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)





class AccountBalancesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['savings', 'investment', 'properties', 'wallet']



from django.utils import timezone
import requests, uuid
from django.core.mail import send_mail

unique_reference = str(uuid.uuid4())


class CardSerializer(serializers.ModelSerializer):
    expiry_date = serializers.CharField(max_length=5)  # Update the field to a CharField for MM/YY input

    class Meta:
        model = Card
        fields = ('id', 'bank_name', 'card_number', 'expiry_date', 'cvv', 'pin', 'is_default')
        read_only_fields = ('id', 'is_default')

    def create(self, validated_data):
        user = self.context['request'].user
        pin = validated_data.pop('pin')
        expiry_date = validated_data.pop('expiry_date')  # Get the expiry_date as a string

        # Parse the expiry_date in MM/YY format
        expiry_month, expiry_year = expiry_date.split('/')
        expiry_date = f"{expiry_month}/{expiry_year}"  # Convert to a valid date format

        # Verify the card with Paystack
        paystack_secret_key = "sk_test_dacd07b029231eed22f407b3da805ecafdf2668f"
        card_number = validated_data['card_number']
        cvv = validated_data['cvv']
        validated_data['expiry_date'] = expiry_date  # Add this line

        paystack_url = "https://api.paystack.co/charge"
        payload = {
            "card": {
                "number": card_number,
                "cvv": cvv,
                "expiry_month": expiry_month,
                "expiry_year": expiry_year,
            },
            "email": user.email,
            "amount": 50 * 100,  # Amount in kobo (N50)
            "pin": pin,
            "reference": unique_reference,  # You need to generate a unique reference
        }
        headers = {
            "Authorization": f"Bearer {paystack_secret_key}",
            "Content-Type": "application/json",
        }

        response = requests.post(paystack_url, json=payload, headers=headers)
        paystack_response = response.json()
        print("Paystack Response:", paystack_response)

        if paystack_response.get("status"):
            # Paystack payment successful
            # Update user's savings
            user.savings += 50
            user.save()

            validated_data['user'] = user
            card = Card.objects.create(**validated_data)

            # Send a confirmation email
            subject = "New Card Added Successfully"
            message = f"Well done {user.first_name},\n\nYour {card.bank_name} card has been successfully added to your account. \n\nKeep growing your funds.🥂\n\nMyFund"
            from_email = "MyFund <info@myfundmobile.com>"
            recipient_list = [user.email]

            send_mail(subject, message, from_email, recipient_list, fail_silently=False)


            # Create a Transaction object
            now = timezone.now()
            transaction_id = unique_reference  # Use the same reference as for the payment
            transaction_data = {
                "user": user,
                "transaction_type": "credit",  # You can set it to "credit" for successful payments
                "amount": 50,  # The amount of the successful payment
                "date": now.date(),  # Use DateField for date
                "time": now.time(),  # Use TimeField for time
                "transaction_id": transaction_id,
                "description": "Card Successful",  # You can set any description you want
            }
            transaction = Transaction.objects.create(**transaction_data)

            # Notify the WebSocket consumer about the successful transaction

            return {
                "id": card.id,
                "bank_name": card.bank_name,
                "card_number": card.card_number,
                "expiry_date": expiry_date,  # Return the parsed expiry_date
                "cvv": card.cvv,
                "pin": card.pin,
                "is_default": card.is_default,
                "reference": paystack_response.get("data", {}).get("reference"),
                "transaction": TransactionSerializer(transaction).data,
            }

        else:
            print("Paystack API Error Response:", paystack_response)  # Add this line for debugging
            raise serializers.ValidationError("Failed to verify card and process the payment.")




from .models import Transaction
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('transaction_type', 'amount', 'date', 'time', 'transaction_id', 'description')

class QuickSaveSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    card_id = serializers.IntegerField()


from .models import AutoSave
class AutoSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = AutoSave
        fields = '__all__'


class QuickInvestSerializer(serializers.Serializer):
    card_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__' 



from .models import Property
class BuyPropertySerializer(serializers.Serializer):
    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())
    num_units = serializers.IntegerField()
    payment_source = serializers.ChoiceField(choices=['savings', 'investment', 'wallet', 'saved_cards', 'bank_transfer'])


from django.db.models import Sum
class CustomUserSerializer(serializers.ModelSerializer):
    individual_percentage = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'profile_picture', 'individual_percentage']

    def get_individual_percentage(self, obj):
        total_savings_this_month = obj.total_savings_and_investments_this_month

        if total_savings_this_month > 0:
            top_saver = CustomUser.objects.filter(
                total_savings_and_investments_this_month__gt=0
            ).order_by('-total_savings_and_investments_this_month').first()

            if top_saver and top_saver.total_savings_and_investments_this_month > 0:
                user_percentage = (total_savings_this_month / top_saver.total_savings_and_investments_this_month) * 100
                return round(user_percentage, 1)

        return None
    



from .models import AlertMessage
class AlertMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertMessage
        fields = '__all__'