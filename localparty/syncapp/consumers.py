import json

from channels.generic.websocket import AsyncWebsocketConsumer  # The class we're using


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_" + self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        await self.accept()
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": "Someone joined",
            },
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
            },
        )

    async def chat_message(self, event):
        message = event["message"]

        await self.send(
            text_data=json.dumps(
                {
                    "message": message,
                }
            )
        )


class ControlConsumer(AsyncWebsocketConsumer):
    # When a new user joins, pause video for all and let the control room know someone new joined (using "newjoin" key)
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "control_" + self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        data = {
            "playing": False,
            "newjoin": True,
            "type": "control_message",
            "sender_channel_name": self.channel_name,
        }
        await self.accept()
        await self.channel_layer.group_send(
            self.room_group_name,
            data,
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    # Whatever latest change is by any user, make it effective for all users
    # When someone new joins, he shouldn't play
    async def receive(self, text_data):

        data = {
            "newjoin": False,
            "playing": True,
            "played": 0,
        }
        data = json.loads(text_data)
        # print(data)
        data.update(
            {
                "type": "control_message",
                "newjoin": False,
                "sender_channel_name": self.channel_name,
            }
        )
        await self.channel_layer.group_send(
            self.room_group_name,
            data,
        )

    async def control_message(self, event):
        # if self.channel_name != event["sender_channel_name"]:
        await self.send(text_data=json.dumps(event))
