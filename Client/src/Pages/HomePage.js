import React from "react";
import styled from 'styled-components'
import { useNavigate } from "react-router-dom";


const HomePage = () => {

    const navigate = useNavigate()

    const handleNavigation = (envType) => {
          if(envType){
            navigate("/verifylicense",{state: {envType: "SIT"}})            
          } 
          else{
            navigate("/verifylicense",{state: {envType: "UAT"}})  
          }
    }
    return (
        <OuterContainer>
            <h2>Choose the Environment</h2>
            <Btn onClick={() => handleNavigation(true)}>SIT</Btn>
            <Btn onClick={() => handleNavigation(false)}>UAT</Btn>
        </OuterContainer>
    )
}

const OuterContainer = styled.div`
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
`

const Btn = styled.button`
 width: 100px;
 height: 30px;
 cursor: pointer;
 margin: 5px;
`

export default HomePage;