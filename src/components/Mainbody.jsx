import React, { useState, useEffect, useRef } from 'react';
import axios from "../axios";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import {useAuth} from "../contexts/AuthContext";
import {useTheme} from "../contexts/ThemeContext";
import { Redirect } from 'react-router-dom';

const Mainbody = () => {

    const [passwordShow, setpasswordShow] = useState(false);
    const [error, setError] = useState("");
    const [userInfo, setUserInfo]= useState({});
    const passoword = useRef(null);
    const confirmPassoword = useRef(null);
    const email = useRef(null);
    const fullName = useRef(null);

    const {signup, login, currentUser, changeFormStatus, formStatus} = useAuth();
    const{loginStatus} = useTheme()
    
    const showPassword = (e)=>{
        if(document.getElementById("password").type === "text")document.getElementById("password").type = "password";
        else if(document.getElementById("password").type === "password")document.getElementById("password").type = "text";
        setpasswordShow(!passwordShow);
    }

    const submitSignUpHandler = (e)=>{
        e.preventDefault();
        if(passoword.current.value !== confirmPassoword.current.value){
            setError("Password Do Not Match")
        }else setError(null)

        try {
            signup(email.current.value,passoword.current.value);
        }
        catch(err) {
          console.log(err);
        }
        axios.post("/createUser", {
            email : email.current.value,
            name : fullName.current.value,
            age : 0,
            weight : 0,
            height : 0,
            targetWeight: 0,
            calReq : 0,
            targetCal : 0,
            dailyData : {
                totalCal : 0,
                breakfast : [],
                morningSnack : [],
                lunch : [],
                eveningSnack : [],
                dinner : []
            }
        }).then(res=>{
            console.log(res);
        },err=>{
            console.log(err);
        })
    }
    
    const submitLogInHandler = (e)=>{
        e.preventDefault();
        try {
            login(email.current.value,passoword.current.value);
        }
        catch(err) {
          console.log(err);
        }   
        axios.post("/getUserInfo", {
            email : email.current.value
        }).then(res=>{
            console.log(res);
            if(res.data.age !== 0)changeFormStatus();
        },err=>{
            console.log(err);
        })             
    }
    console.log("formStatus: " + formStatus);
    return ( 
        <div className="mainbody container-fluid">
            {currentUser ? <Redirect to = "/form" />:null}
            <div className="row">
                <div className="col">
                    <h1 className = "h1">Count Those Calories</h1>
                </div>
                <div className="col aye">
                    {!loginStatus?
                        <form onSubmit = {submitSignUpHandler}className = "signUpForm">
                            {error?
                                <div class="alert alert-danger" role="alert">
                                    {error}
                                </div> 
                            :null}
                            <input ref = {fullName}type="text" placeholder = "Your Name"/>
                            <input ref = {email} type="email" placeholder = "Email Address"/>
                            <div className = "aye2">
                                <input type="password" id = "password"ref = {passoword}placeholder = "Password"/>
                                {!passwordShow ? 
                                    <VisibilityOffIcon onClick = {showPassword} id = "visibility-off-icon" />:
                                    <VisibilityIcon onClick = {showPassword} id = "visibility-icon" />
                                }
                                
                            </div>
                            <input type="password" ref= {confirmPassoword}placeholder = "Confirm Password"/>
                            <button className="btn">Sign Up</button>
                        </form>
                    :
                        <form onSubmit = {submitLogInHandler}className = "signUpForm">
                            {error?
                                <div class="alert alert-danger" role="alert">
                                    {error}
                                </div> 
                            :null}
                            <input type="text" style = {{visibility : "hidden"}}/>
                            <input ref = {email} type="email" placeholder = "Email Address"/>
                            <div className = "aye2">
                                <input type="password" id = "password"ref = {passoword}placeholder = "Password"/>
                                {!passwordShow ? 
                                    <VisibilityOffIcon onClick = {showPassword} id = "visibility-off-icon" />:
                                    <VisibilityIcon onClick = {showPassword} id = "visibility-icon" />
                                }
                                
                            </div>
                            <button className="btn">Log In</button>
                            <input type="text" style = {{visibility : "hidden"}}/>
                        </form>
                    }
                </div>
            </div>
        </div>
     );
}
 
export default Mainbody;