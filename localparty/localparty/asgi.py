import os

from channels.layers import get_channel_layer
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import django
from django.core.asgi import get_asgi_application
from channels.routing import get_default_application
import syncapp.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "localparty.settings")

channel_layer = get_channel_layer()
# django.setup()

# application = get_default_application()

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(
                syncapp.routing.websocket_urlpatterns,
            ),
        ),
    }
)
