from rest_framework import serializers
from .models import Post, Comment
from django.contrib.auth.models import User


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["title", "content"]


class PostListSerializer(serializers.ModelSerializer):
    truncated_content = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ("id", "title", "truncated_content", "created_at")

    def get_truncated_content(self, obj):
        return obj.content[:100] + " ..."  # return first 100 characters


class PostDetailSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")

    class Meta:
        model = Post
        fields = ["id", "title", "content", "author"]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["text", "post"]


class CommentContentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")

    class Meta:
        model = Comment
        fields = ["id", "text", "post", "author", "created_at"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class UserBlogSerializer(serializers.ModelSerializer):
    total_posts = serializers.IntegerField()

    class Meta:
        model = User
        fields = ["username", "total_posts", "id"]
