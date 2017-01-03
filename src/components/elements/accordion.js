let accordion = {};
const d3 = require('d3')


function structureDiv(d) {
    d3.select(this)
        .append('button')
        .attr("class", "accordion button" + d.iteration + "")
        .html(d.Name)
        .style("height", function(d) {
                if (d.iteration == 1) {
                    return "40px";
                } else {
                    return "28px";
                }
            }).style("width", "100%");
    d3.select(this).append("div").each(newTier)
}

function newTier(d, i) {
    if (d.Arr) {
        accordion.addAccordion(d.Arr, this, ++d.iteration);
    }
}


accordion.addAccordion = function(li, el, iteration) {
    li.forEach(d=>d.iteration=iteration);
    d3.select(el).selectAll("div").data(li).enter().append("div").each(structureDiv)
}




accordion.addAccordionOld = function(li, appendel, iteration) {
    var ogo = {
        "Name": ""
    }
    li.forEach(function(obj, j) {
        var bk0 = appendel.append("button").attr("class", "accordion button" + iteration + "")
        bk0.data([obj]).enter()
        var catdiv = appendel.append("div").attr("class", "panel iteration" + iteration + "")
        bk0
            .style("height", function() {
                obj.button = this;
                obj.ita = iteration;
                if (iteration == 1) {
                    return "40px";
                } else {
                    return "28px";
                }
            }).style("width", "100%")
        bk0.on("click", function() {
            endLoad(obj);
            document.getElementById("searchBox").value = "";

            if (obj.Arr != undefined) {
                d3.select(".nodeName").html()
                var descript = d3.select(".nodeName")
                descript.select('text').html('' + obj.Name + '<hr>')
                d3.selectAll(".nodeDesc").html("")
                d3.selectAll(".nodeIn").html("")
                d3.selectAll(".nodeOut").html("")
                d3.selectAll(".nodeGroup").html("")
                d3.selectAll(".nodeHier").html("")
                d3.selectAll(".inDepth").html("")
                d3.selectAll(".exampleFile").html("")
                d3.select(".nodeHier").html("<b>Dynamo Hierarchy:</b>")
                var catlist = grandChildren(obj)
                addHierarchy(catlist)
                d3.select(".nodeHier").append("p").html("<br><hr>")

                function grandChildren(ob) {
                    if (ob.Arr != undefined) {
                        return grandChildren(ob.Arr[0])
                    } else {
                        var lili = [];
                        ob.Categories.forEach(function(h, j) {
                            lili.push(h)
                        })
                        lili.push(ob.Group);
                        return (lili.slice(0, obj.iteration + 1))
                    }
                }
                getCats(obj.Name, obj.iteration);
                var ims = d3.selectAll(".imageTiles").selectAll("img")
                ims[0].forEach(function(q, w) {
                    if (d3.select(q).data()[0].Categories[iteration - 1] == obj.Name || (d3.select(q).data()[0].Group == obj.Name && d3.select(q).data()[0].Categories[Math.max(0, iteration - 2)] == obj.Parent)) {
                        if (iteration > 1) {
                            imageActivate(q, w, 800)
                        } else {
                            imageActivate(q, w, 800)
                        }
                    } else {
                        if (iteration > 1) {
                            imageDeactivate(q, w, 800)
                        } else {
                            imageDeactivate(q, w, 800)
                        }
                    }
                    if (w == ims[0].length - 1) {
                        tilize();
                    }
                })
            } else {
                nodelevel = true;
                d3.selectAll(".imageTiles").selectAll("img").attr("width", "0")
                var ddd = d3.select(this);
                var displayObject = (obj);
                updateInfo(displayObject);
            }
            accordionActivate(this, iteration, obj);
            if (d3.select(this).classed("active") == false && obj.Arr != undefined) {
                d3.select(this).style("background-color", "gray")
            }
        }).style("padding-left", 10 + Math.max(0, (iteration - 1)) * 6 + "px").style("padding-right", "12px")
        bk0.html("" + obj["Name"] + "")
        if (obj["Arr"] != undefined) {
            obj.Arr.forEach(function(k, z) {
                if (k["FullCategoryName"] != undefined) {
                    k.it = orderedList.length;
                    orderedList.push(k)
                    var spanner = bk0.append("span").attr("class", "middle")
                }
            })
            accordion.addAccordion(obj.Arr, catdiv, iteration + 1);
            flatList.push(obj.Arr);
        } else {

            bk0.html("")
            var spanner = bk0.append("span").attr("class", "middle")
            var image = getImagePath(obj)
            spanner.append("img").attr("src", image).attr("class", "copy" + obj.it).attr("width", 20).style("background-color", d3.rgb(34, 34, 34)).attr("align", "middle").attr("onerror", "this.onerror=null;this.src='images/src/icon_offset.png';")

            function override(oo) {
                var tl = "(";
                if (oo["Inputs"] != undefined) {
                    oo["Inputs"].forEach(function(e, k) {
                        if (k < oo["Inputs"].length - 1) {
                            tl += "" + e.Name + ", ";
                        } else {
                            tl += "" + e.Name + ")";
                        }
                    })
                }
                return tl;
            };
            if (li.length > 1) {
                if (obj.Name == li[(j + 1) % (li.length)].Name) {
                    var newoo = li[(j + 1) % (li.length)];
                    var all = [obj, newoo]
                    if (obj.Name == li[(j + 2) % (li.length)].Name) {
                        all.push(li[(j + 2) % (li.length)])
                    }
                    if (obj.Name == li[(j + 3) % (li.length)].Name) {
                        all.push(li[(j + 3) % (li.length)])
                    }
                    if (obj.Name == li[(j + 4) % (li.length)].Name) {
                        all.push(li[(j + 4) % (li.length)])
                    }
                    all.forEach(function(y, u) {
                        y.Name = y.Name + ' ' + override(y);
                    })
                }
                spanner.append('text').text(' ' + obj.Name + '')
            } else {
                spanner.append('text').text(' ' + obj.Name + '')
            }
            addObToJson(obj)
        }
        ogo = obj;
    })
};


function endLoad(oo) {
    d3.selectAll(".pageLoad").html("");
    d3.selectAll(".imageTiles").style("display", "inline").style("pointer-events", "all")
    if (oo.FullCategoryName != "") {
        d3.selectAll(".seeAlso").html("<b>See Also</b><br><br>");
    } else {
        d3.selectAll(".seeAlso").html("<b>Nodes</b><br><br>");
    }
    if (oo == undefined) {
        d3.selectAll(".seeAlso").html("<b>Nodes</b><br><br>");
    }
}


module.exports = accordion;
