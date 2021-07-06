import React, { useState, useEffect,useWindowSize } from 'react';
import Navbar from "./Navbar"
import {useTheme} from "../contexts/ThemeContext";
import FoodSearch from "./FoodSearch"
import DailyEventCol from "./DailyEventCol";
import "../styles/mainplatform.css"
import axios from "../axios"
import {useAuth} from "../contexts/AuthContext"
import Info from "./Info";
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';

const Mainplatform = () => {

    const {currentEvent, currentUser,breakfastCal,morningSCal,lunchCal,eveSCal,dinnerCal,contentAdd,setEvent,currentEvent2,foodAddedHandler,foodAdded,totalDailyCal,changeTotalDailyCal, currentDate} = useAuth();
    const [othermode, setotherMode] = useState("Dark");
    const [reqCal, setReqCal] = useState(2210);
    const [info, setInfo] = useState(false);
    const [percentageCal, setpercentageCal] = useState(0);
    const {currentTheme, updateTheme} = useTheme();
    const [userInfo, setUserInfo] = useState();
    const [tatalCaloriess, setTatalCaloriess] = useState(0);

    useEffect(() => {
        var totalCalories2 = breakfastCal+morningSCal+lunchCal+eveSCal+dinnerCal;
        setTatalCaloriess(totalCalories2);
    }, [breakfastCal,morningSCal,lunchCal,eveSCal,dinnerCal]);
   
    function useWindowSize() {
        const [windowSize, setWindowSize] = useState({
          width: undefined,
          height: undefined,
        });
      
        useEffect(() => {
          function handleResize() {
            setWindowSize({
              width: window.innerWidth,
              height: window.innerHeight,
            });
          }
          window.addEventListener("resize", handleResize);
          handleResize();
          return () => window.removeEventListener("resize", handleResize);
        }, []);
        return windowSize;
      }

    const size = useWindowSize().width; 

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
        if(currentUser){
            axios.post("/getUserInfo", {
                email : currentUser.email,
                date : currentDate
            }).then(res=>{
                setUserInfo(res.data);
                changeTotalDailyCal(res.data.totalCal);
            },err=>{
                console.log(err);
            })
        }

    }, [currentDate, currentUser]);
   const infoHandler = ()=>{
        setInfo(!info);
   }
    useEffect(() => {
        if((tatalCaloriess/reqCal)*100 > 95)setpercentageCal(96.5);
        else setpercentageCal((tatalCaloriess/reqCal)*100);
    }, [tatalCaloriess]);
    return ( 
        <div className={"mainplatform dashboard-"+currentTheme}>
            <Navbar modeChange = {modeChange} mode = {othermode}/>
            <div className={" mainplatform_row row mainplatform-"+currentTheme}>
                 
                <div className="daily_events_col col col-12 col-sm-12 col-md-12 col-lg-6  col-xl-6">
                    <DailyEventCol infoHandler = {infoHandler}  reqCal = {reqCal} eatenCal = {Math.round(totalDailyCal * 100) / 100} percentageCal = {percentageCal}/>
                </div>
                {size > 1192 ?
                <div className="food_search col col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    {info? <Info theme = {currentTheme} />: <FoodSearch />}
                </div>
                :null}
            </div>
            <div className="footar">
                <p className = "footer_created_by" >Created By Vivekanand Mogali</p>
                <div className="social_media_icons">
                    <a href="https://www.linkedin.com/in/vivekanand-mogali-389226191/"><div className="social_media_icon"><LinkedInIcon style={{ fontSize: 40 }} /></div></a>
                    <a href="https://github.com/aadi2305"><div className="social_media_icon"><GitHubIcon style={{ fontSize: 36, marginLeft : "20px" }} /></div></a>
                    <a href="https://www.fiverr.com/share/2AD4jr" style = {{display : "flex", alignItems : "center", textDecoration : "none"}}><div className="fiverrr">fiverr</div></a>
                
                </div>

            </div>
        </div>
     );
}
 
export default Mainplatform;
