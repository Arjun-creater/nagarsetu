from .base import *

from decouple import config



DEBUG = False



ALLOWED_HOSTS = [
    "*"
]



CORS_ALLOW_ALL_ORIGINS = True



SECRET_KEY = config(
    "SECRET_KEY"
)



DATABASES = {
    "default": {
        "ENGINE":
            "django.db.backends.mysql",

        "NAME":
            config("DB_NAME"),

        "USER":
            config("DB_USER"),

        "PASSWORD":
            config("DB_PASSWORD"),

        "HOST":
            config("DB_HOST"),

        "PORT":
            config("DB_PORT"),
    }
}



STATIC_ROOT = (
    BASE_DIR / "staticfiles"
)



STATICFILES_STORAGE = (
    "whitenoise.storage.CompressedManifestStaticFilesStorage"
)
