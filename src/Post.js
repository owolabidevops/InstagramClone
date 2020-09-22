import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from "firebase"

function Post({ postId,user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp','desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);
  const postComment = (event) => {
    event.preventDefault();
    db
        .collection("posts")
        .doc(postId)
        .collection("comments").add({
          text :comment,
          username:user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        } );
        setComment('')
  };

  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avater"
          src="/static/images/avater/1.jpg"
          alt="owolabidevops"
        />
        <h3>{username}</h3>
      </div>

      <img className="post_image" src={imageUrl} alt="" />

      <h4 className="post_text">
        <strong>{username}</strong> {caption}
      </h4>

      <div className="post__comments">
        {comments.map((Comment) => (
          <p>
            <strong>{Comment.username}</strong> {Comment.text}
          </p>
        ))}
      </div>
{user && (
  <form className="postcomment">
        <input
          className="post_input"
          type="text"
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
        n
          className="button"
          disabled={!comment}
          type="submit"
          onClick={postComment}
        >post</button>
      </form>
)}
      
    </div>
  );
}

export default Post;
