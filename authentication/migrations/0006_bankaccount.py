# Generated by Django 4.2.3 on 2023-08-23 10:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0005_alter_message_options_remove_message_reply_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='BankAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bank_name', models.CharField(max_length=100)),
                ('account_number', models.CharField(max_length=20)),
                ('is_default', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bank_accounts', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]