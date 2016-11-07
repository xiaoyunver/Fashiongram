function drawDot(loadedData,countSet){
    
    console.log("The loaded data");
    

    loadedData = loadedData.filter(function(d,i){
        return i<countSet;
    });

    // Claer dots

    d3.selectAll("g.dots").remove();
    // console.log(parent);
    // [].forEach.call(parent,function(d){
    //     while(d.firstChild)
    //         d.removeChild(d.firstChild);
    // })




    console.log(loadedData);
    var dots = d3.select(".worldMap").append('g')
        .attr('class','dots singleUser');

    dots.selectAll('circle')
        .data(loadedData.filter(function(d){
            return d.location != null;
        }))
        .enter()
        .append('circle')
        .attr('r','5')
        .attr('cx',function(d){

            return projection([d.location.longitude,d.location.latitude])[0];
        })
        .attr('cy',function(d){
            return projection([d.location.longitude,d.location.latitude])[1];
        })
        .on('mouseover',function(d){         // Tooltip
            var xPosition = parseFloat(d3.select(this).attr("cx"));
            var yPosition = parseFloat(d3.select(this).attr("cy"))+200;
            console.log(d);
            var imgData = d;
            //Update the tooltip position and value
            d3.select("#tooltip")
                .style("left", "30%")
                .style("top", "30%")
                .select("#insImg")
                .attr('src',function(){
                    return imgData.images.thumbnail.url.replace("s150x150","s320x320");
                });
            d3.select('#username')
                .text(imgData.user.full_name);
            d3.select('#content')
                .text(imgData.caption.text);
            d3.select('#location')
                .text(imgData.location.name);

            var tempDate = new Date(imgData.created_time*1000);
            var month = tempDate.getMonth()+1;
            var date = tempDate.getDate();
            var year = tempDate.getFullYear();

            console.log(month+"/"+date+"/"+year);
            console.log("Date is: "+ tempDate);
            d3.select("#date")
                .text(month+"/"+date+"/"+year);

            //Show the tooltip
            d3.select("#tooltip").classed("hidden", false);
        })
        .on('mouseout',function(){
            d3.select("#tooltip").classed("hidden", true);
        });

    setTimeout(function(){loadingStat.text("");},1000);

}
