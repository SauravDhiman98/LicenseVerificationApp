import React, {useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import { CSVLink } from "react-csv";
import "../index.css";
import styled from "styled-components";
import Papa from "papaparse"; 


function getUserdetails(){

    const dtFromHmpg = useLocation();

    const envType = useLocation();

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

    // 

    useEffect(() => {
        if(dtFromHmpg.state.envType == 'UAT'){
            fetch('http://localhost:4500/smplcnsvrftn/generatetoken',{
              method: 'GET'
            })
            .then(res => res.json())
            .then(val => {
              setTokenSpiiner(false)
            })    
        }
    },[])

    const headersForCSV = [
        {label: "Account Name", key: "account_name"},
        {label: "Email", key: "email"},
        {label: "Account SFDC", key: "sfdc_account_id"},
        {label: "Country", key: "country_iso"},
        {label: "Market Type", key: "market_type"},
        {label: "Partner SFDC", key: "Parent_sfdc_account_id"},
        {label: "Parent Account Name", key: "Parent_account_name"},
        {label:"Parent Account Country", key: "country"},
        {label: "Parent Relationship", key: "parent_relationship_type"},
        {label: "Comment", key: "comment"}
    ]

    var promiseResult;
    const filterDataOnItemNumber = async () => {

        setShowSpinner(true)
        if(dtFromHmpg.state.envType == 'SIT'){
        console.timeEnd('for {}')
        console.time('.map()')
         promiseResult =   await Promise.all(
        values?.map(async (val) => {
          console.log()
          await fetch("http://localhost:4500/smplcnsvrftn/getaccountdetails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sfdc_Id: val[1].replace(/\s+/g, ''),
                email: val[0].replace(/\s+/g, '')
            }),
          })
            .then((val) => val.json())
            .then((res) => {
            console.log(res)
          filterDataBsdOnItmNumber(res, val[0], val[1])
            }
            );
        })
        )
        setShowSpinner(false)
        setDataFlag(true)

      }
      else{
        console.time('.map()')
         promiseResult =   await Promise.all(
        values?.map(async (val) => {
          await fetch("http://localhost:4500/smplcnsvrftn/getaccountdetailsforuat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sfdc_Id: val[1].replace(/\s+/g, ''),
                email: val[0].replace(/\s+/g, '')   
            }),
          })
            .then((val) => val.json())
            .then((res) => {
                console.log(res)
                filterDataBsdOnItmNumber(res, val[0], val[1],)
            });
        })
        )
        setShowSpinner(false)
        setDataFlag(true)
      }
      
      };


      const filterDataBsdOnItmNumber = (responseArray, email, Sfdc) => {
        console.log(responseArray)
        if(responseArray != "The user is not associated with the given SFDC account"){
        responseArray.account_details.map((fd) => {
            if(fd.parent_account_id.lenth != 0){
                console.log(fd)
            fd?.parent_account_id?.map((val, index) => {
                const dataArray = {
                    account_name: fd.account_name != null ? fd.account_name : "-",
                    email: email,
                    sfdc_account_id: fd.sfdc_account_id,
                    country_iso: fd.country,
                    market_type: fd.market_type,
                    Parent_account_name: val.account_name,
                    Parent_sfdc_account_id: val.sfdc_account_id,
                    country: val.country != null ? val.country : "null",
                    parent_relationship_type: val.parent_relationship_type
                  };
                  setCSVData((prevData) => [...prevData, dataArray]);  
                  
            })
        }
        });
      }
      else
      {
        const dataArray = {
            login_id: email,
            sfdc_account_id: Sfdc,
            comment: responseArray
        }
        console.log(dataArray)
        setCSVData((prevData) => [...prevData, dataArray])
      } 
      }

      console.log(csvData)
      




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

export default getUserdetails

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