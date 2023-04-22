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

    // 

    useEffect(() => {
        if(dtFromHmpg.state.envType == 'UAT'){
            fetch('http://smplcnsvrftn/generatetoken',{
              method: 'GET'
            })
            .then(val => val.json())
            .then(res => console.log(res))
        }
    },[])

    const headersForCSV = [
        {label: "Parent Login Id", key: "login_id"},
        {label: "Account Name", key: "Parent_account_name"},
        {label: "Email", key: "email"},
        {label: "Language", key: "locale"},
        {label: "Country", key: "country_iso"},
        {label: "Partner Role", key: "role"},
        {label: "Partner SFDC", key: "Parent_sfdc_account_id"},
        {label: "Child Account Name", key: "account_name"},
        {label: "Child Account SFDC", key: "sfdc_account_id"},
        {label:"Child Account Country", key: "country"},
        {label: "Child Relationship", key: "child_relationship_type"},
        {label: "Comment", key: "comment"}
    ]

    var promiseResult;
    const filterDataOnItemNumber = async () => {
 
        if(dtFromHmpg.state.envType == 'SIT'){
        console.timeEnd('for {}')
        console.time('.map()')
         promiseResult =   await Promise.all(
        values?.map(async (val) => {
          console.log()
          await fetch("http://smplcnsvrftn/getuserdetails", {
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
            
            filterDataBsdOnItmNumber(res, val[0], val[1])
            }
            );
        })
        )
        setDataFlag(true)
      }
      else{
        console.time('.map()')
         promiseResult =   await Promise.all(
        values?.map(async (val) => {
          await fetch("http://smplcnsvrftn/getuserdetailsforuat", {
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
                filterDataBsdOnItmNumber(res, val[0], val[1],val[2])
            });
        })
        )
        setDataFlag(true)
      }
      
      };


      const filterDataBsdOnItmNumber = (responseArray, email, parentSfdc, childSfdc) => {
        console.log(responseArray)
        if(responseArray != "The user is not associated with the given SFDC account"){
        responseArray.get_user_and_account_details.map((fd) => {
            const filterParentAccount  = fd?.account?.filter((x) => x.sfdc_account_id == parentSfdc)
            console.log(filterParentAccount)
            filterParentAccount[0]?.child_account_id?.map((val, index) => {
                const dataArray = {
                    login_id: fd.login_id != null ? fd.login_id : "-",
                    email: fd.email != null ? fd.email : "-",
                    locale: fd.locale != null ? fd.locale : "-",
                    country_iso: fd.country_iso,
                    Parent_account_name: fd.account[0].account_name,
                    Parent_sfdc_account_id: fd.account[0].sfdc_account_id,
                    role: fd.app_profile[0].app_profile.role,
                    account_name: val.account_name,
                    sfdc_account_id: val.sfdc_account_id,
                    country: val.country != null ? val.country : "null",
                    child_relationship_type: val.child_relationship_type
                  };
                  setCSVData((prevData) => [...prevData, dataArray]);  
                  
            })
        });
      }
      else
      {
        const dataArray = {
            login_id: email,
            sfdc_account_id: childSfdc,
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
    
    
      return (
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
          {
            getDataFlag ? 
            <button >
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
      );
} 

export default getUserdetails

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;