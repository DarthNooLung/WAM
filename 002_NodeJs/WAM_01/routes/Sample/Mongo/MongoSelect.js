const express = require('express');
const router = express.Router();
const User = require("./User");


router.get('/', (req, res) => {
    User.find({Age:37})
    .then(Data => {
        //console.log(Data.length);
        for(var i = 0; i < Data.length; i++)
        {
            console.log(Data[i].UserId);

            if(i == 0){
                Data[i].UserId = "테스트입니다.";
            }
        }
        res.status(200).json({ActionList: Data});
    })
    .catch(err => {
        res.status(500).json({
            message: err
        });
    });
});

module.exports = router;