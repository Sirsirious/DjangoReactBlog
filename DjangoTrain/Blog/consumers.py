from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.mixins import ListModelMixin
from .models import Comment
from .serializers import CommentSerializer


class CommentConsumer(ListModelMixin, GenericAsyncAPIConsumer):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    async def post(self, comment, **kwargs):
        serializer = self.get_serializer(data=comment)
        serializer.is_valid(raise_exception=True)
        instance = await self.perform_create(serializer)
        data = CommentSerializer(instance).data
        await self.send_json(data)
        return data, 201

    def get_queryset(self, **kwargs):
        return Comment.objects.filter(
            post__id=self.scope["url_route"]["kwargs"]["post_id"]
        )
