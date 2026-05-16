from .base import *

DEBUG = True

ALLOWED_HOSTS = []

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
CHANNEL_LAYERS = {

    "default": {

        "BACKEND": (
            "channels_redis.core.RedisChannelLayer"
        ),

        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}