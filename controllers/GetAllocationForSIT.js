const router = require("express").Router();
const request = require("request");

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

module.exports = router;
