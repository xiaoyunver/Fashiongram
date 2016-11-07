// window.onresize = function(
// ){ location.reload(); }


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

// Calculate overlap
var overlapCircle = [];

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

