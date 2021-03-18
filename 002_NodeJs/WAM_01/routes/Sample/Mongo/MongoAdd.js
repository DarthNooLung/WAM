const express = require('express');
const router = express.Router();
const User = require("./User");

router.get('/', (req, res) => {
    User.create({
        UserId: "1170120",
        UserName: "황기현",
        Age: 15,
        Married: false
    });
    console.log(User);
    res.send("");
});

module.exports = router;