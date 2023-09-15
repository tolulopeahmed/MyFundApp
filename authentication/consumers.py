# import json
# from channels.generic.websocket import AsyncWebsocketConsumer

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.recipient_id = self.scope['url_route']['kwargs']['recipient_id']
#         self.room_group_name = f"chat_{self.recipient_id}"
#         print(f"WebSocket Connected: {self.scope['user']}")

#         # Join the room group
#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )

#         await self.accept()

#     async def disconnect(self, close_code):
#         # Leave the room group
#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )
#         print(f"WebSocket Disconnected: {self.scope['user']}")


#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']

#         # Send message to room group
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 'type': 'chat_message',
#                 'message': message
#             }
#         )

#     async def chat_message(self, event):
#         message = event['message']

#         # Send message to WebSocket
#         await self.send(text_data=json.dumps({
#             'message': message
#         }))


# class BalanceUpdateConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         await self.accept()

#     async def disconnect(self, close_code):
#         pass

#     async def update_balances(self, event):
#         updated_balances = event["balances"]
#         await self.send_json({
#             "type": "update_balances",
#             "balances": updated_balances,
#         })




# class TransactionUpdateConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         await self.accept()

#     async def disconnect(self, close_code):
#         pass  # Handle WebSocket disconnects if needed

#     async def send_transaction_update(self, transaction_data):
#         await self.send(json.dumps({
#             'type': 'update_transaction',
#             'transaction': transaction_data,
#         }))
