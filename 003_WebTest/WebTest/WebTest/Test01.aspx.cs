using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Test01 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        for(int i=1;i<=300000;i++)
        {
            Response.Write(i.ToString() + "<br/>");
        }
    }
}