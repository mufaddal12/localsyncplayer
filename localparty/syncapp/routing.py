from django.urls import re_path

from .consumers import *

websocket_urlpatterns = [
    re_path("chat/(?P<room_name>\w+)/$", ChatConsumer.as_asgi()),
    re_path("control/(?P<room_name>\w+)/$", ControlConsumer.as_asgi()),
]
