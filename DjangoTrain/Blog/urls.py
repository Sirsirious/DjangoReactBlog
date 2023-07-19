from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedSimpleRouter

from . import views

router = DefaultRouter()
router.register(r"posts", views.PostViewSet, basename="post")

user_router = DefaultRouter()
user_router.register(r"users", views.UserViewSet, basename="user")

post_router = NestedSimpleRouter(router, r"posts", lookup="post")
post_router.register(r"comments", views.CommentViewSet, basename="post-comments")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(post_router.urls)),
    path("", include(user_router.urls)),
    path("check-token/", views.CheckTokenView.as_view(), name="check-token"),
    path("userblogs/", views.UserBlogListView.as_view(), name="userblogs"),
]
