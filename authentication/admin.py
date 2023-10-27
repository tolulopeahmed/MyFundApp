from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Message, Property, BankAccount, Card, AutoInvest, Transaction, AutoSave

class CustomUserAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'email', 'first_name', 'last_name', 'phone_number', 'profile_picture',
        'is_staff', 'is_active', 'preferred_asset', 'savings_goal_amount', 'time_period',
        'savings', 'investment', 'properties', 'wallet', 'total_savings_and_investments','user_percentage_to_top_saver'
    )
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone_number', 'profile_picture')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Account Balances', {'fields': ('savings', 'investment', 'properties', 'wallet')}),  # Add account balances fields
        ('Referral', {'fields': ('pending_referral_reward',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

    def total_savings_and_investments(self, obj):
        return obj.savings + obj.investment

    total_savings_and_investments.short_description = 'Total Savings and Investments'

    def user_percentage_to_top_saver(self, obj):
        # Calculate the user's percentage to top saver
        top_saver = CustomUser.objects.all().order_by('-savings_and_investments').first()
        if top_saver and top_saver.savings_and_investments > 0:
            user_percentage = (obj.savings_and_investments / top_saver.savings_and_investments) * 100
        else:
            user_percentage = 0
        return f"{user_percentage:.2f}%"

    user_percentage_to_top_saver.short_description = 'Percentage to Top Saver'
    user_percentage_to_top_saver.admin_order_field = 'savings_and_investments' 



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
    list_display = ('id','user', 'bank_name', 'account_number', 'account_name', 'is_default')
    list_filter = ('is_default',)

admin.site.register(BankAccount, BankAccountAdmin)

class CardAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'bank_name', 'card_number', 'expiry_date', 'cvv', 'is_default')
    list_filter = ('is_default',)


class AutoSaveAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'frequency', 'amount', 'active')  # Add 'amount' to the list of displayed fields

class AutoInvestAdmin(admin.ModelAdmin):
    list_display = ('id','user', 'frequency', 'amount', 'active')

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




