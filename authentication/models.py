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


    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number']

    def __str__(self):
        return self.email
    

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


