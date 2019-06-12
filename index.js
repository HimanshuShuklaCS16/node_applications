var rect=require('./rectangle.js');
function solveRect(l,b){
    console.log("solving for are and perimeter of a rectangle with length l="+l+"and breadth b="+b);
    rect(l,b,(err,rectangle) => {
        if(err)
        console.log("ERROR: "+err.message);
        else
        {
        console.log("the area of the rectangle with dimensions l= "+l+"b= "+b+" is "+rectangle.area());
        console.log("the perimeter of the rectangle with dimensions l= "+l+"b= "+b+" is "+rectangle.perimeter());
        }
    });
    console.log("this part is executed before the above calculation");
};
solveRect(3,4);
solveRect(4,4);
solveRect(-3,4);
solveRect(0,4);