import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import "../index.css";
import styled from "styled-components";
import { useLoaderData, useLocation } from "react-router-dom";

const allowedExtensions = ["csv"];

function VerifyLicense() {

  const dtFromHmpg = useLocation();


  useEffect(() => {
      if(dtFromHmpg.state.envType == 'UAT'){
          fetch('https://localhost:4500/smplcnsvrftn/generatetoken',{
            method: 'GET'
          })
          .then(val => val.json())
          .then(res => {
            setTokenSpiiner(false)
          })
      }
  },[])


  const [parsedData, setParsedData] = useState([]);


  const [csvData, setCSVData] = useState([]);

  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);

  //Msg for null instances
  const [errMsg, setErrMsg] = useState(false);

  //State to store the values
  const [values, setValues] = useState([]);

  const [getDataFlag, setDataFlag] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false)
  const [tokenSpinner, setTokenSpiiner] = useState(true) 

  const headersForCSV = [
    { label: "Partner Account", key: "partnerAccount" },
    {label: "Parent SFDC Id", key: "partnerSfdc"},
    { label: "Customer Account", key: "customerAccount" },
    {label: "Allocation Type", key: "allocationType"},
    { label: "SFDC Id", key: "sfdcid" },
    {label: "Login Id", key: "loginId"},
    { label: "Item Number", key: "itemnumber" },
    {label: "Offer", key: 'offer'},
    {label: "Package", key: "package"},
    {label: "Allocated Quantity", key: "allocatedQuantity" },
    {label: "Used Quantity", key:"usedQuantity"},
    {label: "Comment", key:"comment"}
  ];

  var promiseResult;

  const filterDataOnItemNumber = async () => {
    setShowSpinner(true)
    if(dtFromHmpg.state.envType == 'SIT'){
    console.timeEnd('for {}')
    console.time('.map()')
     promiseResult =   await Promise.all(
    values?.map(async (val) => {
      console.log()
      await fetch("http://localhost:4500/smplcnsvrftn/getallocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SfdcAccountId: val[0].replace(/\s+/g, ''),
        }),
      })
        .then((val) => val.json())
        .then((res) => {
          if(!res.hasOwnProperty("get_allocations_subscr_for_customer")){
            for(let i = 2; i < val.length; i++){
            if(val[i] != null){
              filterDataBsdOnItmNumber(res, val[i], val[0], val[1]);
            }
          }
        }
        else if(res.get_allocations_subscr_for_customer == null){
          const dataArray = {
            sfdcid: val[0],
            loginId: val[1],
            comment: "Get Allocation is null for this Customer"
          }
            setCSVData((prevData) => [...prevData, dataArray])
        }
        });
    })
    )
    setShowSpinner(false)
    setDataFlag(true)
  }
  else{
    console.time('.map()')
     promiseResult =   await Promise.all(
    values?.map(async (val) => {
      await fetch("http://localhost:4500/smplcnsvrftn/getallocationforuat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SfdcAccountId: val[0].replace(/\s+/g, ''),
        }),
      })
        .then((val) => val.json())
        .then((res) => {
          if(!res.hasOwnProperty('get_allocations_subscr_for_customer')){
            for(let i = 2; i < val.length; i++){
            if(val[i] != null){
              filterDataBsdOnItmNumber(res, val[i], val[0], val[1]);
            }
          }
        }
        else if(res.get_allocations_subscr_for_customer == null){
          const dataArray = {
            sfdcid: val[0],
            loginId: val[1],
            comment: "Get Allocation is null for this Customer"
          }
            setCSVData((prevData) => [...prevData, dataArray])
        }
        });
    })
    )
    setShowSpinner(false)
    setDataFlag(true)
  }
  
  };

  const filterDataBsdOnItmNumber = (responseArray, itmNumber, sfdcid, loginId) => {
    const filterData = responseArray?.filter((x) => x.item_number == itmNumber);
    if(filterData != undefined && filterData.length != 0){
    filterData.map((fd) => {
      const dataArray = {
        partnerAccount: fd.partner_sfdc_account_name != null ? fd.partner_sfdc_account_name : "-",
        partnerSfdc: fd.partner_sfdc_account_id != null ? fd.partner_sfdc_account_id : "-",
        customerAccount: fd.sfdc_account_name != null ? fd.sfdc_account_name : "-",
        accountType: fd.allocation_type,
        sfdcid: fd.sfdc_account_id != null ? fd.sfdc_account_id : "-",
        loginId: loginId,
        itemnumber: fd.item_number != null ? fd.item_number : "-",
        offer: fd.offer != null ? fd.offer : "-",
        package: fd.package != null ? fd.package : "-",
        allocatedQuantity: fd.allocated_qty != null ? fd.allocated_qty : "-",
        usedQuantity: fd.used_qty != null ? fd.used_qty : "-",

      };
      setCSVData((prevData) => [...prevData, dataArray]);
    });
  }
  else if(filterData.length == 0)
  {
    const dataArray = {
      partnerAccount:  "-",
      partnerSfdc:  "-",
      customerAccount: "-",
      allocationType:  "-" ,
      sfdcid: sfdcid,
      loginId: loginId,
      itemnumber: "-",
      offer: "-",
      package: "-",
      allocatedQuantity:  "-",
      usedQuantity: "-",
       comment: `No allocations are there for ${itmNumber}`,
       itemnumber: itmNumber
    }
    console.log(dataArray)
    setCSVData((prevData) => [...prevData, dataArray])
  } 
  }





  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });

        // Parsed Data Response in array format
        setParsedData(results.data);

        // Filtered Column Names
        setTableRows(rowsArray[0]);

        // Filtered Values
        setValues(valuesArray);
      },
    });
  };


  return (<>
    {
      dtFromHmpg.state.envType == "UAT" ? tokenSpinner  ?
      <OuterContainer1>
        <span className="tokenLoader"></span>
      </OuterContainer1>  
      : 
      <OuterContainer>
    <h2>Environment: {dtFromHmpg.state.envType}</h2>
    File Uploader
    <input
      type="file"
      name="file"
      onChange={changeHandler}
      onClick={() => setDataFlag(false)}
      accept=".csv"
      style={{ display: "block", margin: "10px auto" }}
    />
    <br />
    <br />
    <table>
      <thead>
        <tr>
          {tableRows.map((rows, index) => {
            return <th key={index}>{rows}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {values.map((value, index) => {
          return (
            <tr key={index}>
              {value.map((val, i) => {
                return <td key={i}>{val}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
    <button
      disabled={values.length == 0}
      onClick={() => filterDataOnItemNumber()}
    >
      Click Here
    </button>
    
      { showSpinner ? <span class="loader"></span> : getDataFlag ?
      <button style={{marginTop: "20px"}} >
      <CSVLink
        
       style={{ textDecoration: "none", visibility: csvData.length == 0 ? "hidden" : "visible"}}
        data={csvData}
        headers={headersForCSV}
      >
        Download CSV
      </CSVLink>
    </button> 
    :
    null
      
      }
    

    {
      errMsg ? <h5>There are no subscriptions for given SFDC Ids with given item numbers</h5> : null
    }
    </OuterContainer>
    :
    <OuterContainer>
    <h2>Environment: {dtFromHmpg.state.envType}</h2>
    File Uploader
    <input
      type="file"
      name="file"
      onChange={changeHandler}
      onClick={() => setDataFlag(false)}
      accept=".csv"
      style={{ display: "block", margin: "10px auto" }}
    />
    <br />
    <br />
    <table>
      <thead>
        <tr>
          {tableRows.map((rows, index) => {
            return <th key={index}>{rows}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {values.map((value, index) => {
          return (
            <tr key={index}>
              {value.map((val, i) => {
                return <td key={i}>{val}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
    <button
      disabled={values.length == 0}
      onClick={() => filterDataOnItemNumber()}
    >
      Click Here
    </button>
    
      { showSpinner ? <span class="loader"></span> : getDataFlag ?
      <button style={{marginTop: "20px"}} >
      <CSVLink
        
       style={{ textDecoration: "none", visibility: csvData.length == 0 ? "hidden" : "visible"}}
        data={csvData}
        headers={headersForCSV}
      >
        Download CSV
      </CSVLink>
    </button> 
    :
    null
      
      }
    

    {
      errMsg ? <h5>There are no subscriptions for given SFDC Ids with given item numbers</h5> : null
    }
    </OuterContainer>
  }
  </>
);
}

export default VerifyLicense;

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const OuterContainer1 = styled.div`
background-color: white;
width: 100vw;
height: 100vh;
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
`