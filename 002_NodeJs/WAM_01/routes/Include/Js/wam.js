const { escapeSelector } = require("jquery");

var WaitAMinute = new Object();

function WAM_GO(o, c)
{
    if(o == undefined)
    {
        alert("없어1");
        return false;
    }
    else
    {
        alert("있어1");
        alert(o.wam_id);
    }

    if(c == undefined)
    {
        alert("없어2");
    else 
    {
        alert("있어2");
        c();
    }
}