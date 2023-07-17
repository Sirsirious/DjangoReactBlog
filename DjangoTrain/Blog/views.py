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
    serializer_class = CommentSerializer


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
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response({"detail": "I am alive!"})
