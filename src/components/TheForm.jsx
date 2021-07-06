import React, { useState, useEffect, useRef } from 'react';
import Navbar from "./Navbar"
import axios from "../axios";
import {useTheme} from "../contexts/ThemeContext";
import {useAuth} from "../contexts/AuthContext"
import "../styles/theForm.css";
import $ from "jquery";
import { Redirect } from 'react-router-dom';

const TheForm = () => {
    const {currentTheme, updateTheme} = useTheme();
    const  {currentUser, formStatus} = useAuth();
    const [othermode, setotherMode] = useState("Dark");
    const [heightUnitToggle, setHeightUnitToggle] = useState(true);
    const [weightUnitToggle, setWeightUnitToggle] = useState(true);
    const [BMI, setBMI] = useState(0);
    const [male, setMale] = useState(null);
    const [weight, setweight] = useState(0);
    const [feet, setfeet] = useState(0);
    const [inches, setinches] = useState(0);
    const weightRef = useRef()
    const [weightTarget, setweightTarget] = useState(0);
    const [height, setheight] = useState(0);
    const [age, setage] = useState(0);
    const [BMR, setBMR] = useState(0);
    const [weightStatus, setWeightStatus] = useState("");
    const [idealWeight, setidealWeight] = useState(0);
    const [maintainenceCal, setmaintainenceCal] = useState(0);
    const [reqmaintainenceCal, setreqmaintainenceCal] = useState(0)
    const [error, setError] = useState("");
    const [userInfo, setUserInfo]= useState();
    const [nextButton, setNextButton] = useState(false);
    const [submitClicked, setSubmitClicked] = useState(false);
    
    const clickedButtonStyle = {
        color : "#05386b",
        backgroundColor : '#5cdb95'
    }
    
    useEffect(() => {
        if(currentUser){
            axios.post("/getUserHealthInfo", {
                email : currentUser.email
            }).then(res=>{
                setUserInfo(res.data)
            },err=>{
                console.log(err);
            })
        }
    }, []);

    const changeInchesToCm = (feet, inches)=>{
        var totalInches = parseInt(inches) + (12*feet);
        var heightValue = 2.54*totalInches;
        return heightValue;
    }

    const mifflinSteor = ()=>{
        var heightValue = 0;
        if(!heightUnitToggle)heightValue = changeInchesToCm(feet, inches)
        else heightValue = height;
        if(male){
            setBMR((10*weight) + (6.25*heightValue) - (5*age) + 5)
        }else{  
            setBMR((10*weight) + (6.25*heightValue) - (5*age) - 165)
        }
    }
    const harrisBenedict = ()=>{
        var heightValue = 0;
        if(!heightUnitToggle)heightValue = changeInchesToCm(feet, inches)
        else heightValue = height;
        if(male){
            setBMR(((13.397*weight) + (4.799*heightValue) - (5.677*age) + 88.362).toFixed(0))
        }else{  
            setBMR(((9.247*weight) + (3.098*heightValue) - (4.330*age) + 447.593).toFixed(0))
        }
    }
    const onChangeHandler = (e)=>{
        if(e.target.id == "age")setage(e.target.value);
        else if(e.target.id == "weight")setweight(e.target.value);
        else if(e.target.id == "height")setheight(e.target.value);
        else if(e.target.id == "feet")setfeet(e.target.value);
        else if(e.target.id == "inches")setinches(e.target.value);
        else if(e.target.id == "target-weight")setweightTarget(e.target.value);
        // console.log(e.target.id);
    }
    useEffect(() => {
        axios.post("/getUserHealthInfo", {
            email : currentUser.email,
            theme : currentTheme
        }).then(res=>{
            //updateTheme(res.data.mode);
        },err=>{
            console.log(err);
        })
    }, []);
    const modeChange = ()=>{
        if(currentTheme === "dark"){
            setotherMode("Dark");
            updateTheme("light");
            axios.post("/changeTheme", {
                email : currentUser.email,
                theme : "light"
            }).then(res=>{
            },err=>{
                console.log(err);
            })
        }
        else if(currentTheme === "light"){
            setotherMode("Light");
            updateTheme("dark");
            axios.post("/changeTheme", {
                email : currentUser.email,
                theme : "dark"
            }).then(res=>{
            },err=>{
                console.log(err);
            })
        }
    }
    useEffect(() => {
        var theArray = $('.formboy').serialize().split("&");
        
        if(theArray[0].split("=")[1] === "0")setmaintainenceCal(1.2*BMR);
        else if(theArray[0].split("=")[1] === "1")setmaintainenceCal(1.37*BMR);
        else if(theArray[0].split("=")[1] === "2")setmaintainenceCal(1.46*BMR);
        else if(theArray[0].split("=")[1] === "3")setmaintainenceCal(1.55*BMR);
    },[BMR, maintainenceCal]);

    const submitHandler2 = ()=>{
     
        if(weight !== 0 && height !== 0 && age !== 0){
            var theArray = $('.formboy').serialize().split("&");
            if(theArray[1].split("=")[1] === "1")harrisBenedict();
            else if(theArray[1].split("=")[1] === "0")mifflinSteor();
            console.log(theArray);
            if(theArray[0].split("=")[1] === "0")setmaintainenceCal(1.2*BMR);
            else if(theArray[0].split("=")[1] === "1")setmaintainenceCal(1.37*BMR);
            else if(theArray[0].split("=")[1] === "2")setmaintainenceCal(1.46*BMR);
            else if(theArray[0].split("=")[1] === "3")setmaintainenceCal(1.55*BMR);
        }else{
            if(weight === 0)setError("Enter Your Weight");
            else if(height === 0 ||( inches === 0 && feet === 0))setError("Enter Your Height");
            else if(age === 0)setError("Enter Your Age");
        }
        setSubmitClicked(true);
        
    }
    const nextButtonHandler = ()=>{
        if(weightTarget > weight && maintainenceCal !== 0){
            var sex = "";
            if(male)sex = "Male";
            else if (!male) sex = "Female"
            axios.post("/updateUser", {
                email : currentUser.email,
                sex : sex,
                age : age,
                weight : weight,
                height : height,
                targetWeight : weightTarget,
                calReq : maintainenceCal.toFixed(1),
                targetCal : (maintainenceCal*109/100).toFixed(1)
            }).then((res)=>console.log(res),
                    err=>{if(err)console.log(err);})
        }else if(weightTarget <= weight && maintainenceCal !== 0){
            var sex = "";
            if(male)sex = "Male";
            else if (!male) sex = "Female"
            axios.post("/updateUser", {
                email : currentUser.email,
                sex : sex,
                age : age,
                weight : weight,
                height : height,
                targetWeight : weightTarget,
                calReq : maintainenceCal.toFixed(1),
                targetCal : (maintainenceCal*91/100).toFixed(1)
            }).then((res)=>console.log(res),
                    err=>{if(err)console.log(err);})
        }
       
        console.log(reqmaintainenceCal);
        setNextButton(true);

    }
    const submitHandler1 = ()=>{
        var heightValue = 0;
        if(!heightUnitToggle)heightValue = changeInchesToCm(feet, inches)
        else heightValue = height;

        heightValue = heightValue / 100;
        
        setBMI((weightRef.current.value / Math.pow(heightValue,2)).toFixed(1)); 
        const currentBmi = (weightRef.current.value / Math.pow(heightValue,2)).toFixed(1);
        if(currentBmi < 18.5)setWeightStatus("Underweight")
        else if(currentBmi >= 18.5 && currentBmi <24.9)setWeightStatus("Normal Weight")
        else if(currentBmi>= 24.9 && currentBmi < 29.9)setWeightStatus("Overweight")
        else if(currentBmi>=  29.9)setWeightStatus("Obese")

        var hegihtInInches = heightValue*39.37;
        hegihtInInches = hegihtInInches - 60;

        if(male && hegihtInInches > 0)setidealWeight((52 + (1.9*hegihtInInches)).toFixed(0))
        else if(!male && hegihtInInches > 0)setidealWeight((49 + (1.7*hegihtInInches)).toFixed(0))
    }
    
    // console.log("formStatus: " + formStatus);
    return ( 
        <div className = {"the-form dashboard-"+currentTheme}>
            <Navbar modeChange = {modeChange} mode = {othermode}/>
            <div className={"row the-form-content the-form-"+currentTheme}>
                <div className="col col-lg-6 col-sm-12 infoTab1">
                    {error ? 
                    <div class="alert alert-danger" role="alert">
                        {error}
                    </div>
                    :null}
                    <div className="sex">
                        <button onClick = {()=>setMale(true)} id = "malebutton" className = {male? "btn clicked-button":"btn"}>Male</button>
                        <button onClick = {()=>setMale(false)} id = "femalebutton"className = {male === false? "btn clicked-button":"btn"}>Female</button>
                    </div>
                    <div className="age">
                        <p>Age: </p>
                        <input placeholder = "Age..."autoComplete = "off" id = "age"onChange = {onChangeHandler}type="number" min = "0"/>
                        <span id = "years"className = "units">Years</span>
                    </div>
                    <div className="age">
                        <p>Height: </p>
                        {heightUnitToggle?
                        <input autoComplete = "off" placeholder = "Height..."id = "height" onChange = {onChangeHandler} type="number" min = "0" />:
                        <div className = "ftnIn-class">
                            <input placeholder = "Feet..."autoComplete = "off" onChange = {onChangeHandler} className = "ftnIn" id = "feet"onChange = {onChangeHandler} type="number" min = "0" /><span className = "feetColon">'</span>
                            <input placeholder = "Inches..." autoComplete = "off" onChange = {onChangeHandler} className = "ftnIn"id = "inches"onChange = {onChangeHandler} type="number" min = "0" /><span className = "feetColon">"</span>
                        </div>
                        }
                        <span onClick = {()=>setHeightUnitToggle(!heightUnitToggle)} className = "units">{heightUnitToggle?"CM":"Ft/In"}</span>
                    </div>
                    <div className="age">
                        <p>Weight: </p>
                        <input placeholder = "Weight..." autoComplete = "off" id = "weight" ref = {weightRef} onChange = {onChangeHandler} type="number" min = "0" />
                        <span onClick = {()=>setWeightUnitToggle(!weightUnitToggle)}  className = "units">{weightUnitToggle?"Kg":"Pd"}</span>
                    </div>
                    <button onClick = {submitHandler1} className ="btn submit-button">Submit</button>
                </div>
                <div className="col col-lg-6 col-sm-12 BMICol">
                    {/* <BMICol BMI = {BMI} height = {height}  weight= {weight} age= {age} male = {male}/> */}
                    {BMI !== 0 && idealWeight!== 0 &&
                    <div className="BMI-class row">
                        <div className="col" style = {{textAlign : "center"}}>
                            <h5 id = "ur-bmi-text">Your BMI: {BMI}</h5>
                            <h4 className = "0" style = {{fontWeight : "650"}}>{weightStatus}</h4>
                        </div>
                        <div className="col" style = {{textAlign : "center"}}>
                            <h5 id = "ideal-weight">Ideal Weight Range</h5>
                            <h4 className = "weight-status-and-ideal-weight" style = {{fontWeight : "650"}}>{idealWeight-5}-{parseInt(idealWeight)+5}Kg</h4>
                        </div>
                    </div>}
                    <div class="form-group BMI-class">
                        <p for="exampleFormControlSelect1">Activity: </p>
                        {/* <form> */}
                            <select name = "activity-form" class="form-control formboy" id="exampleFormControlSelect1">
                                <option value = "0">Little or No exercise</option>
                                <option value = "1">Light: Excerise 1-3 time a week</option>
                                <option value = "2">Moderate: Exercise 4-5 times a week</option>
                                <option value = "3">Active: Daily Exercise or Intense workout 3-4 times a week</option>
                            </select>
                        {/* </form> */}
                    </div>
                    <form  className="checkbox  BMI-class formboy">
                            <p>BMR estimation formula:</p>
                           <label className="form-check">Mifflin-St Jeor (default)
                                <input type="radio" name="formula" value="0" checked/>
                                <span className="checkmark"></span>
                            </label>
                            <label id = "secondCheckbox"className="form-check">Harris-Benedict
                                <input type="radio"  name="formula" value="1" />
                                <span className="checkmark"></span>
                            </label>
                    </form>
                    <div className="BMI-class">
                        <p>Weight Target: </p>
                        <input placeholder = "Target Weight..." autoComplete = "off" min = "0" id = "target-weight"onChange = {onChangeHandler} type="number" min = "0" />
                        <span onClick = {()=>setWeightUnitToggle(!weightUnitToggle)}  className = "units">{weightUnitToggle?"Kg":"Pd"}</span>
                    </div>
                   
                </div>
            </div>
            <div style = {{display : "block" ,textAlign : "center"}}>
                <button  onClick = {submitHandler2}className ="next-skip-button btn">Submit</button>
                {/* <button  onClick = {skipHandler} className ="next-skip-button btn">Skip</button> */}
                {nextButton? <Redirect to = "/dashboard"/>:null}
                </div>
            
            {BMR === 0? null : <div style = {{textAlign : "center"}}>
                <p style = {{marginBottom : "0"}}>You need</p>
                <h3 style = {{fontWeight : "600"}}>{maintainenceCal.toFixed(1)} Calories/Day</h3>
                <p style = {{marginBottom : "0"}}>To maintain your Weight</p>
                </div>
            }
                {submitClicked?
                    <div style = {{display : "block" ,textAlign : "center", marginTop : "15px"}}>
                        <button  onClick = {nextButtonHandler} className ="next-skip-button btn">Next</button>
                    </div> :null
                }
                
        </div>
     );
}
 
export default React.memo(TheForm);
