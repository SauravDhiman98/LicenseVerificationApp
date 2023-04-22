const router = require("express").Router();
const request = require("request");

var bearerToken = '';

// generateToken

router.get('/generatetoken', (req, res) => {
   try{
    var postheaders = {
        "Content-Type": "application/x-www-form-urlencoded",
        //Accept: "application/json",
      };  
    var formData = {
        grant_type:"client_credentials",
        client_id: "0oafupznsnvlWGvC1357",
        client_secret: "lwFyjrFfjQHl0QcaTGmwD6wJ94r9N7F1PJUwpoMl"
    }    

    var optionspost = {
        uri: "https://ssotest.motorolasolutions.com/oauth2/ausf9esr2avJbcQir357/v1/token",
       // path: "/",
        method: "POST",
        form: formData,
        headers: postheaders,
      };
    request(optionspost, (err, response, body) => {
        if (err) {
          console.log(err);
        } else {
          const dt = JSON.parse(response.body);
          bearerToken = dt.access_token;
          res.status(200).json(dt)
        }
    });
   }
   catch(err){
     console.log(err);
     res.status(400).send(err)
   }
})

// getUserDetails

router.post("/getuserdetailsforuat", (req, res) => {
  try {
    console.log(req.body)
    const email = (req.body.email).replace(/\s+/g, '');
    const sfdc_Id = (req.body.sfdc_Id).replace(/\s+/g, '')
    var postheaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Authorization" : "Bearer " + bearerToken
    };
    var optionspost = {
      uri: `https://api-uat.motorolasolutions.com/gw/ecom/c360/prcs/userdetails/v1.0/${email}?app=WOC&sfdc_account_id=${sfdc_Id}`,
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

//  getAccountDetails

router.post("/getaccountdetailsforuat", (req, res) => {
  try {
    var postheaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Authorization" : "Bearer " + bearerToken
    };
    var optionspost = {
      uri: `https://api-uat.motorolasolutions.com/gw/ecom/c360/prcs/getaccountdetails/v1.0/${req.body.sfdc_Id}?app=WOC&sfdc_account_id=${req.body.email}`,
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

// getAllocations

router.post("/getallocationforuat", (req, res) => {
    try {
      const sfdc_Id = (req.body.SfdcAccountId).replace(/\s+/g, '');
      var postheaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Authorization" : "Bearer " + bearerToken
      };
      var optionspost = {
        uri: `https://api-uat.motorolasolutions.com/gw/ecom/c360/prcs/allocatelicense/v1.0?customer_sfdc_account_id=${sfdc_Id}&app=WOC&=`,
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

module.exports = router;