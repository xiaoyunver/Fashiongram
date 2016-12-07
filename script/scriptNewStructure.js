
// window.onresize = function(
// ){ location.reload(); }
//


var margin = {t:50,l:50,b:50,r:50},
    width = document.getElementById('map').clientWidth-margin.l-margin.r,
    height = document.getElementById('map').clientHeight-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b);

var projection = d3.geo.equirectangular()
    .scale(180)
    .translate([width / 2, height / 2])
    .precision(.1);

var mediaData;
var userID;
var globalRadius = false;

// initialization parameters
var initFulldata;
var initState = false;
var initFunction;




// Hide result box when click
d3.select("body")
    .on("click",function(){

        d3.select("#resultBox")
            .classed("hidden",true);

    });

 // d3.select("#loading").style("display","none");
  initState=true;

function hideCountBox(){
            // Hide count box when click
    
            var tooltipAndContent = d3.selectAll("#countBox, #countBox *");
            function equalToEventTarget(){
                return this == d3.event.target;
            }
            var outside = tooltipAndContent.filter(equalToEventTarget).empty();
            if(outside){
                d3.select("#countBox").classed("hidden","true");
            }
                 
}

  d3.select("body").on("click.count",hideCountBox);
//  d3.select("body").on("click.count",null);

d3.select("#selectAll")
    .on("click",function(){
        var menu = document.getElementById("chooseMenu").getElementsByTagName("a");
        for(var i=0;i<menu.length;i++){
            var checkBox = menu[i].getElementsByTagName("input")[0];
            checkBox.checked=true;
        }
    });

d3.select("#clear")
    .on("click",function(){
        var menu = document.getElementById("chooseMenu").getElementsByTagName("a");
        for(var i=0;i<menu.length;i++){
            var checkBox = menu[i].getElementsByTagName("input")[0];
            checkBox.checked=false;
        }
    });

d3.select("#countInputBox")
    .on("focus",function(){
        this.value = "";
    });

d3.selectAll("#chooseMenu span").style("opacity","0");

drawMap();
drawBrush();

var loadingStat = svg.append('text')
    .attr('x',width/2)
    .attr('y',height/2)
    .attr("id","loadText");
initFuction=initialization();
getUserID();

function progressBar(stat,update,total){
    if(stat=="show"){
        d3.select(".progress-bar.progress-bar-striped").classed("active",true);
        d3.select("#loading").style("display","block");
        var percentage = parseInt(update/total*100)+1;
        d3.select(".progress-bar")
            .html(percentage+"%")
            //.transition()
            .style("width",percentage+"%");
    }
    else{
        d3.select(".progress-bar.progress-bar-striped").classed("active",false);
        d3.select("#loading").style("display","none");
    }

}

//-------------CALCULATE OVERLAP-------------------------
function calculateOL(currentCircle){
    d3.select(".countGroup").remove();
    var overlapCircle= [];

    currentCircle.each(function(d){

        var x1 = projection([d.location.longitude,d.location.latitude])[0],
            y1 = projection([d.location.longitude,d.location.latitude])[1];

        overlapCircle.push({
            "x":x1,
            "y":y1,
            "id":d.id,
            "isCount": false,
            "main": {
                "is": false,
                "number": 1
            }
        })


    })

    overlapCircle.forEach(function(d,i){

        if(d.isCount == false){

            overlapCircle.forEach(function(d1,i1){
                if(i!=i1){
                    var _dist = Math.sqrt(Math.pow((d.x-d1.x),2)+Math.pow((d.y-d1.y),2));
                    if(_dist<=10){
                        //set main
                        overlapCircle[i].main.is = true;
                        overlapCircle[i].main.number++;

                        overlapCircle[i1].isCount = true;

                    }
                }
            })

        }


    });

    // generate sum circle
    var sumCircle = d3.select(".worldMap").append("g").attr("class","countGroup pointerNone");
    overlapCircle.forEach(function(d,i){
        if(d.isCount == false){
            
            var _txt = sumCircle.append("text")
                .attr("class","sumText")
                .attr("x",d.x)
                .attr("y",d.y+5)
                .text(d.main.number);

            // var txtEle = _txt.node().getBBox()
            //
            //
            // sumCircle.append("rect")
            //     .attr("class","sumRect")
            //     .attr("x",txtEle.x)
            //     .attr("y",txtEle.y)
            //     .attr("width",txtEle.width)
            //     .attr("height",txtEle.height)



        }
    });

}
//-------------------------------------------------------

