# Generated by Django 4.2.3 on 2023-08-22 09:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_message_remove_usermessage_recipient_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='message_images/'),
        ),
    ]