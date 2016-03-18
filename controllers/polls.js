var express = require('express');
var router = express.Router();
// require model file.
var pollModel = require('../models/polls');

router.route('/')
  .get(function(req,res) {
    var pollObject = new pollModel();
    pollObject.getAllPolls(function(err,pollResponse) {
      if(err) {
        return res.json({"responseCode" : 1, "responseDesc" : pollResponse});
      }
      res.json({
        "responseCode": 200,
        "responseDesc": "All polls",
        "Success": true,
        "data" : pollResponse});
    });
  })
  .post(function(req,res) {
    var pollObject = new pollModel();
    // Calling our model function.
    // We nee to validate our payload here.
    pollObject.addNewPolls(req.body,function(err,pollResponse) {
      if(err) {
        return res.json({"responseCode" : 1, "responseDesc" : pollResponse});
      }
      res.json({"responseCode": 200,
      "responseDesc": "New Poll Added",
      "Success": true,
      "data" : pollResponse});
    });
  })
  .put(function(req,res) {
    // Code to update votes of poll.
   var pollObject = new pollModel();
   // Calling our model function.
   // We need to validate our payload here.
   pollObject.votePollOption(req.body,function(err,pollResponse) {
     if(err) {
       return res.json({"responseCode" : 1, "responseDesc" : pollResponse});
     }
     res.json({"responseCode": 200,
     "responseDesc": "Vote Updated",
     "Success": true,
     "data" : pollResponse});
   });
  });

module.exports = router;
