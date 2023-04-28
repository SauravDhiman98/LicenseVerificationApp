import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import { useNavigate } from "react-router-dom";
import img from "../images/bckgrnd.png"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PdfFile from "../Pdf/UserManual.pdf"
import CloseIcon from '@mui/icons-material/Close';
import "../App.css";

const HomePage = () => {

    const navigate = useNavigate()

    const [showAPIs, setAPIs] = useState(false)
    const [isSIT, setIsSIT] = useState(false);
    const [showPopUp, setShowPopUp] = useState(true)
    const [resSetPopUp, setPopup] = useState(null);

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

    useEffect(() => {
      setPopup(true)
      const val = JSON.parse(localStorage.getItem('showPopUp'))
      if(val == null){
        setTimeout(() => {
          setPopup(false)
        },3000) 
        localStorage.setItem("showPopUp", false)
      }
      else{
         setPopup(JSON.parse(localStorage.getItem('showPopUp')))
      }
    },[])

    const closeDialogBox = () => {
      setPopup(false)
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
          {
            resSetPopUp ?
            <OuterContainer1>
            <InnerContainer1>
                <TextContainer>
                    <h4 style={{color: "black"}}>To use application, please go through User Manual Option</h4> 
                    <Btn  href={PdfFile} target="_blank" rel="noreferrer">User Manual</Btn>
                </TextContainer>
                <BtnContainer>
                    <CloseIcon onClick={closeDialogBox} fontSize="large" className="CloseIcon"/>
                </BtnContainer>              
            </InnerContainer1>
           </OuterContainer1>
            :
            <div>
          <InnerContainer>
          <ArrIcon onClick={getBack}><ArrowBackIcon fontSize = "large"/></ArrIcon>
          <PdfLInk href={PdfFile} target="_blank" rel="noreferrer" style={{marginLeft: "1200px"}}>User Manual</PdfLInk>
          </InnerContainer>
           
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
           </div>
          }
        </OuterContainer>
    )
}

const OuterContainer = styled.div`
 display: flex;
 flex-direction: column;
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
:active{
  background-color: rgba(0,0,0,.6);
  transform: translateY(2px);
} 
`

const PdfLInk = styled.a`
 display: flex;
 justify-content: center;
 align-items: center;
 min-width: 120px;
 height: 30px;
 cursor: pointer;
 text-decoration: none;
 margin: 5px;
 background-color: rgba(0,0,0,.9);
 border-radius: 4px;
 border: none;
 color: white;
 font-weight: 600;
:active{
  background-color: rgba(0,0,0,.6);
  transform: translateY(2px);
} 
`
const ArrIcon = styled.div`
color:white;
cursor: pointer;
margin: 20px;
:active{
  transform: translateX(-3px);
}
`

const InnerContainer = styled.div`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
`
const OuterContainer1 = styled.div`
background-color: rgba(0,0,0,.2);
width: 100vw;
height: 100vh;
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
`

const InnerContainer1 = styled.div`
 width: 500px;
 height: 150px;
 background-color: white;
 color: white;
 border-radius: 10px;
 box-shadow: rgba(0,0,0,.5) 5px 3px 5px;
 display: flex;
 flex-direction: row;
`

const TextContainer = styled.div`
 margin-left: 15px;
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: space-evenly;
`

const BtnContainer = styled.div`

`


export default HomePage;