from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CustomUser, Message



class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'password', 'referral']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

class ConfirmOTPSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6)  # Assuming OTP is a 6-digit string



class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_confirmed = serializers.BooleanField(read_only=True)


    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'password', 'phone_number', 'referral', 'profile_picture']

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
        fields = '__all__'


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
        expiry_date = f"01/{expiry_month}/{expiry_year}"  # Convert to a valid date format

        # Verify the card with Paystack
        paystack_secret_key = "sk_test_dacd07b029231eed22f407b3da805ecafdf2668f"
        card_number = validated_data['card_number']
        cvv = validated_data['cvv']

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
            notify_transaction_update(transaction)

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
            raise serializers.ValidationError("Failed to verify card and process payment")


def notify_transaction_update(transaction):
    from channels.layers import get_channel_layer
    from asgiref.sync import async_to_sync

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.send)(
        'transaction_update_channel',  # Channel name
        {
            'type': 'send_transaction_update',
            'transaction_data': {
                'transaction_type': 'credit',
                'amount': 50,  # Amount of the successful payment
                'date': transaction.date,
                'time': transaction.time,
                'transaction_id': transaction.transaction_id,
                'description': 'Card Successful',
            },
        },
    )




from .models import Transaction
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('transaction_type', 'amount', 'date', 'time', 'transaction_id', 'description')

