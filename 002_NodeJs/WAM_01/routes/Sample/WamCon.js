const express = require('express');
const router = express.Router();
const fs = require('fs');
const pathStorage = __dirname;

router.get('/', (req, res) => {    
    var strUseFilePath = pathStorage + "\\WamCon.html";
    fs.readFile(strUseFilePath, function(error, data) {
        if(error) {
            console.log(error);
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); 
            res.end(data);
        }
    });    
});
module.exports = router;