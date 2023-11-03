from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Message, Property, BankAccount, Card, AutoInvest, Transaction, AutoSave
from django.core.mail import send_mail
from django.urls import reverse
from rest_framework.response import Response
from django.http import HttpResponseRedirect
from django.contrib import admin
from django.db.models import Sum
from django.utils import timezone
from .models import CustomUser, MonthlySavings

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









@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'content', 'timestamp')
    list_filter = ('timestamp',)
    search_fields = ('sender__username', 'recipient__username', 'content')

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
