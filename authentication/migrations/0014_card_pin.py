# Generated by Django 4.2.3 on 2023-08-29 12:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0013_customuser_investment_customuser_properties_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='pin',
            field=models.CharField(default='0000', max_length=4),
        ),
    ]