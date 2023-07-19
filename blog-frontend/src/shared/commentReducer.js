const commentTreeReducer = (state, action) => {
  const { commentMap, commentTree } = state;
  if (!action.comment?.text) {
    return state;
  }
  switch (action.type) {
    case "added":
      if (commentMap && action.comment.id in commentMap) {
        return state;
      } else {
        const newCommentMap = {
          ...commentMap,
          [action.comment.id]: action.comment,
        };
        const newCommentTree = addCommentToTree(commentTree, action.comment);
        return { commentMap: newCommentMap, commentTree: newCommentTree };
      }

    case "updated":
      const updatedCommentMap = {
        ...commentMap,
        [action.comment.id]: action.comment,
      };
      const updatedCommentTree = updateCommentInTree(
        commentTree,
        action.comment,
      );
      return { commentMap: updatedCommentMap, commentTree: updatedCommentTree };

    case "deleted":
      const { [action.comment.id]: _, ...newCommentMap } = commentMap;
      const newCommentTree = deleteCommentFromTree(commentTree, action.comment);
      return { commentMap: newCommentMap, commentTree: newCommentTree };

    default:
      return state;
  }
};

const addCommentToTree = (tree, comment) => {
  if (comment.in_reply_to == null) {
    return [...tree, comment];
  } else {
    return tree.map((item) =>
      item.id === comment.in_reply_to
        ? { ...item, replies: [...item.replies, comment] }
        : { ...item, replies: addCommentToTree(item.replies, comment) },
    );
  }
};

const updateCommentInTree = (tree, comment) => {
  return tree.map((item) =>
    item.id === comment.id
      ? comment
      : { ...item, replies: updateCommentInTree(item.replies, comment) },
  );
};

const deleteCommentFromTree = (tree, comment) => {
  return tree
    .filter((item) => item.id !== comment.id)
    .map((item) => ({
      ...item,
      replies: deleteCommentFromTree(item.replies, comment),
    }));
};

export default commentTreeReducer;
