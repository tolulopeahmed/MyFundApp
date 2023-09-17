# schema.py
import graphene
from graphene_django.types import DjangoObjectType
from .models import CustomUser, Message

class UserType(DjangoObjectType):
    class Meta:
        model = CustomUser

class MessageType(DjangoObjectType):
    class Meta:
        model = Message

class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    messages = graphene.List(MessageType)

    def resolve_users(self, info):
        return CustomUser.objects.all()

    def resolve_messages(self, info):
        return Message.objects.all()

schema = graphene.Schema(query=Query)
