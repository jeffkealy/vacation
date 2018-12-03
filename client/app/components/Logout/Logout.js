import React, {Component} from "react";
import {logout} from "../Firebase/auth";
import {firebaseAuth} from "../Firebase/firebase";

const firebaseAuthKey = "firebaseAuthInProgress";
const appTokenKey = "appToken";

class Logout extends Component {
  constructor(props) {
      super(props);
      this.state = {
      };

      this.handleLogout = this.handleLogout.bind(this);

  }
  handleLogout(){
    console.log(this.props.history);
    logout()
      .catch(function (error) {
          alert(error); // or show toast
          localStorage.removeItem(firebaseAuthKey);
          console.log("removeItem", firebaseAuthKey);
      });
      localStorage.setItem(firebaseAuthKey, "0");
      console.log("logging out ", localStorage.getItem("userEmail"));

      localStorage.removeItem("userEmail")
      this.props.history.push("/");
      console.log("handleGoogleLogin setItem", firebaseAuthKey);
  }
  render() {
    return (
      <div>
        <button onClick={()=>this.handleLogout()} className="action-button log-out-button"> Log Out</button>
      </div>
    )
  }
}
export default Logout;
