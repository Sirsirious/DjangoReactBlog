from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Comment(models.Model):
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    in_reply_to = models.ForeignKey(
        "self", related_name="replies", on_delete=models.CASCADE, null=True, blank=True
    )

    def clean(self):
        if self.in_reply_to:
            if self.in_reply_to == self:
                raise ValidationError("A comment cannot be a reply to itself.")
            if not Comment.objects.filter(id=self.in_reply_to.id).exists():
                raise ValidationError("The comment you are replying to does not exist.")
        super().clean()
