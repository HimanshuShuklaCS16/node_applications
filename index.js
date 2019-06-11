var rect={
    perimeter:(x,y)=>2*(x+y),
    area:(x,y)=>x*y
}
function solveRect(l,b){
    console.log("solving for are and perimeter of a rectangle with length l="+l+"and breadth b="+b);
    if(l<=00||b<=0)
    console.log("invalid parameters");
    else
    {
        console.log("perimeter is "+rect.perimeter(l,b)+"area is "+rect.area(l,b));
    }
}
solveRect(3,4);
solveRect(4,4);
solveRect(-3,4);
solveRect(0,4);