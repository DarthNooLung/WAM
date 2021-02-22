var giTotCnt = 0;

function gfnGetTotCnt()
{
    return giTotCnt;
}

function gfnSetTotCnt()
{
    giTotCnt++;
}

module.exports.GetTotCnt = gfnGetTotCnt;
module.exports.SetTotCnt = gfnSetTotCnt;