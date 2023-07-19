from channels.generic.websocket import AsyncWebsocketConsumer
import json


class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.post_id = self.scope["url_route"]["kwargs"]["post_id"]
        self.group_name = f"post_{self.post_id}"

        # Join group
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave group
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to group
        await self.channel_layer.group_send(
            self.group_name, {"type": "new.comment", "message": message}
        )

    # Receive message from group
    async def new_comment(self, event):
        print(event)
        event_type = event["type"]
        if event_type == "new.comment":
            comment = event["payload"]["comment"]
            # Send message to WebSocket
            await self.send(text_data=json.dumps(comment))
