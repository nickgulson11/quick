import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import CourseList, { addScheduleTimes } from './components/CourseList'
import React, { useState, useEffect } from 'react'
import { Button, Container, Message, Title } from 'rbx';

const Banner = ({ user, title }) => (
  <React.Fragment>
    { user ? <Welcome user={ user } /> : <SignIn /> }
    <Title>{ title || '[loading...]' }</Title>
  </React.Fragment>
);

const Welcome = ({ user }) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </Message.Header>
  </Message>
);

const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};
 
const App = () => {
  const [schedule, setSchedule] = useState({ title: '', courses: [] });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setSchedule(addScheduleTimes(snap.val()));
    };
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return (
    <Container>
      <Banner title={ schedule.title } user={ user } />
      <CourseList courses={ schedule.courses } user={ user } />
    </Container>
  );
};

const firebaseConfig = {
  apiKey: "AIzaSyBKlhaFJDtnhtgpRAdYsbgqKA8BOZ2j6lA",
  authDomain: "gulsontyphoon.firebaseapp.com",
  databaseURL: "https://gulsontyphoon.firebaseio.com",
  projectId: "gulsontyphoon",
  storageBucket: "gulsontyphoon.appspot.com",
  messagingSenderId: "212137534636",
  appId: "1:212137534636:web:4585a68062392ff6f2ab09",
  measurementId: "G-WQ20T00Q4X"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

export { db };
export default App;