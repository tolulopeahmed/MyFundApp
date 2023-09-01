from channels.routing import ProtocolTypeRouter, URLRouter
from authentication.consumers import BalanceUpdateConsumer
from django.urls import path

application = ProtocolTypeRouter({
    "websocket": URLRouter([
        path("ws/balance_update/", BalanceUpdateConsumer.as_asgi()),
    ]),
})
