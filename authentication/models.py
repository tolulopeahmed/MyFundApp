from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import random
import string
from django.conf import settings
from django.core.mail import send_mail
from django.urls import reverse
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Sum



class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)        
        user.save(using=self._db)


        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

import uuid
from datetime import date
from django.db.models import Subquery, DecimalField, OuterRef


class CustomUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    referral = models.CharField(max_length=40, blank=True, null=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    reset_token = models.CharField(max_length=64, null=True, blank=True)
    reset_token_expires = models.DateTimeField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    is_confirmed = models.BooleanField(default=False)

    referral = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    pending_referral_reward = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    myfund_pin = models.CharField(max_length=4, null=True, blank=True)

    preferred_asset = models.CharField(max_length=50, blank=True, null=True)
    savings_goal_amount = models.DecimalField(max_digits=11, decimal_places=2, blank=True, null=True)
    time_period = models.PositiveIntegerField(blank=True, null=True)

    bank_accounts = models.ManyToManyField('BankAccount', related_name='owners', blank=True)
    cards = models.ManyToManyField('Card', related_name='owners', blank=True)

    savings = models.DecimalField(max_digits=11, decimal_places=2, default=0)
    investment = models.DecimalField(max_digits=11, decimal_places=2, default=0)
    properties = models.PositiveIntegerField(default=0)
    wallet = models.DecimalField(max_digits=11, decimal_places=2, default=0)
    savings_and_investments = models.DecimalField(max_digits=11, decimal_places=2, default=0)
    total_savings_and_investments_this_month = models.DecimalField(max_digits=11, decimal_places=2, default=0)

    top_saver_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)


    autosave_enabled = models.BooleanField(default=False)  # Add this field
    autoinvest_enabled = models.BooleanField(default=False)  # Add this field


    is_first_time_signup = models.BooleanField(default=True)


    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number']



    # KYC-related fields
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Non-binary', 'Non-binary')], default='Choose')
    relationship_status = models.CharField(max_length=20, choices=[('Single', 'Single'), ('Married', 'Married'), ('Divorced', 'Divorced'), ('Separated', 'Separated'), ('Remarried', 'Remarried'), ('Widowed', 'Widowed'), ('Others', 'Others') ], default='Choose')
    employment_status = models.CharField(max_length=20, choices=[('Unemployed', 'Unemployed'), ('Employed', 'Employed'), ('Self-employed', 'Self-employed'), ('Business', 'Business'), ('Retired', 'Retired'), ('Student', 'Student'), ('Others', 'Others')], default='Choose')
    yearly_income = models.CharField(max_length=30, choices=[('Less than N200000', 'Less than N200000'), ('N200001 - N500000', 'N200001 - N500000'), ('N500001 - N1 million', 'N500001 - N1 million'), ('N1 million - N5 million', 'N1 million - N5 million'), ('N5 million - N10 million', 'N5 million - N10 million'), ('N10 million - N20 million', 'N10 million - N20 million'), ('Above N20 million', 'Above N20 million')], default='Choose')
    date_of_birth = models.DateField(default=date(1900, 1, 1))
    address = models.TextField(default="Enter Address")
    mothers_maiden_name = models.CharField(max_length=100, default="Enter Name")
    identification_type = models.CharField(max_length=50, choices=[('International Passport', 'International Passport'), ('Driver\'s License', 'Driver\'s License'), ('National ID Card (NIN)', 'National ID Card (NIN)'), ('Permanent Voter\'s Card', 'Permanent Voter\'s Card'), ('Bank Verification Number (BVN)', 'Bank Verification Number (BVN)'), ('Others', 'Others')], default='Choose')
    id_upload = models.ImageField(upload_to='kyc_documents/', default='kyc_documents/placeholder.png')
    next_of_kin_name = models.CharField(max_length=100, default="Enter Name")
    relationship_with_next_of_kin = models.CharField(max_length=20, choices=[('Brother', 'Brother'), ('Sister', 'Sister'), ('Spouse', 'Spouse'), ('Father', 'Father'), ('Mother', 'Mother'), ('Daughter', 'Daughter'), ('Son', 'Son'), ('Friend', 'Friend'), ('Relative', 'Relative'), ('Others', 'Others')], default='Choose')
    next_of_kin_phone_number = models.CharField(max_length=15, default="Enter Number")

    # KYC status
    kyc_updated = models.BooleanField(default=False)
    kyc_status = models.CharField(max_length=10, default="Not yet started")
    admin_approval_status = models.CharField(max_length=10, default="Not yet started")

    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        # Update the savings_and_investments field
        self.savings_and_investments = self.savings + self.investment
        super().save(*args, **kwargs)

    def generate_reset_token(self):
        token = ''.join(random.choices(string.ascii_letters + string.digits, k=64))
        self.reset_token = token
        self.reset_token_expires = timezone.now() + timezone.timedelta(hours=1)
        self.save()
        
    def send_password_reset_email(self):
        subject = "Password Reset for MyFund"
        reset_url = "https://tolulopeahmed.github.io/password-reset-confirmation/?token=" + self.reset_token
        context = {
            'first_name': self.first_name,
            'reset_url': reset_url,
        }
        
        text_message = strip_tags(render_to_string('password_reset_email.txt', context))
        html_message = render_to_string('password_reset_email.html', context)
        
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [self.email]
        
        msg = EmailMultiAlternatives(subject, text_message, from_email, recipient_list)
        msg.attach_alternative(html_message, "text/html")
        msg.send()

    def confirm_referral_rewards(self, is_referrer):
        if self.savings >= 20000 or self.investment > 0:
            if self.referral is not None:  # Check if there is a referral
                # Check if there is a pending referral reward
                if self.pending_referral_reward > 0:
                    # Create a confirmed credit transaction for the referrer
                    referrer_transaction_id = str(uuid.uuid4())[:10]  # Generate a unique UUID for the referrer
                    credit_transaction_referrer = Transaction.objects.create(
                        user=self,
                        referral_email=self.referral.email if self.referral else '',  # Save the referral email if it exists
                        transaction_type='credit',
                        amount=1000,
                        description="Referral Reward (Confirmed)",
                        transaction_id=referrer_transaction_id,
                    )
                    credit_transaction_referrer.save()

                    # Create a confirmed credit transaction for the referred user
                    referred_transaction_id = str(uuid.uuid4())[:10]  # Generate a unique UUID for the referred user
                    credit_transaction_referred = Transaction.objects.create(
                        user=self.referral,
                        referral_email=self.email,  # Save the referrer's email
                        transaction_type='credit',
                        amount=1000,
                        description="Referral Reward (Confirmed)",
                        transaction_id=referred_transaction_id,
                    )
                    credit_transaction_referred.save()

                    # Deduct the credited amount from the pending referral rewards
                    self.pending_referral_reward -= 1000
                    self.referral.pending_referral_reward -= 1000

                    # Update the wallets of both users
                    self.wallet += 1000
                    self.referral.wallet += 1000

                    # Save the changes to the database for both users
                    self.save()
                    self.referral.save()

                    # Debugging: Print the updated wallet balances
                    print(f"Referrer's wallet balance after credit: {self.wallet}")
                    print(f"Referred user's wallet balance after credit: {self.referral.wallet}")

                    # Send confirmation emails to both the referrer and referred user
                    self.send_referral_confirmation_email(referrer_transaction_id, self, True)
                    self.referral.send_referral_confirmation_email(referred_transaction_id, self, False)


    def send_referral_confirmation_email(self, transaction_id, recipient_user, is_referrer):

        if is_referrer:
            subject = "Referral Reward Confirmation"
            message = f"Congratulations {recipient_user.first_name},\n\nYou have received a referral reward of ₦1,000.00 in your wallet for referring {self.referral.first_name}.\n\nThank you for using MyFund and referring others!\n\nKeep growing your funds.🥂\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
        else:
            subject = "Referral Reward Confirmation"
            message = f"Congratulations {recipient_user.first_name},\n\nYou have received a referral reward of ₦1,000.00 in your wallet as a new user thanks to {self.first_name}.\n\nThank you for using MyFund!\n\nKeep growing your funds.🥂\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."

        from_email = "MyFund <info@myfundmobile.com>"
        recipient_list = [recipient_user.email]

        send_mail(subject, message, from_email, recipient_list, fail_silently=False)


    def calculate_user_percentage_to_top_saver(self):
        top_saver = CustomUser.objects.filter(
            total_savings_and_investments_this_month__gt=0  # Only consider users with savings this month
        ).order_by('-total_savings_and_investments_this_month').first()

        if top_saver and top_saver.total_savings_and_investments_this_month > 0:
            user_percentage = (self.total_savings_and_investments_this_month / top_saver.total_savings_and_investments_this_month) * 100
        else:
            user_percentage = 0
        return user_percentage

    def update_total_savings_and_investment_this_month(self):
        now = timezone.now()
        current_month = now.month
        current_year = now.year

        # Filter credit transactions for savings and investments in the current month
        savings_and_investment_credits = Transaction.objects.filter(
            user=self,
            transaction_type='credit',
            date__month=current_month,
            date__year=current_year,
            description__in=['QuickSave', 'AutoSave', 'QuickInvest', 'AutoInvest']
        )

        # Sum the credit amounts
        total_credits = savings_and_investment_credits.aggregate(total_credits=Sum('amount'))['total_credits']

        if total_credits is not None:
            self.total_savings_and_investments_this_month = total_credits
            self.save()
        else:
            self.total_savings_and_investments_this_month = 0
            self.save()

class MonthlySavings(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='monthly_savings')
    month = models.PositiveIntegerField()
    year = models.PositiveIntegerField()
    savings = models.DecimalField(max_digits=11, decimal_places=2, default=0)
    investment = models.DecimalField(max_digits=11, decimal_places=2, default=0)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ['user', 'month', 'year']




from django.db import models
from django.contrib.auth import get_user_model


class GPTMessage(models.Model):
    sender = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"From {self.sender}: {self.content}"
    

class Message(models.Model):
    sender = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    image = models.ImageField(upload_to='chat_images/', null=True, blank=True)  # Add this line for the image field
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"From {self.sender} to {self.recipient}: {self.content}"






from django.contrib.auth import get_user_model
from django.contrib.auth.models import User

class BankAccount(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='owned_bank_accounts')  # Change related_name here
    bank_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=20, unique=True)
    account_name = models.CharField(max_length=100, default="Default Account Name")
    is_default = models.BooleanField(default=False)

    bank_code = models.CharField(max_length=10, default='')  # Add a default value
    paystack_recipient_code = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user.email} - {self.bank_name} ({self.account_number})"


class Card(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='owned_cards')
    bank_name = models.CharField(max_length=100)
    card_number = models.CharField(max_length=19)
    expiry_date = models.CharField(max_length=5)
    cvv = models.CharField(max_length=4)
    pin = models.CharField(max_length=4, default='0000')  # Add the PIN field
    is_default = models.BooleanField(default=False)

    def __str__(self):
        card_last_digits = self.card_number[-4:]
        return f"{self.user.email}'s Card ending in {card_last_digits} ({self.bank_name})"


# Update the models to use settings.AUTH_USER_MODEL
class AccountBalance(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    savings = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    investment = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    properties = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    wallet = models.DecimalField(max_digits=10, decimal_places=2, default=0)


class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('credit', 'Credit'),
        ('debit', 'Debit'),
        ('pending', 'Pending'), 

    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    description = models.CharField(max_length=255, default="No description available")
    transaction_id = models.CharField(max_length=255, default='', unique=True)
    service_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)  # Define a default value
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0) 
    referral_email = models.EmailField(max_length=255, blank=True, null=True)

    # New fields
    property_name = models.CharField(max_length=255, default='', blank=True)
    property_value = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=True)
    rent_earned_annually = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=True)
    rent_earned_monthly = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=True)

    def __str__(self):
        return f'{self.transaction_type} - {self.amount} - {self.date}'


class AutoSave(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    card = models.ForeignKey(Card, on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    frequency = models.CharField(
        max_length=10, choices=[('hourly', 'Hourly'), ('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly')]
    )
    active = models.BooleanField(default=True)

    def __str__(self):
        user_name = f"{self.user.first_name} ({self.user.email})"
        amount_saved = f"₦{self.amount}" if self.amount is not None else "Amount not available"
        return f"AutoSave for {user_name} - {amount_saved} ({self.frequency})"
    

class AutoInvest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    card = models.ForeignKey(Card, on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    frequency = models.CharField(
        max_length=10, choices=[('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly')]
    )
    active = models.BooleanField(default=True)

    def __str__(self):
        user_name = f"{self.user.first_name} ({self.user.email})"
        amount_invested = f"₦{self.amount}" if self.amount is not None else "Amount not available"
        return f"AutoInvest for {user_name} - {amount_invested} ({self.frequency})"



class Property(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=11, decimal_places=2)
    rent_reward = models.DecimalField(max_digits=11, decimal_places=2)
    units_available = models.PositiveIntegerField()
    owner = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, related_name='owned_properties')
    
    def __str__(self):
        return self.name
    



