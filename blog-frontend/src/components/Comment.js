import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";
import ReplyIcon from "@material-ui/icons/Reply";
import { ISODateToDate } from "../utils/dates";
import AuthContext from "../utils/AuthContext";

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
}));

function Comment({ comment, index }) {
  const classes = useStyles({ isEven: index % 2 === 0 });
  const isAuthenticated = useContext(AuthContext);
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
        >
          Reply to
        </Button>
      )}
    </div>
  );
}

export default Comment;
