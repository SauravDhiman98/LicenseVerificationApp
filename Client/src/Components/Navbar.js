import React from "react";
import styled from "styled-components";
import logo from "../images/logo.png"
import PdfFile from "../Pdf/UserManual.pdf"

export default function navbar(props){

    return(
        <TextContainer>
             <ImageContainer></ImageContainer>
             <div>{props.envType} : {props.apiName}</div>
             <Btn  href={PdfFile} target="_blank" rel="noreferrer">User Manual</Btn>
        </TextContainer>
    )
}

const TextContainer = styled.h2`
 margin-top: 0%;
 width: 100vw;
 height: 70px;
 background-color: #262626;
 color: white;
 display: flex;
 justify-content: space-between;
 align-items: center;
`

const Btn = styled.button`
margin-right: 30px;
 min-width: 100px;
 height: 30px;
 cursor: pointer;
 background-color: #e7e7e7;
 border-radius: 4px;
 border: none;
 color: black;
 font-weight: 600;
:active{
  background-color: rgba(0,0,0,.6);
  transform: translateY(2px);
} 
`
const ImageContainer = styled.div`
 margin-left: 30px;
 background-image: url(${logo});
 background-size: contain;
 background-repeat: no-repeat;
 height: 40px;
 width: 45px;
`