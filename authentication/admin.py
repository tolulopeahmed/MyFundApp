from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Message, Property, BankAccount, BankTransferRequest, Card, AutoInvest, Transaction, AutoSave
from django.core.mail import send_mail
from django.urls import reverse
from rest_framework.response import Response
from django.http import HttpResponseRedirect
from django.contrib import admin
from django.db.models import Sum, F, Case, When, IntegerField, Q
from django.db import models
from django.db.models.functions import Coalesce
from django.utils import timezone

from .models import CustomUser, CustomUserMetrics

class CustomUserAdmin(UserAdmin):
    list_display = (
        'id', 'email', 'first_name', 'last_name', 'phone_number', 'profile_picture', 'kyc_updated',
        'is_staff', 'is_active', 'preferred_asset', 'savings_goal_amount', 'time_period',
        'savings', 'investment', 'properties', 'wallet', 'total_savings_and_investments', 'total_savings_and_investments_this_month', 'user_percentage_to_top_saver'
    )
    list_filter = ('is_staff', 'is_active', 'kyc_updated')
    actions = ['view_kyc_details', 'approve_kyc', 'reject_kyc']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone_number', 'profile_picture')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Account Balances', {'fields': ('savings', 'investment', 'properties', 'wallet')}),  # Add account balances fields
        ('Referral', {'fields': ('pending_referral_reward',)}),
        # Add a fieldset for KYC fields
        ('KYC Information', {
            'fields': (
                'gender', 'relationship_status', 'employment_status', 'yearly_income',
                'date_of_birth', 'address', 'mothers_maiden_name', 'identification_type',
                'id_upload', 'next_of_kin_name', 'relationship_with_next_of_kin', 'next_of_kin_phone_number'
            ),
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

    def view_kyc_details(self, request, queryset):
        if queryset.count() == 1:
            user = queryset.first()
            url = reverse('admin:authentication_customuser_change', args=[user.id])
            return HttpResponseRedirect(url)
        else:
            self.message_user(request, "Please select only one user to view KYC details.")

    view_kyc_details.short_description = "View KYC Details"




    def approve_kyc(self, request, queryset):
        updated_users = []
        rejected_users = []

        for user in queryset:
            if not user.kyc_updated:
                user.kyc_updated = True
                user.kyc_status = 'Updated!'
                user.admin_approval_status = 'Approved!'
                user.save()
                updated_users.append(user)
                
                # Send an approval email to the user
                subject = "KYC Update Approved!"
                message = f"Hi {user.first_name}, \n\nThank you for updating your KYC information. Your KYC update has been approved.\n\nKeep growing your funds!🥂\n\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
                from_email = "MyFund <info@myfundmobile.com>"
                recipient_list = [user.email]

                send_mail(subject, message, from_email, recipient_list, fail_silently=False)

            else:
                rejected_users.append(user)

        if updated_users:
            if len(updated_users) == 1:
                message_bit = f"1 user ({updated_users[0]}) was"
            else:
                message_bit = f"{len(updated_users)} users were"
            self.message_user(request, f'{message_bit} approved for KYC update.')

        if rejected_users:
            if len(rejected_users) == 1:
                message_bit = f"1 user ({rejected_users[0]}) was"
            else:
                message_bit = f"{len(rejected_users)} users were"
            self.message_user(request, f'{message_bit} already approved for KYC update.')

    approve_kyc.short_description = "Approve KYC Details"




    def reject_kyc(self, request, queryset):
        for user in queryset:
            if user.kyc_updated:
                user.kyc_updated = False
                user.kyc_status = 'failed'
                user.admin_approval_status = 'rejected'  # Update admin approval status

                user.save()

                # Send a rejection email to the user
                subject = "KYC Update Failed!"
                message = f"Hi {user.first_name}, \n\nThank you for updating your KYC information. Unfortunately, we couldn't verify your information. Kindly check and try again.\n\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
                from_email = "MyFund <info@myfundmobile.com>"
                recipient_list = [user.email]

                send_mail(subject, message, from_email, recipient_list, fail_silently=False)

        self.message_user(request, f'Rejected KYC for {queryset.count()} user(s).')


    reject_kyc.short_description = 'Reject KYC Details'





    def total_savings_and_investments(self, obj):
        return obj.savings + obj.investment

    total_savings_and_investments.short_description = 'Total Savings and Investments'

    # Define a custom method to display 'Total Savings/Investment for the month'
    def savings_and_investment_for_month(self, obj):
        return obj.savings_and_investments
    savings_and_investment_for_month.short_description = 'Total Savings/Investment for the month'


    def user_percentage_to_top_saver(self, obj):
        top_saver = CustomUser.objects.all().order_by('-total_savings_and_investments_this_month').first()
        if top_saver and top_saver.total_savings_and_investments_this_month > 0:
            user_percentage = (obj.total_savings_and_investments_this_month / top_saver.total_savings_and_investments_this_month) * 100
        else:
            user_percentage = 0
        return f"{user_percentage:.2f}%"

    user_percentage_to_top_saver.short_description = 'Percentage to Top Saver'
    user_percentage_to_top_saver.admin_order_field = 'total_savings_and_investments_this_month'


admin.site.register(CustomUser, CustomUserAdmin)



from django.contrib import messages
import uuid
@admin.register(BankTransferRequest)
class BankTransferRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'is_approved', 'created_at')
    list_filter = ('is_approved',)
    actions = ['approve_bank_transfer', 'reject_bank_transfer']

    def approve_bank_transfer(self, request, queryset):
        approved_users = []

        for request in queryset:
            request.is_approved = True
            request.save()

            # Update user's savings
            user = request.user
            user.savings += int(request.amount)
            user.save()

            # Call the confirm_referral_rewards method here
            is_referrer = True  # Determine whether the user is the referrer or the referred user
            user.confirm_referral_rewards(is_referrer=True)  # Pass True if the user is a referrer, or False if not

            # Create a transaction record
            transaction = Transaction.objects.create(
                user=user,
                transaction_type="credit",
                amount=request.amount,
                date=timezone.now().date(),
                time=timezone.now().time(),
                description=f"QuickSave (Confirmed)",
                transaction_id=str(uuid.uuid4())[:10]
            )
            transaction.save()

            # Send an approval email to the user
            subject = "QuickSave Updated! ✔"
            message = f"Hi {user.first_name}, \n\nYour bank transfer request for ₦{request.amount} has been approved and credited to your SAVINGS account!\n\nThank you for using MyFund. \n\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
            from_email = "MyFund <info@myfundmobile.com>"
            recipient_list = [user.email]

            send_mail(subject, message, from_email, recipient_list, fail_silently=False)

            approved_users.append(user)
            
            # After processing a bank transfer transaction
            user.update_total_savings_and_investment_this_month()

    approve_bank_transfer.short_description = "Approve selected bank transfers"

    def reject_bank_transfer(self, request, queryset):
        for request in queryset:
            # Send a rejection email to the user
            subject = "Bank Transfer Rejected"
            message = f"Hi {request.user.first_name}, \n\nYour bank transfer request for ₦{request.amount} could not be confirmed. Kindly check and try again.\n\nThank you for using MyFund. \n\n\nMyFund\nSave, Buy Properties, Earn Rent\nwww.myfundmobile.com\n13, Gbajabiamila Street, Ayobo, Lagos, Nigeria."
            from_email = "MyFund <info@myfundmobile.com>"
            recipient_list = [request.user.email]

            send_mail(subject, message, from_email, recipient_list, fail_silently=False)

            # Delete the rejected request
            request.delete()

    reject_bank_transfer.short_description = "Reject selected bank transfers"








@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'content', 'timestamp')
    list_filter = ('timestamp',)
    search_fields = ('sender__email', 'recipient__email', 'content')

    actions = ['reply_to_selected_messages']  # Add a custom action

def reply_to_messages(modeladmin, request, queryset):
    for message in queryset:
        # Implement your reply logic here, e.g., sending a notification to the user
        # or performing any other actions needed to send a reply.
        pass
reply_to_messages.short_description = "Reply to selected messages"
admin.site.add_action(reply_to_messages)

class BankAccountAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'bank_name', 'account_number', 'account_name', 'is_default')
    list_filter = ('is_default',)

admin.site.register(BankAccount, BankAccountAdmin)

class CardAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'bank_name', 'card_number', 'expiry_date', 'cvv', 'is_default')
    list_filter = ('is_default',)

class AutoSaveAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'frequency', 'amount', 'active')  # Add 'amount' to the list of displayed fields

class AutoInvestAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'frequency', 'amount', 'active')

class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'transaction_type', 'amount', 'date', 'time', 'description', 'transaction_id'
    )
    list_filter = ('transaction_type', 'date')
    search_fields = ('user__email', 'description', 'transaction_id', 'transaction_type', 'amount')

class PropertyAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'rent_reward', 'units_available']
    list_editable = ['units_available']  # Make the units_available field editable in the list view

admin.site.register(Card, CardAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(AutoSave, AutoSaveAdmin)
admin.site.register(AutoInvest, AutoInvestAdmin)
admin.site.register(Property, PropertyAdmin)





from django.contrib import admin
from .models import CustomUserMetrics

class CustomUserMetricsAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_users', 'total_savings', 'total_investments', 'total_wallet', 'total_active_users', 'total_dormant_users', 'pending_kyc_approvals', 'total_savings_and_investments', 'total_savings_and_investments_this_month')
    list_filter = ('user__is_staff', 'user__is_active', 'user__kyc_updated')

    def user(self, obj):
        return obj.user

    user.short_description = 'User'

    # Calculate the total number of users
    def total_users(self, obj):
        return CustomUserMetrics.objects.count()
    
    total_users.short_description = 'Total Users'
    
    # Calculate the total savings of all users
    def total_savings(self, obj):
        return CustomUserMetrics.objects.aggregate(total_savings=Sum(F('total_savings_and_investments') - F('total_wallet'), output_field=models.DecimalField(max_digits=10, decimal_places=2)))['total_savings']
    
    total_savings.short_description = 'Total Savings'

    # Calculate the total investments of all users
    def total_investments(self, obj):
        return CustomUserMetrics.objects.aggregate(total_investments=Sum(F('total_savings_and_investments') - F('total_wallet'), output_field=models.DecimalField(max_digits=10, decimal_places=2)))['total_investments']
    
    total_investments.short_description = 'Total Investments'

    # Calculate the total wallet balance of all users
    def total_wallet(self, obj):
        return CustomUserMetrics.objects.aggregate(total_wallet=Sum('total_wallet'))['total_wallet']
    
    total_wallet.short_description = 'Total Wallet'

    # Calculate the total active users (Users who have saved within the last two months)
    def total_active_users(self, obj):
        two_months_ago = timezone.now() - timezone.timedelta(days=60)
        return CustomUserMetrics.objects.filter(user__last_login__gte=two_months_ago).count()
    
    total_active_users.short_description = 'Total Active Users'

    # Calculate the total dormant users (Users who haven't saved within the last two months)
    def total_dormant_users(self, obj):
        two_months_ago = timezone.now() - timezone.timedelta(days=60)
        return CustomUserMetrics.objects.filter(user__last_login__lt=two_months_ago).count()
    
    total_dormant_users.short_description = 'Total Dormant Users'

    # Calculate the total number of pending KYC approvals
    def pending_kyc_approvals(self, obj):
        return CustomUserMetrics.objects.aggregate(pending_kyc_approvals=Sum(Case(
            When(user__kyc_updated=False, then=1),
            default=0,
            output_field=IntegerField()
        )))['pending_kyc_approvals']
    
    pending_kyc_approvals.short_description = 'Pending KYC Approvals'

    # Calculate the total savings and investments of all users
    def total_savings_and_investments(self, obj):
        return CustomUserMetrics.objects.aggregate(total_savings_and_investments=Sum('total_savings_and_investments'))['total_savings_and_investments']
    
    total_savings_and_investments.short_description = 'Total Savings and Investments'

    # Calculate the total savings and investments for the current month
    def total_savings_and_investments_this_month(self, obj):
        current_month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        return CustomUserMetrics.objects.filter(user__transaction__date__gte=current_month_start).aggregate(
            total_savings_and_investments_this_month=Coalesce(Sum('user__transaction__amount', filter=Q(user__transaction__date__gte=current_month_start), distinct=True), 0)
        )['total_savings_and_investments_this_month']
    
    total_savings_and_investments_this_month.short_description = 'Total Savings and Investments this Month'

# Register the CustomUserMetrics model with your CustomUserMetricsAdmin
admin.site.register(CustomUserMetrics, CustomUserMetricsAdmin)
