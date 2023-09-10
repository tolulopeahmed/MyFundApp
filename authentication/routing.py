from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/transaction_update/$', consumers.TransactionUpdateConsumer.as_asgi()),
    # Add other WebSocket consumers and channels if needed
]
