import os

from channels.auth import AuthMiddlewareStack
from channels.routing import (
    ProtocolTypeRouter,
    URLRouter,
)

from django.core.asgi import get_asgi_application
from apps.notifications.middleware.jwt_auth_middleware import (
    JWTAuthMiddleware,
)
from apps.notifications.routing.websocket_routing import (
    websocket_urlpatterns,
)


os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings.local",
)

django_asgi_app = get_asgi_application()


application = ProtocolTypeRouter({

    "http": django_asgi_app,

    "websocket": JWTAuthMiddleware(

        URLRouter(
            websocket_urlpatterns
        )
    ),
})