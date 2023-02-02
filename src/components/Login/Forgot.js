import React, { createContext, useContext, useEffect, useState } from "react";
import InputField2 from "./InputField2";
import { Navi } from "./Navi";
import InputField3 from "./InputField3";
import SubmitButton from "./SubmitButton";
import { getDatabase, get, ref, child } from "firebase/database";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function Forgot() {
  //document.documentElement.style.setProperty("--loginFormHeight", "300px");
  let user = {
    eUID: "",
    email: "",
  };
  // window.Email.send({
  //   SecureToken: "a7c5f1f2-ca00-46d0-9d0e-b60a0946efc5",
  //   To: "isaiahbugarin@gmail.com",
  //   From: "isaiahbugarin@gmail.com",
  //   Subject: "This is the subject",
  //   Body: "And this is the body",
  // }).then((message) => alert("mail has been sent sucessfully"));
  const [userEmail, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Update the document title using the browser API
    document.documentElement.style.setProperty("--loginFormHeight", "250px");
    document.documentElement.style.setProperty("--loginFormWidth", "350px");
  });

  //const db = require("firebase");





//function called for reset password process on submit of email
  function HandleResetPass() {
    const dbRef = ref(getDatabase());
    //getting snapshot of all entries in "users" table
    get(child(dbRef, "users"))
      .then((snapShot) => {
        let match = false;
        if (snapShot.exists()) {
          //iterate through each entry of "users" table snapshot
          match = snapShot.forEach((curr) => {
            const ID = curr.ref._path.pieces_[1]; //access the euid of the current entry

            let currEmail = snapShot.child(ID).child("email").val();
            //console.log(curr);
            //IDs.push(ID);

            if (currEmail === userEmail) {
              user = { eUID: ID, email: currEmail };
              return true;
            }
          });
          return match;
          //console.log(IDs);
          //console.log(userEmail);
        }
      })
      .then((match) => {
        try {
          //if match was successful, sends password reset email to the matched user's email
          if (match)
          {
            setError("");
            const auth = getAuth();
            sendPasswordResetEmail(auth, user.email)
              .then(() => {
                setEmailSent(true);
                console.log("Password reset email sent!");
              })
              .catch((error) => {
                setEmailSent(false);
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
                setError("User does not exist in system")
                // ..
              });
          }
          else
          {
            throw Error("Email does not exist in system");
          }
        } 
        catch (err) {
          console.log(err.message);
          setError(err.message);
          setEmailSent(false);
        }
      });
  }

  return (

  
    <div className="loginFormContainer">
      
      {!emailSent && (
        <div className="titleBar">
          <Navi destination="/Login" />
          <div className="titleText2">Forgot Password</div>
        </div>
      )}

      
        {error && (
          <p
            style={{
              marginTop: "10px",
              fontSize: "20px",
              color: "red",
            }}
          >
            {error}
          </p>
        )}

        {emailSent && (
          <p
            style={{
              marginTop: "10px",
              fontSize: "20px",
              color: "green",
            }}
          >
            Password reset email sent!
          </p>
        )}

        {!emailSent && (
          <>
            <div
              className="w-100 text-center mt-2 text-danger"
              id="errorMessage"
            ></div>

            <div className="emailInput">
              <InputField2
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e)}
              />
            </div>
            <SubmitButton text="Reset Password" onClick={HandleResetPass} />
        </>)}
      
     </div> 
   
    
  );
}