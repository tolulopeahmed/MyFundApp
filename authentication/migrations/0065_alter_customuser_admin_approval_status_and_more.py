# Generated by Django 5.0 on 2024-01-16 22:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0064_investtransferrequest'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='admin_approval_status',
            field=models.CharField(default='Not yet started', max_length=20),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='kyc_status',
            field=models.CharField(default='Not yet started', max_length=20),
        ),
    ]
