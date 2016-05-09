 var maindiv = d3.select(".container")
 var leftdiv = d3.select(".left-element")
     //        .on('mouseover',function(){d3.select(this).style("position","relative")})
     //        .on('mouseout',function(){d3.select(this).style("position","fixed")})




 var rightdiv = d3.select(".right-element")
     //        .on('mouseover', function() {
     //            d3.select(this).style("position", "relative")
     //        }).on('mouseout', function() {
     //            d3.select(this).style("position", "fixed")
     //        })
 var allData;
 rightdiv.append("div").attr("class", "nodeName").append("img")
 d3.select(".nodeName").append("text")
 rightdiv.append("div").attr("class", "nodeHier")
 rightdiv.append("div").attr("class", "nodeGroup")
 rightdiv.append("div").attr("class", "nodeDesc")


 rightdiv.append("div").attr("class", "nodeIn")
 rightdiv.append("div").attr("class", "nodeOut")
 rightdiv.append("div").attr("class", "inDepth")
 rightdiv.append("div").attr("class", "exampleFile")
 rightdiv.append("div").attr("class", "seeAlso")

 function sortArrayOfObjectsByKey(arr, key) {
     arr.sort(function (a, b) {
         var keyA = (a[key]),
             keyB = (b[key]);
         // Compare the 2 dates
         if (keyA < keyB) return -1;
         if (keyA > keyB) return 1;
         return 0;
     });
     return arr;
 }



 // Changes XML to JSON
 function xmlToJson(xml) {

     // Create the return object
     var obj = {};

     if (xml.nodeType == 1) { // element
         // do attributes
         if (xml.attributes.length > 0) {
             obj["@attributes"] = {};
             for (var j = 0; j < xml.attributes.length; j++) {
                 var attribute = xml.attributes.item(j);
                 obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
             }
         }
     } else if (xml.nodeType == 3) { // text
         obj = xml.nodeValue;
     }

     // do children
     if (xml.hasChildNodes()) {
         for (var i = 0; i < xml.childNodes.length; i++) {
             var item = xml.childNodes.item(i);
             var nodeName = item.nodeName;
             if (typeof (obj[nodeName]) == "undefined") {
                 obj[nodeName] = xmlToJson(item);
             } else {
                 if (typeof (obj[nodeName].push) == "undefined") {
                     var old = obj[nodeName];
                     obj[nodeName] = [];
                     obj[nodeName].push(old);
                 }
                 obj[nodeName].push(xmlToJson(item));
             }
         }
     }
     return obj;
 };





 //        var xmldata;



 d3.xml("data/Dynamo_Library.xml", function (error, data) {
     if (error) throw error;
     xmldata = data;
     //            console.log(xmlToJson(data))
     console.log(data)
     allData = [];

     data = [].map.call(data.querySelectorAll("Category"), function (cat) {
         var catn = cat.getAttribute("Name")

         for (var i = 0; i < cat.children.length; i++) {
             var cn = cat.children[i]
             var nd = {};
             nd["FullCategoryName"] = cn.querySelector("FullCategoryName").textContent;
             nd["Categories"] = nd["FullCategoryName"].split(".")
             nd["TopCategory"] = nd["Categories"][0];
             nd["Name"] = cn.querySelector("Name").textContent;
             //                    console.log(nd["Name"])
             nd["Group"] = cn.querySelector("Group").textContent;
             nd["Description"] = cn.querySelector("Description").textContent;
             getParam("Inputs", "InputParameter");
             getParam("Outputs", "OutputParameter");
             nd["SmallIcon"] = cn.querySelector("SmallIcon").textContent.trim();
             nd["LargeIcon"] = cn.querySelector("LargeIcon").textContent.trim();
             nd["SearchTags"] = cn.querySelector("SearchTags").textContent.trim();
             //                    nd["Index"] = i;

             function getParam(val1, val2) {
                 if (cn.querySelector(val1) != undefined) {
                     var vals = (cn.querySelector(val1))
                     vals = vals.querySelectorAll(val2);
                     arr = []

                     for (var q = 0; q < vals.length; q++) {
                         var m = vals[q]
                         ob = {};
                         ob["Name"] = m.getAttribute("Name");
                         ob["Type"] = m.getAttribute("Type");
                         arr.push(ob);
                     }
                     nd[val1] = arr;
                 }
             }
             allData.push(nd)
         }
     });

     allData.forEach(function (d, i) {
         var c = 0;
         allData.forEach(function (e, j) {
             if (_.isEqual(d, e)) {
                 c++;
                 if (c > 1) {
                     allData.splice(j, 1)
                 }
             }
         })
     })



     sortArrayOfObjectsByKey(allData, "TopCategory")


     var hierarchy = {};
     var maxhier = 0;
     var tempCat = {};

     allData.forEach(function (d, i) {
         //                console.log(hierarchy)
         var tempCat = hierarchy;
         //                console.log(hierarchy)
         var c = d.Categories;
         if (c.length > maxhier) {
             maxhier = c.length;
         }
         c.forEach(function (e, j) {
             if (tempCat[e] == undefined) {
                 tempCat[e] = [];
             }
             tempCat = tempCat[e];
             //                    console.log(tempCat)
             if (j == c.length - 1) {
                 tempCat.push(d);
                 d.finalIndex = true;
             }
         })
     })

     var h2 = {
         "Name": "RootStructure"
     };
     allData.forEach(function (d, i) {
         var c = d.Categories;
         if (c.length > maxhier) {
             maxhier = ct.length;
         }
     })
     var mainlist = objectify(allData, 0)
         //            var mainlist = [];

     function objectify(ad, q) {
         if (Array.isArray(ad)) {
             var ml = [];
             ad.forEach(function (d, i) {
                 var c = d.Categories;
                 if (q < c.length) {
                     if (ml.length == 0) {
                         ml.push({
                             "Name": c[q],
                             "Arr": [d]
                         })
                     } else {
                         var hit = false;
                         ml.forEach(function (f, k) {
                             if (f["Name"] == c[q]) {
                                 hit = true;
                                 f["Arr"].push(d)
                             }
                         })
                         if (hit == false) {
                             ml.push({
                                 "Name": c[q],
                                 "Arr": [d]
                             })
                         }
                     }
                 } else {
                     if (ml.length == 0) {
                         ml.push({
                             "Name": d.Group,
                             "Arr": [d]
                         })
                     } else {
                         var hit = false;
                         ml.forEach(function (f, k) {
                             if (f["Name"] == d.Group) {
                                 hit = true;
                                 f["Arr"].push(d)
                             }
                         })
                         if (hit == false) {
                             ml.push({
                                 "Name": d.Group,
                                 "Arr": [d]
                             })
                         }
                     }
                     //                            var newd=objectifyGroup(ad)
                     //                            console.log(newd)
                     //                            ml.push(d)
                 }
             })
             return sortArrayOfObjectsByKey(ml, "Name");

         } else {
             return ad;
         }
     }

     function objectifyGroup(ad) {
         if (Array.isArray(ad)) {
             var ml = [];
             ad.forEach(function (d, i) {
                 var c = d.Group;
                 if (ml.length == 0) {
                     ml.push({
                         "Name": c,
                         "Arr": [d]
                     })
                 } else {
                     var hit = false;
                     ml.forEach(function (f, k) {
                         if (f["Name"] == c) {
                             hit = true;
                             f["Arr"].push(d)
                         }
                     })
                     if (hit == false) {
                         ml.push({
                             "Name": c,
                             "Arr": [d]
                         })
                     }
                 }

             })
             return ml;

         } else {
             return ad;
         }
     }

     mainlist.forEach(function (d, i) {
         d.Arr = objectify(d.Arr, 1)
         d.Arr.forEach(function (e, j) {
             //                    console.log(e.Name)
             if (e.Name != "Create" && e.Name != "Action" && e.Name != "Query") {
                 e.Arr = objectify(e.Arr, 2)
             }
             e.Arr.forEach(function (f, g) {
                 if (f.Name != "Create" && f.Name != "Action" && f.Name != "Query") {
                     f.Arr = objectify(f.Arr, 3)
                 }
             })
         })
     })

     h2.Arr = mainlist;

     console.log(mainlist)
         //            var noob={};
         //            var nooblist=[];
         //            for(key in hierarchy){
         //                if(hierarchy[key].length==0){
         //                    for (keyy in hierarchy[key]){
         ////                        hierarchy[key][keyy].Name=keyy
         //                        hierarchy[key].push(hierarchy[key][keyy])
         //                    }
         //                }
         //               nooblist.push({"Name":key,"Arr":hierarchy[key]}) 
         //            }
         //            console.log(nooblist)
         //            
         //            for(key in hierarchy){
         //                console.log(hierarchy[key].length);
         //                if(hierarchy[key].length<1){
         //                for (keyy in hierarchy[key]){
         //                
         //                    hierarchy[key].push(hierarchy[key][keyy])
         //                }
         //                }
         //            }

     //            console.log(hierarchy)
     var newHierarchy = {};
     var subList = [];

     //            for (key in hierarchy) {
     //                var ob = hierarchy[key]
     //                nestArray(ob);
     //                function nestArray(obb) {
     //                    if (Array.isArray(obb)) {
     //                        if (obb.length == 0) {
     //                            for (keyy in obb) {
     //                                nestArray(obb[keyy])
     //                                var newOb={};
     //                                newOb.Name=keyy;
     //                                newOb.Arr=obb[keyy];
     //                                console.log(newOb)
     //                                obb.push(newOb)
     //                            }
     //                        }
     //                    }
     //                }
     //            }

     //            console.log(hierarchy)
     //            var newHierarchy = reFormat(hierarchy);
     //            function reFormat(hier) {
     //                for (keys in hier) {
     //                    subOb = {};
     //                    subOb.Name = keys;
     //                    subOb.Items = hier[keys];
     //                    if(subOb.Items.isArray==true){
     //                        console.log(subOb.Items)
     ////                        subOb.Items=reFormat(subOb)
     //                    }
     //                    subList.push(subOb);
     //                }
     //                hier.Items = (subList)
     //                return hier;
     //            }

     //            console.log(hierarchy)
     //            console.log(newHierarchy)


     var color_scale = d3.scale.linear()
         .domain([1, maxhier])
         .range(["#222222", "#444444"])
         .clamp(true);
     var col = d3.rgb(70, 130, 180).brighter();
     var color_scaleA = d3.scale.linear()
         .domain([1, maxhier])
         .range(["steelblue", col])
         .clamp(true);

     //                        console.log(hierarchy)
     var addAccordionButton = function (obj, appendel, iteration) {
         //                console.log(iteration)
         var tempArr = [];
         //                if (iteration == 1) {
         for (i in obj) {
             var tempOb = {}
             tempOb[i] = obj[i]
             tempOb["Sort"] = i;
             tempArr.push(tempOb)
         }
         sortArrayOfObjectsByKey(tempArr, "Sort")
             //                }
             //                                console.log(obj)
         for (var i in obj) {
             if (obj["FullCategoryName"] == undefined) {
                 var bk0 = appendel.append("button").attr("class", "accordion button" + iteration + "")
                     .style("background-color", color_scale(iteration))
                     .style("height", function () {
                         if (iteration == 1) {
                             return "60px";
                         } else {
                             return "40px";
                         }
                     })
                     .style("width", "100%")
                     .on("mouseover", function () {
                         if (d3.select(this).classed("active") == false) {
                             d3.select(this).style("background-color", "gray")
                         }
                     })
                     .on("mouseout", function () {
                         if (d3.select(this).classed("active") == false) {
                             d3.select(this).style("background-color", color_scale(iteration))
                         } else {
                             d3.select(this).style("background-color", color_scaleA(iteration))
                         }
                     })
                     .on("click", function () {
                         var s = d3.selectAll(".button" + iteration + "");
                         for (var j = 0; j < s[0].length; j++) {
                             if (s[0][j].classList.contains("active") && s[0][j] != this) {
                                 s[0][j].classList.toggle("active");
                                 s[0][j].nextElementSibling.classList.toggle("show");
                                 d3.select(s[0][j])
                                     .style("background-color", color_scale(iteration))
                             }
                         }
                         this.classList.toggle("active");

                         if (obj[this.textContent] == undefined) {
                             var ddd = d3.select(this);
                             console.log()
                             for (var j = 0; j < i; j++) {
                                 var o = obj[j];
                                 if (_.isEqual(ddd.data()[0], o)) {
                                     var displayObject = (obj[j])
                                     updateInfo(displayObject);
                                 }
                             }
                         }
                         this.nextElementSibling.classList.toggle("show");
                         d3.select(this)
                             .style("background-color", color_scaleA(iteration))
                     })
                     .style("font-size", 12 + "px")
                     .style("color", "white")
                     .style("padding-left", iteration * 6 + "px")
                     .style("padding-right", "18px")

                 if (obj["FullCategoryName"] == undefined && obj[i]["FullCategoryName"] != undefined) {
                     sortArrayOfObjectsByKey(obj, "Name")
                     bk0.data([obj[i]]).enter()
                     var spanner = bk0.append("span").attr("class", "middle")
                     var image = getImagePath(obj[i])
                     spanner.append("img").attr("src", image).attr("width", 20).attr("align", "middle").attr("onerror", "this.onerror=null;this.src='images/src/icon.png';")
                     spanner.append('text').text(' ' + obj[i].Name + '')
                 } else {
                     bk0.html("" + i + "")
                 }


                 //                        d3.selectAll(".button" + iteration + " active").style("background-color", "pink")
                 var catdiv = appendel.append("div").attr("class", "panel iteration" + iteration + "")
                 addAccordionButton(obj[i], catdiv, iteration + 1)
             } else {}
         }
     };
     var bod = leftdiv;
     addAccordionButton(hierarchy, bod, 1)
 });



 function getImagePath(ob) {
     var image = 'images\\' + ob.SmallIcon;
     var splitter = image.split("src");
     if (splitter.length < 2) {
         image = "images/src/icon.png";
     }
     return image;
 }

 function updateInfo(ob) {
     if (rightdiv.style("opacity") > 0) {
         rightdiv.style("opacity", 0).transition().duration(800).style("opacity", 1).transition().duration(800)
     }

     addInputs("Inputs", ".nodeIn", "ins", true)
     addInputs("Outputs", ".nodeOut", "outs", false)

     function addInputs(prop, clas, clas2, hasname) {
         if (ob[prop] != undefined) {

             d3.select(clas).html("<br><b>" + prop + ":</b></br>")

             ob[prop].forEach(function (t, r) {
                 if (hasname == true) {
                     d3.select(clas).append("text").attr("class", clas2).html('<b>' + t.Name + ':</b>&nbsp' + t.Type + '<br>')
                 } else {
                     d3.select(clas).append("text").attr("class", clas2).html('<b>Type:</b>&nbsp' + t.Type + '<br><br>')
                 }
             })
         } else {
             d3.select(clas).html("")
         }
     }
     //            console.log(ob)
     d3.select(".nodeName").html()

     var descript = d3.select(".nodeName")
     descript.select('text').html('' + ob.Name + '<hr>')
     d3.select(".nodeGroup").html("<b>Group:</b><br>&nbsp&nbsp   " + ob.Group)
     d3.select(".nodeDesc").html("<br><b>Description:</b><br>&nbsp&nbsp  " + ob.Description)

     //            d3.select(".nodeOut").html("<br><b>Outputs:</b>  " + ob.Outputs)

     d3.select(".nodeHier").html("<b>Dynamo Hierarchy:</b><br>&nbsp&nbsp  " + ob.Categories + "<br><br>")


     var strr = `
            
                Am eatur? Qui blant, idenisc ienditi osandae mi, consect emporeste et quia corestem aut lacient, to od untorum quo quis et fugiten ditaerita volorunt ea siti re officil iaerit apedige nderro temporporum eum quunt quassincia nonsequame que atiorundisit laborunti re, id molo beatio ipienda doles doluptate cumquae. 
    <br><br>
Itatet quiae possimaximus et pellam, quam rehendit maionsenti tem. Ut quatiae qui im que et essimus a doloresed min con recab ime plictotae. Xeritae. Exerspienem imus et ut moluptat pe mint fugiaepel iur aut fuga. To optae re sus imaiorem aut fugit quianti cusdanis eum fugita doluptiis aborror endemquis asit autem quo et est, anditae dite prat.<br><br><hr>
`

     var rand = Math.random();
     if (rand > 0.5) {
         var iconimage1 = "images/icons/download.svg";
         var iconimage2 = "images/icons/edit.svg";
         var iconimage3 = "images/icons/add.svg";
         d3.select(".inDepth").html("<hr><br><b>In Depth:</b>&nbsp&nbsp&nbsp")
             .append("img").attr("hspace", 2).attr("width", "20px").attr("src", iconimage2).style("opacity", .25)
             .on("mouseover", function () {
                 d3.select(this).style("opacity", 1);
                 d3.select("body").style("cursor", "pointer");
             })
             .on("mouseout", function () {
                 d3.select(this).style("opacity", .25);
                 d3.select("body").style("cursor", "default");
             })

         d3.select(".inDepth").append("html").html("<br>").append("html").html(strr + "<br>")
         var sampImage = "images/examples/pointByCoordinates.png";
         d3.select(".exampleFile").html("<br><b>Example File:</b>&nbsp&nbsp&nbsp")
             .append("img").attr("hspace", 2).attr("width", "20px").attr("src", iconimage2).style("opacity", .25)
             .on("mouseover", function () {
                 d3.select(this).style("opacity", 1);
                 d3.select("body").style("cursor", "pointer");
             })
             .on("mouseout", function () {
                 d3.select(this).style("opacity", .25);
                 d3.select("body").style("cursor", "default");
             })
         d3.select(".exampleFile")
             .append("img").attr("hspace", 1).attr("width", "20px").attr("src", iconimage3).style("opacity", .25)
             .on("mouseover", function () {
                 d3.select(this).style("opacity", 1);
                 d3.select("body").style("cursor", "pointer");
             })
             .on("mouseout", function () {
                 d3.select(this).style("opacity", .25);
                 d3.select("body").style("cursor", "default");
             })
         d3.select(".exampleFile")
             .append("img").attr("hspace", 6).attr("width", "20px").attr("src", iconimage1).style("opacity", .25)
             .on("mouseover", function () {
                 d3.select(this).style("opacity", 1);
                 d3.select("body").style("cursor", "pointer");
             })
             .on("mouseout", function () {
                 d3.select(this).style("opacity", .25);
                 d3.select("body").style("cursor", "default");
             })





         d3.select(".exampleFile").append('html').html("<br>").append("img").attr("src", sampImage).attr("width", "70%").attr("align", "middle").attr("onerror", "this.onerror=null;this.src='images/src/icon.png';")
     } else {
         d3.select(".inDepth").html("")
         d3.select(".exampleFile").html("")

     }




     tl = (ob.SearchTags.split(','))

     related = [];

     if (tl != "") {
         tl.forEach(function (h, j) {
             allData.forEach(function (d, i) {
                 var s = (d.SearchTags.split(','))
                 if (s != "") {
                     for (var l = 0; l < s.length; l++) {
                         var k = s[l];
                         if (k.toUpperCase() == h.toUpperCase()) {
                             if (!_.isEqual(ob, d)) {
                                 var dup = false;
                                 if (related.length == 0) {
                                     related.push(d)
                                 } else {
                                     related.forEach(function (y, z) {
                                         if (_.isEqual(y, d)) {
                                             dup = true;
                                         }
                                         if (z == related.length - 1) {
                                             if (dup == false) {
                                                 related.push(d);
                                             }
                                         }
                                     })
                                 }

                             }
                         }
                     }

                 }

             })
         })
     }
     //            console.log(related)
     if (related.length > 0) {
         var tname = d3.selectAll(".seeAlso").html("<hr><br><b>See Also</b><br><br>");
         //                   tname.append("html").html("<br>");

     }

     //            related=related.getUnique();
     related.forEach(function (t, u) {
         var image = getImagePath(t)
             //                console.log(t.Name)
             //                console.log(image)
         var im = d3.selectAll(".seeAlso").append("img").style("margin-left", "5px").attr("height", 30).attr("width", 30).attr("src", image).style("background-color", "#333333").attr("onerror", "this.onerror=null;this.src='images/src/icon_offset.png';")
             .on("mouseover", function (d) {
                 d3.select("body").style("cursor", "pointer")
                 im.transition().duration(400).style("background-color", d3.rgb(70, 130, 180));
             })
             .on("mouseout", function (d) {
                 d3.select("body").style("cursor", "default")
                 im.transition().duration(400).style("background-color", d3.rgb(51, 51, 51));
             })
             .on("click", function () {
                 updateInfo(t)
             });
         d3.selectAll(".seeAlso").append("text").style("font-size", "14px").attr("y", "10px").text("   " + t.Name).attr("dy", "20px").append("html")
         if (u == related.length - 1) {
             d3.selectAll(".seeAlso").append("html").html("<br><br>")
         }
     })

     //            if(rightdiv.style("opacity")>0){
     //            rightdi
     //            }
     //                            spanner.append("img").attr("src", image).attr("width", 20).attr("align", "middle").attr("onerror", "this.onerror=null;this.src='images/src/icon.png';")

 }

 //        Array.prototype.getUnique = function() {
 //            var u = {},
 //                a = [];
 //            for (var i = 0, l = this.length; i < l; ++i) {
 //                if (u.hasOwnProperty(this[i])) {
 //                    continue;
 //                }
 //                a.push(this[i]);
 //                u[this[i]] = 1;
 //            }
 //            return a;
 //        }
