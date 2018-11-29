import React, {Component} from "react";
import {loginWithGoogle} from "../Firebase/auth";
import {firebaseAuth} from "../Firebase/firebase";

import UserHome from "../UserHome/UserHome"

const firebaseAuthKey = "firebaseAuthInProgress";
const appTokenKey = "appToken";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            splashScreen: false,
            userEmail:""
        };

        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    }

    handleGoogleLogin() {
        loginWithGoogle()
            .catch(function (error) {
                alert(error); // or show toast
                localStorage.removeItem(firebaseAuthKey);
                console.log("removeItem", firebaseAuthKey);
            });
        localStorage.setItem(firebaseAuthKey, "1");
        console.log("setItem", firebaseAuthKey);
    }

    componentDidMount() {
        console.log("componentDidMount");
        // firebaseAuth().getRedirectResult().then(function(result) {
        //   console.log("result",result);
        //   if (result.user) {
        //  console.log("GoogleLogin Redirect result");
        //    if (result.credential) {
        //    // This gives you a Google Access Token. You can use it to access the Google API.
        //    let token = result.credential.accessToken;
        //    // ...
        //  }
        //    // The signed-in user info.
        //    let user = result.user;
        //    console.log("user:", JSON.stringify(user));
        //  }
        //  }).catch(function(error) {
        //      // Handle Errors here.
        //      var errorCode = error.code;
        //      var errorMessage = error.message;
        //      // The email of the user's account used.
        //      var email = error.email;
        //      // The firebase.auth.AuthCredential type that was used.
        //      var credential = error.credential;
        //      // ...
        //      alert(error);
        //  });

        /**
         * We have appToken relevant for our backend API
         */
        // if (localStorage.getItem(appTokenKey)) {
        //     this.props.history.push("/home");
        //     console.log("User from storage", localStorage.getItem("userEmail"), this.state.userEmail);
        //     return;
        // }

        if (localStorage.getItem("userEmail")) {
            // this.props.history.push("/home");
            console.log("User from storage", localStorage.getItem("userEmail"), this.state.userEmail);
            return;
        }

        firebaseAuth().onAuthStateChanged(user => {
            if (user) {
                console.log("User signed in: ", JSON.stringify(user));

                localStorage.removeItem(firebaseAuthKey);

                // here you could authenticate with you web server to get the
                // application specific token so that you do not have to
                // authenticate with firebase every time a user logs in

                // store the token
                localStorage.setItem(appTokenKey, user.uid);
                //store email
                localStorage.setItem("userEmail", user.email)

                this.setState({
                  userEmail:user.email
                })

                // this.props.history.push("/home")
                console.log("user" , localStorage.getItem("userEmail"));
            }
        });
    }

    render() {
        console.log(firebaseAuthKey + "=" + localStorage.getItem(firebaseAuthKey));
        if (localStorage.getItem(firebaseAuthKey) === "1") return <SplashScreen />;
        if (localStorage.getItem("userEmail")) return <UserHome email={localStorage.getItem("userEmail")}/>
        return <LoginPage handleGoogleLogin={this.handleGoogleLogin}/>;
    }
}
export default Login

const LoginPage = ({handleGoogleLogin}) => (
    <div>
        <h1>Login</h1>
        <div>
            <button onClick={handleGoogleLogin} className="action-button"> Sign in</button>
        </div>
    </div>
);
const SplashScreen = () => (<p>Loading...</p>)
