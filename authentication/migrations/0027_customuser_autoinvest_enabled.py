# Generated by Django 4.2.5 on 2023-10-03 11:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0026_autoinvest'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='autoinvest_enabled',
            field=models.BooleanField(default=False),
        ),
    ]