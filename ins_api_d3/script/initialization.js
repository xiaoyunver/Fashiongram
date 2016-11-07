function initialization(){

    var idList = ["19769622", "9675477", "10051934", "7522782", "6913295", "4500355", "272220114", "21978024", "14454619", "8245237"];
    var accessToken = '3044801826.d90570a.42220436aa9d41d2850ce845a1ded881';
    var startDate = new Date(2015,0);
    var url;
    var timeScale = d3.time.scale().domain([new Date(),startDate]).range([0,100]);

    var initInner = new Object();

    var checkLocation = [];
    var dataList =[];


    for(var i=0;i<idList.length;i++){
        dataList[i] = {
            "id": idList[i],
            "data": [],
            "isComplete": false,
            "progress": 0
        };
        url ="https://api.instagram.com/v1/users/"+idList[i]+"/media/recent/?access_token="+accessToken
        getRequest(url,i);
    }

    // var postId="1185639095612223743_14454619";
    // var locationId ="212999109"
    //
    // $.ajax({
    //     type: "GET",
    //     dataType: "jsonp",
    //     cache: false,
    //     url: "https://api.instagram.com/v1/locations/"+locationId+"?access_token="+accessToken,
    //     success: function(data) {
    //         console.log(data);
    //
    //     }
    // })





    function getRequest(url,index){

        $.ajax({
            type: "GET",
            dataType: "jsonp",
            cache: false,
            url: url,
            success: function(data) {
                console.log(data);
                dataList[index].data = dataList[index].data.concat(data.data);
                if(timeScale(new Date(dataList[index].data[dataList[index].data.length-1].created_time*1000))>=100){
                    dataList[index].progress = 100;
                }
                else{
                    dataList[index].progress = timeScale(new Date(dataList[index].data[dataList[index].data.length-1].created_time*1000))
                }

                var average = 0;
                for(var i = 0 ; i<dataList.length;i++){
                    average += dataList[i].progress;
                    if(i==dataList.length-1){
                        average = average/10;
                    }
                }

                progressBar("show",average,101);

                console.log('Loading: '+dataList[index].data.length);


                if((data.pagination.next_url==undefined)||((new Date(dataList[index].data[dataList[index].data.length-1].created_time*1000))<startDate)){

                    dataList[index].isComplete = true;

                    


                    if(checkState()){
                        console.log("Data is ready, next get corrected location");
                        //console.log(dataList)
                        getCorrectLocation(dataList);
                        //drawDot(dataList);
                    }


                }
                else{
                    url = data.pagination.next_url;
                    getRequest(url,index);
                    console.log("Continue")
                }

            }
            


        })
            .fail(function( xhr, status, errorThrown ) {
            console.log( "Sorry, there was a problem!" );
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.dir( xhr );
        })


    }

    function checkState(){
        var flag = true;
        for(var i=0; i<dataList.length;i++){
            flag = flag&&dataList[i].isComplete;
        }
        return flag;
    }

    function getCorrectLocation(_data){

        _data.forEach(function(d1,i1){
            dataList[i1].data = d1.data.filter(function(d){
                return (new Date(d.created_time*1000)>startDate)&&(d.location != null)&&(d.location.longitude!=undefined)
            });

            d1.data = d1.data.filter(function(d){
                return (new Date(d.created_time*1000)>startDate)&&(d.location != null)&&(d.location.longitude!=undefined)
            });

            d1.data.forEach(function(d2,i2){

                if((d2.location.longitude=="0"&&d2.location.latitude=="1")||(d2.location.longitude==0&&d2.location.latitude==1)){
                    checkLocation.push({
                        "i1":i1,
                        "i2":i2,
                        "insID": d2.id,
                        "locationID":d2.location.id,
                        "stat": false
                    })
                    //_requestLocation(d2.location.id,i1,i2);
                }

            })
        });

        // console.log(checkLocation);

        checkLocation.forEach(function(d,idx_C){
            _requestLocation(d.locationID,d.i1,d.i2,idx_C);
        });

        function _check(){
            var flag = true;
            for(var i=0;i<checkLocation.length;i++){
                flag = flag&&checkLocation[i].stat;
            }
            return flag;
        }

        function _requestLocation(_id,_i1,_i2,_idx_C){
            $.ajax({
                type: "GET",
                dataType: "jsonp",
                cache: false,
                url: "https://api.instagram.com/v1/locations/"+_id+"?access_token="+accessToken,
                success: function(data) {

                    if((data.data.longitude=="0"&&data.data.latitude=="1")||(data.data.longitude==0&&data.data.latitude==1)){
                        _requestLocation(_id,_i1,_i2,_idx_C);
                    }
                    else{
                        checkLocation[_idx_C].stat = true;
                        dataList[_i1].data[_i2].location.latitude = data.data.latitude;
                        dataList[_i1].data[_i2].location.longitude = data.data.longitude;
                        // console.log("CHECK LOCATION")
                        // console.log(data);
                        // console.log(dataList[_i1].data[_i2].location);

                        if(_check()){
                            drawDot(dataList);
                        }
                    }




                }
            })
        }
    }

    function drawDot(fullData){
        d3.selectAll("g.dots").remove();
        
        //save data for later use
        initFulldata = fullData;
        var colorList = ['#FEA993','#F7AAB3','#DBB3CC','#B3BFD4','#92C7C7','#8DCBAA','#A3C88B','#C5C075','#E5B474','#F9AA88'];
        var colorList1 = ["#F6B79D","#F5B8B3","#E6BEC6","#CEC7CF","#B9D0CB","#B1D5BC","#BAD6A8","#D0D397","#E9CD91","#FEC799"];


        // for(var i=0;i<10;i++){
        //     colorList[i]=d3.rgb(parseInt(Math.random()*255),parseInt(Math.random()*255),parseInt(Math.random()*255));
        // }
        fullData.forEach(function(data,index) {

            // data.data = data.data.filter(function(d){
            //     return (new Date(d.created_time*1000)>startDate)&&(d.location != null)&&(d.location.longitude!=undefined)
            // });


            //draw

            var dots = d3.select(".worldMap").append('g')
                .attr('class','dots type_choose id'+data.id);
                

            dots.selectAll('circle')
                .data(data.data.filter(function(d){
                    return (d.location != null)&&(d.location.longitude!=undefined);
                }))
                .enter()
                .append("circle")
                .attr("class",function(d){return "celeDots "+d.user.username})
                .attr('r','5')
                .attr('cx',function(d){

                    return projection([d.location.longitude,d.location.latitude])[0];
                })
                .attr('cy',function(d){

                    return projection([d.location.longitude,d.location.latitude])[1];
                })
                .style("fill",function(){
                    return colorList[index];
                })
                .on("mouseover",function(d){
                    var xPosition = parseFloat(d3.select(this).attr("cx"));
                    var yPosition = parseFloat(d3.select(this).attr("cy"))+200;

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

                    checkLocation.forEach(function(d){
                        if(d.insID==imgData.id){
                            console.log("FIND")
                        }
                    })
                })
                .on('mouseout',function(){
                    d3.select("#tooltip").classed("hidden", true);
                })
                // .each(function(d){
                //
                //     var x1 = projection([d.location.longitude,d.location.latitude])[0],
                //         y1 = projection([d.location.longitude,d.location.latitude])[1];
                //
                //     overlapCircle.push({
                //         "x":x1,
                //         "y":y1,
                //         "id":d.id,
                //         "isCount": false,
                //
                //     })
                //
                //
                // });


            d3.select(".id"+data.id).style("color",colorList[index]);
            d3.selectAll("#chooseMenu span").style("opacity","1");



        });
        initState = true;
        d3.select("#loading").style("display","none");

        console.log(overlapCircle)

    }

    initInner.draw = drawDot;
    return initInner;
    
    
}
