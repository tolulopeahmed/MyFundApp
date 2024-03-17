# myfund/schema.py

import os
import graphene
from graphene_django.types import DjangoObjectType
from .models import Card, Transaction
from decimal import Decimal
import requests
from graphql_jwt.decorators import login_required  # Import login_required decorator


class CardType(DjangoObjectType):
    class Meta:
        model = Card


class QuickSave(graphene.Mutation):
    class Arguments:
        card_id = graphene.Int()
        amount = graphene.Float()

    success = graphene.Boolean()

    @staticmethod
    @login_required  # Use the login_required decorator to ensure authentication
    def mutate(root, info, card_id, amount):
        # Get the user making the request (you may need to implement authentication)
        user = info.context.user

        try:
            # Get the selected card
            card = Card.objects.get(id=card_id, user=user)

            # Payment processing with Paystack (similar to your previous code)
            paystack_secret_key = os.environ.get(
                "PAYSTACK_KEY_LIVE",
                default="sk_test_dacd07b029231eed22f407b3da805ecafdf2668f",
            )
            card_number = card.card_number
            cvv = card.cvv
            expiry_month, expiry_year = card.expiry_date.split("/")
            amount_in_kobo = int(amount * 100)  # Convert amount to kobo

            paystack_url = "https://api.paystack.co/charge"
            payload = {
                "card": {
                    "number": card_number,
                    "cvv": cvv,
                    "expiry_month": expiry_month,
                    "expiry_year": expiry_year,
                },
                "email": user.email,
                "amount": amount_in_kobo,
            }
            headers = {
                "Authorization": f"Bearer {paystack_secret_key}",
                "Content-Type": "application/json",
            }

            response = requests.post(paystack_url, json=payload, headers=headers)
            paystack_response = response.json()

            if paystack_response.get("status"):
                # Payment successful, update user's savings
                user.savings += Decimal(amount)
                user.save()

                # Create a transaction record
                Transaction.objects.create(
                    user=user,
                    transaction_type="credit",
                    amount=amount,
                    description="QuickSave",
                )

                return QuickSave(success=True)

            else:
                raise Exception("Payment failed. Please try again later.")

        except Card.DoesNotExist:
            raise Exception("Selected card not found.")


class Mutation(graphene.ObjectType):
    quick_save = QuickSave.Field()


schema = graphene.Schema(mutation=Mutation)
