const router = require("express").Router();
const request = require("request");


// getAllocation API

router.post("/getallocation", (req, res) => {
  try {
    const sfdc_Id = (req.body.SfdcAccountId).replace(/\s+/g, '');
    var postheaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    var optionspost = {
      uri: `https://api-dev.motorolasolutions.com/gw/ecom/c360qa/prcs/allocatelicense/v1.0?app=WOC&customer_sfdc_account_id=${sfdc_Id}`,
      path: "/",
      method: "GET",
      headers: postheaders,
    };
    request(optionspost, (err, response, body) => {
      if (err) {
        console.log(err);
      } else {
        const dt = JSON.parse(response.body);
        res.status(200).json(dt)
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});


// getUserDetails

router.post("/getuserdetails", (req, res) => {
  try{
    console.log(req.body)
    const sfdc_Id = (req.body.sfdc_Id).toString()
    const emailOfPartner = (req.body.email).toString()
    var postheaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    var optionspost = {
      uri: `https://api-dev.motorolasolutions.com/gw/ecom/c360qa/prcs/userdetails/v1.0/${req.body.email}?app=WOC&sfdc_account_id=${req.body.sfdc_Id}`,
      path: "/",
      method: "GET",
      headers: postheaders,
    };
    request(optionspost, (err, response, body) => {
      if (err) {
        console.log(err);
      } else {
        console.log(response)
        const dt = JSON.parse(response.body);
        res.status(200).json(dt)
      }
    });

  }
  catch(err){
    console.log(err)
    res.status(409).send(err)
  }
})


// getAccountDetails

router.post("/getaccountdetails", (req, res) => {
  try{
    var postheaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    var optionspost = {
      uri: `https://api-dev.motorolasolutions.com/gw/ecom/c360qa/prcs/getaccountdetails/v1.0/${req.body.sfdc_Id}?app=WOC&sfdc_account_id=${req.body.email}`,
      path: "/",
      method: "GET",
      headers: postheaders,
    };
    request(optionspost, (err, response, body) => {
      if (err) {
        console.log(err);
      } else {
        
        const dt = JSON.parse(body);
        res.status(200).json(dt)
      }
    });

  }
  catch(err){
    console.log(err)
    res.status(409).send(err)
  }
})

module.exports = router;
