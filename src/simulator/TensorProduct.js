class qobject
{
	constructor(r,c)
    {
    	this.rows = r;
        this.cols = c;
        this.con= [];
    }
}

function tensor()
{
	 var i;
     res = arguments[0];
     for (i = 1; i < arguments.length; i++) 
     {
     	res = inner_tensor(res,arguments[i]);
     	
     }
     return res;

}

function inner_tensor(t1,t2)
{ 
    var row = t1.rows * t2.rows;
    var col = t1.cols * t2.cols;
	var result = new qobject(row,col);
    var i,j;
    for (i=0;i<row;i++)
    {
    	result.con[i]=[];
    }
    for(i=0;i<row;i++)
    {
    	for(j=0;j<col;j++)
        {
        	result.con[i][j] = t1.con[Math.floor(i/t2.rows)][Math.floor(j/t2.cols)] * t2.con[i%t2.rows][j%t2.cols];
            
        }
    }
    return result;
}