from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"posts", views.PostViewSet, basename="post")
router.register(r"comments", views.CommentViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("check-token/", views.CheckTokenView.as_view(), name="check-token"),
    path("userblogs/", views.UserBlogListView.as_view(), name="userblogs"),
]
