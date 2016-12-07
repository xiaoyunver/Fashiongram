function getUserID(){
    var userID;
    var accessToken = '3044801826.1fb234f.09ff609554ec450fa01924bd5b6d8e3d';
    var mediaTotal;

    // When click search button
    d3.select("#searchButton")
        .on("click",function(){
            if(initState == true){
                var searchBox = document.getElementById("searchBox").value;
                if(searchBox.length!=0){

                    getReq(searchBox,1);

                }
                else
                {
                    alert("Please input name first.");
                }
            }
            else{
                alert("Initializing, please wait")
            }
        });

    // When click choose button
    d3.select("#chooseButton")
        .on("click",function(){
            if(initState == true){
                d3.select("#userInfo").classed("hidden",true);
                if(!d3.select(".dots").classed("type_choose")){
                    initFuction.draw(initFulldata);
                }

                var menu = document.getElementById("chooseMenu").getElementsByTagName("a");
                var selectedItems=[];

                for(var i=0;i<menu.length;i++){
                    var checkBox = menu[i].getElementsByTagName("input")[0];
                    if(!checkBox.checked){
                        selectedItems.push("id"+checkBox.value);
                    }

                }
                console.log(selectedItems);

                d3.selectAll(".type_choose").classed("hidden",false);
                for(var i=0;i<selectedItems.length;i++){
                    d3.select(".type_choose."+selectedItems[i]).classed("hidden",true);
                }
            }
            else{
                alert("Initializing, please wait")
            }

            
            


        });



    function getReq(userName,type){

        var url = "https://api.instagram.com/v1/users/search?q="+userName+"&access_token="+accessToken;
        var userList = new Array();
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            cache: false,
            url: url,
            success: function (data) {
                userList = data.data;
                //userList = userList.concat(data.data);
                if(type == 1){
                    if(data.data.length ==0){
                        var parent = document.getElementById("resultBox");
                        while(parent.firstChild)
                            parent.removeChild(parent.firstChild);


                        d3.select("#resultBox")
                            .append("p")
                            .text("No results.");
                        d3.select("#resultBox")
                            .classed("hidden",false);
                    }

                    else{
                        console.log(data);
                        drawList(userList);
                        d3.select("#resultBox")
                            .classed("hidden",false);
                    }

                }
                else{

                }

            }
        })


    }

    function showUserInfo(data){
        var userInfo = d3.select("#userInfo");
        var parent = document.getElementById("userInfo");
        while(parent.firstChild)
            parent.removeChild(parent.firstChild);

        userInfo.append("img")
            .attr("src",data.profile_picture)
            .attr("class","img-circle")
            .style("margin-right","10px");

        userInfo.append("span")
            .text(data.full_name);

        userInfo.classed("hidden",false);
    }
    
    function drawList(data){
        
        var resParent = document.getElementById("resultBox");
        while(resParent.firstChild)
            resParent.removeChild(resParent.firstChild);
        var rList = d3.select("#resultBox").selectAll("div")
            .data(data)
            .enter()
            .append("div")
            .attr("class","resultList");

        rList.append("p")
            .text(function(d){
                if(!d.full_name)
                    return "(None)";
                return d.full_name;
            });

        rList
            .append("div")
            .append("a")
            .attr("href","#")
            .append("img")
            .attr("src",function(d){
                return d.profile_picture;
            })
            .attr("class","img-circle")
            .on("click",function(d){

                var userID = d.id;
                showUserInfo(d);
                getCount(userID);

                


            })


    }

    function getCount(userid,type){
        var url = "https://api.instagram.com/v1/users/"+userid+"/?access_token="+accessToken;
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            cache: false,
            url: url,
            success: function (data) {

                if(data.meta.code =="400"){
                    alert(data.meta.error_message);
                }
                else{

                    if(type=="choose"){
                        showUserInfo(data.data);
                    }


                    mediaTotal = parseInt(data.data.counts.media);
                    console.log(mediaTotal);

                    d3.select("#countSpan")
                        .text(mediaTotal);

                    // hide list, show count box
                    document.getElementById("countInputBox").value = "0";
                    d3.select("#countBox").classed("hidden",false);
                    d3.select("#resultBox")
                        .classed("hidden",true);


                    d3.select("#countButton")
                        .on("click",function(){
                            var countSet = parseInt(document.getElementById("countInputBox").value);
                            console.log("count set is"+countSet);
                            if(isNaN(countSet))
                                alert("Please input a number.");
                            else{
                                if((countSet>mediaTotal)||(countSet<0)){
                                    alert("The count you set is not correct. Please input a positive number not greater than the total number.");
                                }
                                else{

                                    d3.select("#countBox").classed("hidden",true);
                                    getData(userid,countSet);
                                }
                            }

                        })
                }


            }
        })
    }
}