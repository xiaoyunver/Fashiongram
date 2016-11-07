function drawBrush(){
    var startDate = new Date(2015,0,1);
    var mList = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var endDate = new Date();
    var xScale = d3.time.scale().domain([startDate,endDate]).range([0,width]);
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(10);

    var brush = d3.svg.brush()
        .x(xScale)
        .on("brush",brushed);


    var brushTimeline = d3.select("#timeline1")
        .append("svg")
        .attr("width",width+margin.l+margin.r)
        .attr("height","100px")
        .append("g")
        .attr("transform", "translate("+margin.l+","+margin.t+")");

    brushTimeline.append("g")
        .attr("class","x axis")
        .call(xAxis);


    brushTimeline.append("g")
        .attr("transform", "translate(0,-50)")
        .attr("class","brush")
        .call(brush)
        .selectAll("rect")
        .attr("height","100");

    d3.select(".extent")
        .attr("transform", "translate(0,25)")
        .attr("height","50");

    var texts = brushTimeline.append("g").attr("class","extentText");

    var leftT = texts.append("text")
        .attr("x",0)
        .attr("y",-d3.select(".extent").attr("height")/2)
        //.text("Jan 1 2015");

    // var toDay = new Date();

    // var toDayDate = toDay.getDate(),
    //     toDayMonth = toDay.getMonth(),
    //     toDayYear = toDay.getFullYear();


    var rightT = texts.append("text")
        .attr("x",0)
        .attr("y","-5px")
       // .text(mList[toDayMonth]+" "+toDayDate+" "+toDayYear);




    function brushed() {
        var value = brush.extent();
        //console.log(value);

        d3.selectAll(".dots").selectAll("circle")
            .style("pointer-events",function(d){
                var tempDate = new Date(d.created_time*1000);
                if((tempDate>=value[0])&&(tempDate<=value[1])){
                    return "all";
                }
                else
                    return "none";
            })
            .transition()
            .style("opacity",function(d){
                var tempDate = new Date(d.created_time*1000);
                if((tempDate>=value[0])&&(tempDate<=value[1])){
                    return 1;
                }
                else
                    return 0;
            })



        leftT.attr("x",d3.select(".extent").attr("x"))
            .text(mList[value[0].getMonth()]+" "+value[0].getDate()+" "+value[0].getFullYear());
            //.text((value[0].getMonth()+1)+"/"+value[0].getDate()+"/"+value[0].getFullYear().toString().substr(2,2));
        rightT.attr("x",parseInt(d3.select(".extent").attr("x"))+parseInt(d3.select(".extent").attr("width")))
            .text(mList[value[1].getMonth()]+" "+value[1].getDate()+" "+value[1].getFullYear());
            //.text((value[1].getMonth()+1)+"/"+value[1].getDate()+"/"+value[1].getFullYear().toString().substr(2,2));

    }

    var fashionSchedule = [
        [new Date(2015,1,9),new Date(2015,1,16)],
        [new Date(2015,1,17),new Date(2015,1,21)],
        [new Date(2015,1,22),new Date(2015,1,27)],
        [new Date(2015,1,28),new Date(2015,2,7)],
        [new Date(2015,8,10),new Date(2015,8,17)],
        [new Date(2015,8,18),new Date(2015,8,22)],
        [new Date(2015,8,23),new Date(2015,8,29)],
        [new Date(2015,8,30),new Date(2015,9,7)],
        [new Date(2016,1,10),new Date(2016,1,18)],
        [new Date(2016,1,19),new Date(2016,1,23)],
        [new Date(2016,1,24),new Date(2016,1,29)],
        [new Date(2016,2,1),new Date(2016,2,9)]
    ];

    console.log(fashionSchedule)
    for(var i=0;i<fashionSchedule.length;i++){
        d3.select("#_F"+i)
            .on("click",function(){
                var id = parseInt(d3.select(this).attr("id").substring(2));
                console.log(id);
                brush.extent(fashionSchedule[id]);
                d3.select(".brush")
                    .transition()
                    .call(brush)
                    .call(brush.event);

            })
    }

    d3.select("#_show")
        .on("click",function(){
            brush.clear();
            d3.select(".brush")
                .call(brush);

            d3.selectAll(".type_choose circle")
                .style("pointer-events","all")
                .transition()
                .style("opacity","1");

            leftT.text("")
            rightT.text("")
        })

    // d3.select("#_F0").on("click",function(){
    //     console.log("CHOOSE");
    //     brush.extent([new Date(2015,8,10),new Date(2015,11,17)])
    //     d3.select(".brush")
    //         .transition()
    //         .call(brush)
    //         .call(brush.event);
    // })

}
