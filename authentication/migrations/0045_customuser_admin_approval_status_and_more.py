# Generated by Django 4.2.5 on 2023-10-29 23:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0044_customuser_address_customuser_date_of_birth_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='admin_approval_status',
            field=models.CharField(default='pending', max_length=10),
        ),
        migrations.AddField(
            model_name='customuser',
            name='kyc_status',
            field=models.CharField(default='pending', max_length=10),
        ),
    ]
