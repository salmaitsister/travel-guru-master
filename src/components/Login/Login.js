import { TextField } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import fbLogo from '../../Icon/fb.png';
import googleLogo from '../../Icon/google.png';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { UserContext } from '../Home/Home';
import { useHistory, useLocation } from 'react-router-dom';


firebase.initializeApp(firebaseConfig);
export const handleLogout = () => {
    return firebase.auth().signOut()
    .then(res => {
        return res
      }).catch(function(error) {
        // An error happened.
      });
}

const Login = () => {
    const [newUser, setNewUser] = useState(true)
    const [places, handleSelectPlace, detail, user, setUser] = useContext(UserContext)
    // const {name, email, password, success, isLoggedIn} = user;

    let history = useHistory();
    let location = useLocation();

    let { from } = location.state || { from: { pathname: "/" } };

    // google login
    const  googleLogin = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
        .then(res => {
            const {displayName, email} = res.user;
            const signedInUser = {...user};
            signedInUser.email = email;
            signedInUser.name = displayName;
            signedInUser.success = true;
            setUser(signedInUser)
            history.replace(from);
            
          })
          .catch(error => {
            var errorMessage = error.message;
            console.log(errorMessage)
          });
    }

    // facebook login
    const fbLogin = () => {
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider)
        .then(res => {
            const {displayName, email} = res.user;
            const signedInUser = {...user};
            signedInUser.email = email;
            signedInUser.name = displayName;
            signedInUser.success = true;
            setUser(signedInUser)
            history.replace(from);
          })
          .catch(error => {
            var errorMessage = error.message;
            console.log(errorMessage)
          });
    }

    const handleBlur = (e) => {
        let isFormValid = true;
        const password = e.target.name === 'password'
        if(e.target.name === 'email'){
            isFormValid = /\S+@\S+\.\S+/.test(e.target.value)
        }
        if(password){
            const isPasswordValid = e.target.value.length > 6;
            const passwordHasNumber = /\d{1}/.test(e.target.value)
            isFormValid = isPasswordValid && passwordHasNumber
        }
        if(isFormValid){
            const signedInUser = {...user};
            signedInUser[e.target.name] = e.target.value;
            setUser(signedInUser)
        }
    }

    const handleSubmit = (e) => {
        if(newUser && user.email && user.password){
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(res => {
                const {displayName, email} = res.user;
                const signedInUser = {...user};
                signedInUser.name = displayName;
                signedInUser.email = email;
                signedInUser.error = '';
                signedInUser.success = true;
                signedInUser.isLoggedIn = true;
                setUser(signedInUser)
                updateUserName(user.name)
                history.replace(from);
                console.log(res);   
            })
            .catch(function(error) {
                const signedInUser = {...user};
                signedInUser.error = error.message;
                signedInUser.success = false;
                setUser(signedInUser)
            });
        }

        if(!newUser && user.email && user.password){
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then(res => {
                const {displayName, email} = res.user;
                const signedInUser = {...user};
                signedInUser.name = displayName;
                signedInUser.email = email;
                signedInUser.error = '';
                signedInUser.success = true;
                signedInUser.isLoggedIn = true;
                setUser(signedInUser)
                history.replace(from);
                console.log(res)
            })
            .catch(function(error) {
                const signedInUser = {...user};
                signedInUser.error = error.message;
                signedInUser.success = false;
                setUser(signedInUser)
            });
        }
        e.preventDefault()
    }

    const updateUserName = name => {
        const user = firebase.auth().currentUser;
        user.updateProfile({
        displayName: name,
        })
        .then(res => {
            console.log('username updated successfully')
        })
        .catch(error => {
            console.log(error.message)
        });
    }

    

    
    return (
        <div className='w-50 text-center mx-auto border border-secondary py-3 px-4 bg-light rounded'>
            <h4 className='mb-4'>Create an account</h4>
            <form onSubmit={handleSubmit}>
                {
                    newUser && 
                    <input onBlur={handleBlur} className='w-100 mb-3 border border-secondary rounded p-2 ' placeholder='Name' type="text" name='name'/>
                }
                <br/>
                <input onBlur={handleBlur} className='w-100 mb-3 border border-secondary rounded p-2' placeholder='Email' type="email" name='email'/>
                <br/>
                <input onBlur={handleBlur} className='w-100 mb-3 border border-secondary rounded p-2' placeholder='Password' type="password" name='password'/>
                <br/>
                <input className='btn btn-warning w-100 mb-2  rounded p-2'  type="submit" value={newUser ? 'Create an account' : 'Login'}/>
            </form>
            {
                user.success ? <p style={{color:'green'}}>User {newUser ? 'created' : 'logged in'} successfully</p> : <p style={{color:'red'}}>{user.error}</p>
            }

            <p>{newUser ? 'Already have an account?' : "Don't have an account?"} <span onClick={() => setNewUser(!newUser)} className='text-warning'>{ newUser ? 'Login' : 'Create an account'}</span></p>
            <p>Or</p>
            <div onClick={fbLogin} className='border border-secondary d-flex justify-content-center align-items-center py-1 w-50 mx-auto rounded-pill mb-2' >
                <img className='mx-2 ' style={{width:'30px'}} src={fbLogo} alt=""/>
                <p className='mb-0  '>Continue with facebook</p>
            </div>
            <div onClick={googleLogin} className='border border-secondary d-flex justify-content-center align-items-center py-1 w-50 mx-auto rounded-pill' >
                <img className='mx-2 ' style={{width:'30px'}} src={googleLogo} alt=""/>
                <p className='mb-0 '>Continue with Google</p>
            </div>
        </div>
    );
};

export default Login;