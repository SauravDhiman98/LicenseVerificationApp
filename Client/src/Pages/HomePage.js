import React, { useState } from "react";
import styled from 'styled-components'
import { useNavigate } from "react-router-dom";
import img from "../images/bckgrnd.png"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const HomePage = () => {

    const navigate = useNavigate()

    const [showAPIs, setAPIs] = useState(false)
    const [isSIT, setIsSIT] = useState(false);

    const handleNavigation = (envType) => {
          if(envType){
            setIsSIT(true)
            setAPIs(true)          
          } 
          else{ 
            setIsSIT(false)
            setAPIs(true)
          }
    }


    const getallocation = () => {
      if(isSIT){
        navigate("/verifylicense",{state: {envType: "SIT"}})  
      }
      else{
        navigate("/verifylicense",{state: {envType: "UAT"}}) 
      }
    }

    const getUserDetails = () => {
      if(isSIT){
        navigate("/getuserdetail",{state: {envType: "SIT"}})  
      }
      else{
        navigate("/getuserdetail",{state: {envType: "UAT"}}) 
      } 
    }

    const getAccountDetails = () => {
      if(isSIT){
        navigate("/getaccountdetails",{state: {envType: "SIT"}})  
      }
      else{
        navigate("/getaccountdetails",{state: {envType: "UAT"}}) 
      } 
    }
    const getBack = () => {
      if(showAPIs){
        setAPIs(false)
      }
    }
    return (
        <OuterContainer>
          <ArrIcon onClick={getBack}><ArrowBackIcon fontSize = "large"/></ArrIcon>
           
           {
             showAPIs ? <div style={{margin: "100px"}}>
              <h2 style={{color:"white", width: "400px"}}>Choose API for <div style={{display: "inline"}}>{isSIT ? <div style={{display: "inline"}}>SIT</div> : <div style={{display: "inline"}}>UAT</div>}</div> to Perform Bulk Operation</h2>
              <Btn onClick={getUserDetails}>GetUserDetails</Btn>
              <Btn onClick={getAccountDetails}>GetAccount</Btn>
              <Btn onClick={getallocation}>GetAllocation</Btn>
             </div> :  
            <div style={{margin: "100px"}}>
            <h2 style={{color:"white"}}>Choose the Environment</h2>
            <Btn onClick={() => handleNavigation(true)}>SIT</Btn>
            <Btn onClick={() => handleNavigation(false)}>UAT</Btn>
            </div>
           } 
        </OuterContainer>
    )
}

const OuterContainer = styled.div`
 display: flex;
 flex-direction: column;
 /* justify-content: center; */
 height: 100vh;
 width: 100vw;
 align-items: flex-start;
 background-image: url(${img});
 background-size: contain;
 background-repeat: no-repeat;
`

const Btn = styled.button`
 min-width: 100px;
 height: 30px;
 cursor: pointer;
 margin: 5px;
 background-color: rgba(0,0,0,.9);
 border-radius: 4px;
 border: none;
 color: white;
 font-weight: 600;

 
`
const ArrIcon = styled.div`
color:white;
cursor: pointer;
margin: 20px
`

export default HomePage;