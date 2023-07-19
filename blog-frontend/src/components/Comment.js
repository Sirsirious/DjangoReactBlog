import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";
import ReplyIcon from "@material-ui/icons/Reply";
import { ISODateToDate } from "../utils/dates";
import AuthContext from "../utils/AuthContext";
import CommentForm from "./CommentForm";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: (props) => (props.isEven ? "#f5f5f5" : "#c5c5c5"),
    margin: theme.spacing(1),
    width: "500px",
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
  },
  author: {
    color: "#787878",
  },
  button: {
    marginTop: theme.spacing(1),
  },
  replyForm: {
    marginLeft: theme.spacing(4),
    border: "1px solid #ddd",
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    backgroundColor: "#fafafa",
  },
}));

function Comment({ comment, index }) {
  const classes = useStyles({ isEven: index % 2 === 0 });
  const isAuthenticated = useContext(AuthContext);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleCloseForm = () => {
    setShowReplyForm(false);
  };

  const handleReply = () => {
    setShowReplyForm(true);
  };

  return (
    <div className={classes.root}>
      <Typography variant="body1">{comment.text}</Typography>
      <Typography variant="body2" className={classes.author}>
        {ISODateToDate(comment.created_at)} by {comment.author}
      </Typography>
      {isAuthenticated && (
        <Button
          startIcon={<ReplyIcon />}
          size="small"
          className={classes.button}
          onClick={handleReply}
          disabled={showReplyForm} // disable the button when reply form is open
        >
          Reply to
        </Button>
      )}
      {showReplyForm && (
        <div className={classes.replyForm}>
          <CommentForm
            postId={comment.post}
            onCommentPosted={() => setShowReplyForm(false)}
            replyToId={comment.id}
            closeForm={handleCloseForm}
          />
        </div>
      )}
    </div>
  );
}

export default Comment;
