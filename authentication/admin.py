from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Message, BankAccount, Card, AutoInvest, AccountBalance, Transaction, AutoSave

class CustomUserAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'email', 'first_name', 'last_name', 'phone_number', 'profile_picture',
        'is_staff', 'is_active', 'preferred_asset', 'savings_goal_amount', 'time_period',
        'savings', 'investment', 'properties', 'wallet'
    )
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone_number', 'profile_picture', 'referral')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Account Balances', {'fields': ('savings', 'investment', 'properties', 'wallet')})  # Add account balances fields
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)


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
    list_display = ('user', 'bank_name', 'account_number', 'account_name', 'is_default')
    list_filter = ('is_default',)

admin.site.register(BankAccount, BankAccountAdmin)

class CardAdmin(admin.ModelAdmin):
    list_display = ('user', 'bank_name', 'card_number', 'expiry_date', 'cvv', 'is_default')
    list_filter = ('is_default',)


class AutoSaveAdmin(admin.ModelAdmin):
    list_display = ('user', 'frequency', 'amount', 'active')  # Add 'amount' to the list of displayed fields

class AutoInvestAdmin(admin.ModelAdmin):
    list_display = ('user', 'frequency', 'amount', 'active')

# admin.py

from django.contrib import admin
from django.db.models import F
from .models import CustomUser, AccountBalance

class AccountBalanceAdmin(admin.ModelAdmin):
    list_display = ('user', 'savings', 'investment', 'properties', 'wallet')
    list_filter = ('user',)  # You can add more filters if needed
    search_fields = ('user__email', 'user__first_name', 'user__last_name')  # Allow searching by user fields

    actions = ['add_to_savings', 'subtract_from_savings', 'add_to_investment', 'subtract_from_investment', 'add_to_properties', 'subtract_from_properties', 'add_to_wallet', 'subtract_from_wallet']

    def add_to_savings(self, request, queryset):
        queryset.update(savings=F('savings') + 100)  # Adjust the amount as needed
        self.message_user(request, "Added 100 to Savings for selected users.")

    def subtract_from_savings(self, request, queryset):
        queryset.update(savings=F('savings') - 100)  # Adjust the amount as needed
        self.message_user(request, "Subtracted 100 from Savings for selected users.")

    def add_to_investment(self, request, queryset):
        queryset.update(investment=F('investment') + 100)  # Adjust the amount as needed
        self.message_user(request, "Added 100 to Investment for selected users.")

    def subtract_from_investment(self, request, queryset):
        queryset.update(investment=F('investment') - 100)  # Adjust the amount as needed
        self.message_user(request, "Subtracted 100 from Investment for selected users.")

    def add_to_properties(self, request, queryset):
        queryset.update(properties=F('properties') + 100)  # Adjust the amount as needed
        self.message_user(request, "Added 100 to Properties for selected users.")

    def subtract_from_properties(self, request, queryset):
        queryset.update(properties=F('properties') - 100)  # Adjust the amount as needed
        self.message_user(request, "Subtracted 100 from Properties for selected users.")

    def add_to_wallet(self, request, queryset):
        queryset.update(wallet=F('wallet') + 100)  # Adjust the amount as needed
        self.message_user(request, "Added 100 to Wallet for selected users.")

    def subtract_from_wallet(self, request, queryset):
        queryset.update(wallet=F('wallet') - 100)  # Adjust the amount as needed
        self.message_user(request, "Subtracted 100 from Wallet for selected users.")



admin.site.register(Card, CardAdmin)
admin.site.register(AccountBalance, AccountBalanceAdmin)
admin.site.register(Transaction)
admin.site.register(AutoSave, AutoSaveAdmin)
admin.site.register(AutoInvest, AutoInvestAdmin) 




