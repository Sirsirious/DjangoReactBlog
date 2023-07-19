from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib.auth.models import User
from django.db.models import Count
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Post, Comment

from .serializers import (
    PostSerializer,
    CommentSerializer,
    UserSerializer,
    PostListSerializer,
    PostDetailSerializer,
    UserBlogSerializer,
    CommentContentSerializer,
)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @action(detail=False, methods=["get"], url_path="user/(?P<user_id>\d+)")
    def list_by_user(self, request, user_id=None):
        posts = Post.objects.filter(author_id=user_id)
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = PostListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = PostListSerializer(posts, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentContentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        queryset = super().get_queryset()
        post_id = self.kwargs.get("post_pk")
        if post_id is not None:
            queryset = queryset.filter(post__id=post_id).order_by("created_at")
        return queryset

    @action(detail=False, methods=["get"], url_path="post/(?P<post_id>\d+)")
    def list_by_post(self, request, post_id=None):
        comments = Comment.objects.filter(post=post_id)
        page = self.paginate_queryset(comments)
        if page is not None:
            serializer = CommentContentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = CommentContentSerializer(comments, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        creation_data = serializer.validated_data
        comment = Comment(
            text=creation_data["text"],
            post_id=creation_data["post"].id,
            author=self.request.user,
            in_reply_to=creation_data.get("in_reply_to"),
        )
        comment.full_clean()
        comment.save()
        comment.refresh_from_db()
        channel_layer = get_channel_layer()
        data = {
            "type": "new.comment",
            "payload": {"comment": CommentContentSerializer(comment).data},
        }
        async_to_sync(channel_layer.group_send)(f"post_{comment.post.id}", data)


class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == "create":
            self.permission_classes = [AllowAny]
        return super(UserViewSet, self).get_permissions()


class UserBlogListView(ListAPIView):
    queryset = User.objects.annotate(total_posts=Count("post")).order_by("username")
    serializer_class = UserBlogSerializer
    filter_backends = [SearchFilter]
    authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticatedOrReadOnly,)
    search_fields = ["username"]


class CheckTokenView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response({"detail": "I am alive!"})
