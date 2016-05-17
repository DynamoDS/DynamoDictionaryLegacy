function progressBar(progress) {

    var progPerc=progress;
    var sceneElevChildrenSize = 8;
    var sceneChildrenSize = 10;
    var sceneUVChildrenSize = 2;
    //      if(sceneElev.children.length<sceneElevChildrenSize||scene.children.length<sceneChildrenSize||sceneUV.children.length<sceneUVChildrenSize){
    if (pbar == 0) {
        var divWidth = window.innerWidth;
        var divHeight = window.innerHeight;

        var divProgress = d3.select("body")
            .append("div")
            .attr("class", "progressBar")
            .style("left", (window.innerWidth / 2 - divWidth / 2) + "px")
            .style("top", (window.innerHeight / 2 - divHeight / 2) + "px")
            .style("width", divWidth + "px")
            .style("height", divHeight + "px")
            .style("line-height", divHeight * .15 + "px")
            .style("opacity", .85)
        .attr("position","absolute")
            .html("</br></br><tt class='loading'>Please wait while the interface loads...</tt></br>");


        svgBackload =
            divProgress.append("svg")
            .attr("width", window.innerWidth / 3 + "px");
        svgRec1 =
            svgBackload
            .append("rect")
            .attr("width", window.innerWidth / 3 + "px")
            .attr("height", "10%")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("fill", d3.rgb(191, 191, 191))
            // .attr("fill", d3.rgb(19,19,19))
            .style("opacity", 0.75)
            .attr("position", "absolute")
            .on("click", function () {});
        svgFrontload = svgBackload
            .append("rect")
            .attr("class", "loadBar")
            .attr("width", progPerc * (window.innerWidth / 3))
            .attr("height", "10%")
            .attr("rx", 5)
            .attr("ry", 5)
            // .attr("fill", d3.rgb(191,191,191))
            .attr("fill", d3.rgb(19, 19, 19))
            .style("opacity", 0.75)
            .attr("position", "absolute")
            .on("click", function () {});



        pbar = 1;
    }

    // boxWidth=(d3.select(".folder > :nth-child(1)").selectAll('div > ul')[0][0].offsetWidth);
    // swatchLoad(boxWidth)

    //             var saver=d3.selectAll(".save-row")
    //             .on("mouseover",function(d,i){
    //                 if(mainConsole.Tooltip_Help){
    //                  toolTipText="<tt class='header'>Save scheme</tt></br></br><tt class='param'><b>Gear Button:</b></tt><tt class='body'> The localStorage checkbox allows the recovery of saved schemes in between sessions. This is experimental and dependent on compatibility with Nike servers.</tt><tt class='param'></br></br><b>Save:</b></tt><tt class='body'> Save the active scheme in the dropdown menu.  This will overwrite the current scheme.</tt></br></br><tt class='param'><b>New:</b></tt><tt class='body'> Save a new scheme.  Select schemes from the dropdown menu</tt></br></br><tt class='param'><b>Revert:</b></tt><tt class='body'> Return to saved settings for current scheme in dropdown menu.</tt></br></br><tt class='param'><em><b>Note:</b></em></tt><tt class='body'> <em>In this version, saving schemes will save the parameters set in the user interface, but will not save loaded maps or placed landmarks.</em></tt>";  
    //              divProgress.transition()       
    //                 .duration(100)      
    //                 .style("opacity", .9)   
    //                 .style("left", (window.innerWidth-600) + "px")     
    // //                .style("top", (d3.event.pageY) + "px");
    //                .style("top", this.offsetTop + "px")
    //                ;
    //                div
    //                 .html(""+toolTipText+"")
    //                ;
    //                 }

    //             })
    //             .on("mouseout", function(d) {       
    //               divProgress.transition()      
    //                 .duration(600)      
    //                 .style("opacity", 0);   
    //             });


    //        if((sceneUV.children.length+scene.children.length+sceneUV.children.length)/(sceneElevChildrenSize+sceneChildrenSize+sceneUVChildrenSize)>progPerc){
    //        progPerc=(sceneUV.children.length+scene.children.length+sceneUV.children.length)/(sceneElevChildrenSize+sceneChildrenSize+sceneUVChildrenSize)
    //        d3.selectAll(".loadBar").transition().duration(1800).attr("width", (progPerc*(window.innerWidth/3)));
    //        }
    //      }
    //      else{
    //        if(delayer==0){
    //          d3.selectAll(".loadBar").transition().duration(800).attr("width", (1*(window.innerWidth/3)));
    //          
    //          setTimeout(function(){
    //            d3.selectAll(".progressBar").html("</br></br><tt class='loading'>Load Complete.</tt></br>")
    //          },800)
    //
    //          d3.selectAll(".progressBar").transition().duration(2000).delay(800).style("opacity",0);
    //        delayer=1;
    //      }
    //      }
    //    }
}