function drawMap(){
    var path = d3.geo.path()
        .projection(projection);

    var worldMap = svg.append('g')
        .attr('class','worldMap');
    var mapPath = worldMap.append('g')
        .attr('class','mapPath');
    
    var centered;

    queue()
        .defer(d3.json,"data/world-50m.json")
        .defer(d3.csv, "data/countries list.csv")
        .await(function(err, world,list){


            // Geo JSON

            mapPath.selectAll('path')
                .data(topojson.feature(world, world.objects.countries).features)
                .enter()
                .append('path')
                .attr('d',path)
                .on("click",clicked);
           
        });

    function clicked(d) {
        var x, y, k;
        var r;
        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 4;
            centered = d;
            r = 1;
            globalRadius = true;
        } else {
            x = width / 2;
            y = height / 2;
            k = 1;
            centered = null;
            r = 5;
            globalRadius = false;
        }

        worldMap.selectAll("path")
            .classed("active", centered && function(d) { return d === centered; });

        worldMap.transition()
            .duration(750)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
        
        worldMap.selectAll('circle')
            .transition()
            .duration(750)
            .attr("r",r)
            .style("stroke-width",r/2.5);

    }
}


