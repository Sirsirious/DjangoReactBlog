from django.urls import re_path


from Blog import consumers

websocket_urlpatterns = [
    re_path(
        r"ws/posts/(?P<post_id>\d+)/comments/$", consumers.CommentConsumer.as_asgi()
    ),
]
