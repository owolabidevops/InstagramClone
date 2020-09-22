import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { Modal, makeStyles, Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyle = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  //state saves information for short time
  const classes = useStyle();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState("false");
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  //keep track of the user
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  // useeffect run a piece of code base on a specific condition

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      //everytime a new post is addedd, this code fires
      setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        }))
      );
    })
  }, []);

  const signup = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };
  return (
    <div className="App">
  

      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app-headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png  "
                alt=""
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signup}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app-headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png  "
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app_header">
        <img
          className="app-headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png  "
          alt=""
        />
         {user ? (
        <Button onClick={() => auth.signOut()}>Log Out</Button>
      ) : (
        <div className="app_loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>

          <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
      )}
      </div>
     <div className="app_post">
     <div className ="app_postleft">
      {posts.map(({ id, post }) => (
        <Post
          key={id}
          postId={id}
          user={user}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}
</div>
   <div className="app_postright">
      <InstagramEmbed
                url='https://www.instagram.com/p/B_uf9dmAGPw/'
                maxWidth={320}
                hideCaption={false}
                containerTagName="div"
                protocol=""
                injectScript
                onLoading={()=>{}}
                onSuccess={()=>{}}
                onAfterRender={()=>{}}
                onFailure={()=>{}}

             />
             </div>
</div>
                  
           

             
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3> Sorry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
