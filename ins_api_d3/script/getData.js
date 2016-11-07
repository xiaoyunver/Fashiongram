function getData(userID,mediaCount){
    var accessToken = '3044801826.d90570a.42220436aa9d41d2850ce845a1ded881';
    var url = "https://api.instagram.com/v1/users/"+userID+"/media/recent/?access_token="+accessToken+"&count="+mediaCount;
    var returnData = new Array();

   
    
    

    getRequest();

    function getRequest(){
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            cache: false,
            url: url,
            success: function(data) {
                //console.log(data);
                //console.log(data.data);
                
                //console.log('Loading: '+instagramData.length+' of '+mediaCount);
                //loadingStat.text('Loading: '+instagramData.length+' of '+mediaCount);
                progressBar("show",returnData.length,mediaCount)
                returnData = returnData.concat(data.data);
                //loadingStat.text('Loading: '+returnData.length+" of "+mediaCount);
                if(mediaCount>20){
                    if(returnData.length<mediaCount) {

                        url = data.pagination.next_url;
                        getRequest();


                    }
                    else{
                        loadingStat.text('Data Loaded');
                        progressBar("hide");
                        drawDot(returnData,mediaCount);
                    }

                }
                else{
                    loadingStat.text('Data Loaded');
                    drawDot(returnData,mediaCount);
                }

            }
        })


    }
    

}


