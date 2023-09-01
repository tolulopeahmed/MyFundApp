import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.recipient_id = self.scope['url_route']['kwargs']['recipient_id']
        self.room_group_name = f"chat_{self.recipient_id}"

        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))


class BalanceUpdateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def send_balance_update(self, event):
        await self.send_json(event)  # Send the balance update as JSON to the connected client

    async def update_balances(self, event):
        # Get the updated balances from the event data
        updated_balances = event["balances"]
        
        # Broadcast the updated balances to all connected clients
        await self.send_balance_update({
            "type": "balance.update",
            "balances": updated_balances,
        })