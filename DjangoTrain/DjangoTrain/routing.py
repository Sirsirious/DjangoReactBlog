from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from Blog import consumers  # replace "your_app" with your app name

application = ProtocolTypeRouter(
    {
        "websocket": URLRouter(
            [
                path(
                    "ws/posts/<int:post_id>/comments/",
                    consumers.CommentConsumer.as_asgi(),
                ),
            ]
        ),
    }
)
