from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Message, BankAccount, Card, AccountBalance, Transaction, AutoSave

class CustomUserAdmin(UserAdmin):
    list_display = UserAdmin.list_display + ('preferred_asset', 'savings_goal_amount', 'time_period')

    list_display = ('id', 'email', 'first_name', 'last_name', 'phone_number', 'profile_picture', 'is_staff', 'is_active', 'preferred_asset', 'savings_goal_amount', 'time_period', 'savings', 'investment', 'properties', 'wallet')
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone_number', 'profile_picture', 'referral')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
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

admin.site.register(Card, CardAdmin)
admin.site.register(AccountBalance)
admin.site.register(Transaction)
admin.site.register(AutoSave)


