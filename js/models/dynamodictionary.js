 var maindiv = d3.select(".container")
 var leftdiv = d3.select(".left-element")
 var searchBar = d3.select("#searchBar")
 var col, color_scale, color_scaleA;
 var timer = 800;
 var imcount = [];
 var maxhier = 0;
 var rightdiv = d3.select(".right-element")
 var matrify = true;
 var sbb = d3.select("#searchBar").select("span")
 addIcon("images/icons/list-01.svg", "list");
 addIcon("images/icons/matrix-01.svg", "matrix");

 function addIcon(ic, c) {
     var op = 0.25;
     if (c == "matrix") {
         op = 1;
     }
     sbb.append("img").attr("class", c).attr("hspace", 6).attr("width", "15px").attr("src", ic).style("opacity", op).style("float", "right").style("margin-top", "10px")
         .on("mouseover", function () {
             d3.select(this).style("opacity", 1);
             d3.select("body").style("cursor", "pointer");
         })
         .on("mouseout", function () {
             if ((matrify == true && c == "matrix") || (matrify == false && c == "list")) {
                 d3.select(this).style("opacity", 1);
             } else {
                 d3.select(this).transition().duration(timer / 3).style("opacity", 0.25);
             }

             d3.select("body").style("cursor", "default");
         })
         .on("click", function () {

             if (c == "matrix") {
                 matrify = true;
                 d3.selectAll(".list").transition().duration(timer).style("opacity", 0.25)
                 d3.selectAll(".matrix").transition().duration(timer).style("opacity", 1)
             } else {
                 matrify = false;
                 d3.selectAll(".matrix").transition().duration(timer).style("opacity", 0.25)
                 d3.selectAll(".list").transition().duration(timer).style("opacity", 1)
             }
             tilize();
         })
 }

 var allData;
 rightdiv.append("div").attr("class", "nodeName").append("img")
 d3.select(".nodeName").append("text").text("Welcome to the Dynamo Dictionary!").append("hr")
 rightdiv.append("div").attr("class", "nodeHier")
 rightdiv.append("div").attr("class", "nodeGroup")
 rightdiv.append("div").attr("class", "nodeDesc")

 rightdiv.append("div").attr("class", "nodeIn")
 rightdiv.append("div").attr("class", "nodeOut")
 rightdiv.append("div").attr("class", "inDepth")
 rightdiv.append("div").attr("class", "exampleFile")
 rightdiv.append("div").attr("class", "seeAlso")

 function sortArrayOfObjectsByKey(arr, key) {
     if (arr[0][key] != "Action" && arr[0][key] != "Create" && arr[0][key] != "Query") {
         arr.sort(function (a, b) {
             var keyA = (a[key]),
                 keyB = (b[key]);

             if (keyA < keyB) return -1;
             if (keyA > keyB) return 1;
             return 0;
         });
     } else {
         var tempob = {
             "Create": "a",
             "Action": "b",
             "Query": "c"
         };
         arr.sort(function (a, b) {
             var keyA = (tempob[a[key]]),
                 keyB = (tempob[b[key]]);

             if (keyA < keyB) return -1;
             if (keyA > keyB) return 1;
             return 0;
         });

     }
     return arr;
 }

 function xmlToJson(xml) {

     var obj = {};

     if (xml.nodeType == 1) {

         if (xml.attributes.length > 0) {
             obj["@attributes"] = {};
             for (var j = 0; j < xml.attributes.length; j++) {
                 var attribute = xml.attributes.item(j);
                 obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
             }
         }
     } else if (xml.nodeType == 3) {
         obj = xml.nodeValue;
     }

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

 function accordionActivate(but, it, obj) {

     var s = d3.selectAll(".button" + it + "");
     for (var j = 0; j < s[0].length; j++) {
         if (s[0][j].classList.contains("active") && s[0][j] != but) {
             s[0][j].classList.toggle("active");
             s[0][j].nextElementSibling.classList.toggle("show");
             d3.select(s[0][j])
                 .style("background-color", color_scale(it))
         }
     }

     if (but.classList.contains("active") == true && obj.Arr != undefined) {
         if (it > 1) {

             var h = it - 1;
             var parents = d3.selectAll(".button" + h + "");
             if (parents[0].length > 0) {
                 parents[0].forEach(function (d, i) {
                     if (d.classList.contains("active")) {
                         d.classList.toggle("active");

                         d.click();
                         d.nextElementSibling.classList.toggle("show");
                     }
                 })
             }

         } else {

             d3.select(".nodeHier").html("")
             nameDiv("Welcome to the Dynamo Dictionary!")
             var ims = d3.selectAll(".imageTiles").selectAll("img")
             var imcount = [];

             ims[0].forEach(function (q, w) {

                 imageActivate(q, w, 800);

             })
             tilize();
         }
         for (var z = it + 1; z < maxhier + 2; z++) {

             var s = d3.selectAll(".button" + z + "");
             for (var j = 0; j < s[0].length; j++) {
                 if (s[0][j].classList.contains("active")) {
                     s[0][j].classList.toggle("active");
                     s[0][j].nextElementSibling.classList.toggle("show");
                     d3.select(s[0][j])
                         .style("background-color", color_scale(z))
                 }
             }
         }
     }

     if (obj[but.textContent] == undefined) {
         var displayObject = (obj[but.textContent.trim()])

     }

     if (obj.Arr != undefined || but.classList.contains("active") == false) {
         but.classList.toggle("active");

         but.nextElementSibling.classList.toggle("show");
         d3.select(but)
             .style("background-color", color_scaleA(it))
     }

 }

 function imageActivate(q, w, tim) {
     imcount.push(w);
     var qq = d3.select(q).data()[0];
     qq.activated = true;

     if (matrify == true) {
         d3.selectAll(".addedText").remove();
         d3.select(q).transition().duration("" + tim + "").attr("width", 30).style("opacity", 100)
     } else {
         d3.select(q).attr("width", 0).transition().duration("" + tim + "").attr("width", 30).style("opacity", 100)
     }

 }

 function imageDeactivate(q, w, tim) {
     var qq = d3.select(q).data()[0];
     qq.activated = false;

     if (matrify == true) {
         d3.select(q).transition().duration("" + tim + "").attr("width", 0).style("opacity", 0)
     } else {
         d3.select(q).transition().duration(0).attr("width", 0).style("opacity", 0)
     }

 }

 function tilize() {
     d3.selectAll(".addedText").remove();
     var ims = d3.selectAll(".imageTiles").selectAll("img")

     ims[0].forEach(function (t, r) {

         var qq = d3.select(t).data()[0];

         if (qq.activated == true) {
             if (matrify == false) {
                 var tt = d3.select(t.parentNode).append("span").style("position", "relative").style("top", "-10px").attr("class", 'addedText addedText' + r).html(function () {
                         return "&nbsp&nbsp" + qq.Name + "&nbsp&nbsp&nbsp&nbsp&nbsp<br>";
                     })
                     .style("opacity", 0).transition().duration(timer * 3).style("opacity", 100);
             } else {

             }
         } else {

             d3.selectAll(".addedText" + r).remove();

         }
     })
 }

 var orderedList = [];

 function nameDiv(name) {
     var descript = d3.select(".nodeName")
     descript.select('text').html('' + name + '<hr>')
 }

 d3.xml("data/Dynamo_Library.xml", function (error, data) {

     $("#searchBox").keyup(function (event) {

         if (event.keyCode == 13) {
             handleClick();
         }
     });
     d3.select("#searchBox").on("blur", function () {

         handleClick();
     })

     function handleClick() {
         imcount = [];
         st = (document.getElementById("searchBox").value).split(" ");
         console.log(st)

         searchSquish();

     }

     function lDistance(a, b) {
         var al = (a.toLowerCase())
         var bl = (b.toLowerCase())

         if (bl.indexOf(al) > -1) {
             return true;
         } else {
             return false;
         }
     };

     function searchSquish() {

         d3.selectAll(".imageTiles")
         if (st == "") {
             nameDiv("Welcome to the Dynamo Dictionary!")
         } else {
             nameDiv("Search: " + st)
         }
         d3.select(".nodeHier").html("<b>Parent Category:</b><br>&nbsp&nbsp  Search Bar<br><br><hr>")

         var ims = d3.selectAll(".imageTiles").selectAll("img")
         var imcount = [];

         ims[0].forEach(function (q, w) {
             var qq = d3.select(q).data()[0];
             checkString = qq.Name + " " + qq.FullCategoryName + " " + qq.Description + " " + qq.SearchTags;
             qq.Categories.forEach(function (d, i) {
                 checkString += " " + d
             })
             var searchCount = 0;
             for (var j = 0; j < st.length; j++) {
                 if (lDistance(st[j], checkString)) {
                     searchCount++;
                 }
             }

             if (searchCount == st.length) {
                 imageActivate(q, w, timer);
             } else {
                 imageDeactivate(q, w, timer);
             }
         })
         tilize();
     }

     if (error) throw error;
     xmldata = data;

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
             nd["activated"] = true;
             nd["Name"] = cn.querySelector("Name").textContent;

             nd["Group"] = cn.querySelector("Group").textContent;

             nd["Description"] = cn.querySelector("Description").textContent;
             getParam("Inputs", "InputParameter");
             getParam("Outputs", "OutputParameter");
             nd["SmallIcon"] = cn.querySelector("SmallIcon").textContent.trim();
             nd["LargeIcon"] = cn.querySelector("LargeIcon").textContent.trim();
             nd["SearchTags"] = cn.querySelector("SearchTags").textContent.trim();

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

     var tempCat = {};

     allData.forEach(function (d, i) {
         var tempCat = hierarchy;
         var c = d.Categories;
         if (c.length > maxhier) {
             maxhier = c.length;
         }
         c.forEach(function (e, j) {
             if (tempCat[e] == undefined) {
                 tempCat[e] = [];
             }
             tempCat = tempCat[e];

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

     function objectify(ad, q) {
         if (Array.isArray(ad)) {
             var ml = [];
             ad.forEach(function (d, i) {
                 var c = d.Categories;
                 if (q < c.length) {
                     if (ml.length == 0) {
                         ml.push({
                             "Name": c[q],
                             "Arr": [d],
                             "Parent": c[Math.max(0, q - 1)],

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
                                 "Arr": [d],
                                 "Parent": c[Math.max(0, q - 1)]
                             })
                         }
                     }
                 } else {
                     if (ml.length == 0) {
                         ml.push({
                             "Name": d.Group,
                             "Arr": [d],
                             "Parent": c[Math.max(0, q - 1)]
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
                                 "Arr": [d],
                                 "Parent": c[Math.max(0, q - 1)]
                             })
                         }
                     }
                 }
                 if (i == ad.length - 1) {
                     ml.forEach(function (h, z) {
                         sortArrayOfObjectsByKey(h.Arr, "Name");
                     })
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

     var newHierarchy = {};
     var subList = [];

     color_scale = d3.scale.linear()
         .domain([1, maxhier + 1])
         .range(["#222222", "#666666"])
         .clamp(true);
     col = d3.rgb(70, 130, 180).brighter();

     color_scaleA = d3.scale.linear()
         .domain([1, maxhier + 1])
         .range(["steelblue", col])
         .clamp(true);

     var addAccordion = function (li, appendel, iteration) {
         var ogo = {
             "Name": ""
         }
         li.forEach(function (obj, j) {
             var bk0 = appendel.append("button").attr("class", "accordion button" + iteration + "")
             bk0.data([obj]).enter()
             var catdiv = appendel.append("div").attr("class", "panel iteration" + iteration + "")

             bk0
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
                     imcount = [];
                     if (obj.Arr != undefined) {
                         d3.select(".nodeName").html()
                         var descript = d3.select(".nodeName")
                         descript.select('text').html('' + obj.Name + '<hr>')

                         var tname = d3.selectAll(".seeAlso").html("<b>Nodes</b><br><br>");

                         d3.selectAll(".nodeDesc").html("")
                         d3.selectAll(".nodeIn").html("")
                         d3.selectAll(".nodeOut").html("")
                         d3.selectAll(".nodeGroup").html("")
                         d3.selectAll(".nodeHier").html("")
                         d3.selectAll(".inDepth").html("")
                         d3.selectAll(".exampleFile").html("")

                         d3.select(".nodeHier").html("<b>Parent Category:</b><br>&nbsp&nbsp  " + obj.Parent + "<br><br><hr>")

                         var ims = d3.selectAll(".imageTiles").selectAll("img")

                         ims[0].forEach(function (q, w) {
                             if (d3.select(q).data()[0].Categories[iteration - 1] == obj.Name || (d3.select(q).data()[0].Group == obj.Name && d3.select(q).data()[0].Categories[Math.max(0, iteration - 2)] == obj.Parent)) {
                                 if (iteration > 1) {
                                     imageActivate(q, w, 800)
                                 } else {
                                     imageActivate(q, w, 0)
                                 }
                             } else {
                                 if (iteration > 1) {
                                     imageDeactivate(q, w, 800)
                                 } else {
                                     imageDeactivate(q, w, 0)
                                 }
                             }
                             if (w == ims[0].length - 1) {
                                 tilize();
                             }
                         })
                     } else {
                         d3.selectAll(".imageTiles").selectAll("img").attr("width", "0")
                         var ddd = d3.select(this);
                         var displayObject = (obj)
                         updateInfo(displayObject);

                     }
                     accordionActivate(this, iteration, obj);

                     if (d3.select(this).classed("active") == false && obj.Arr != undefined) {
                         d3.select(this).style("background-color", "gray")
                     }

                 })
                 .style("font-size", 12 + "px")
                 .style("color", "white")
                 .style("padding-left", 10 + (iteration) * 20 + "px")
                 .style("padding-right", "18px")

             bk0.html("" + obj["Name"] + "")

             if (obj["Arr"] != undefined) {
                 obj.Arr.forEach(function (k, z) {
                     if (k["FullCategoryName"] != undefined) {
                         orderedList.push(k)
                         var spanner = bk0.append("span").attr("class", "middle")
                         var image = getImagePath(k)

                     }
                 })

                 addAccordion(obj.Arr, catdiv, iteration + 1)
             } else {

                 bk0.html("")
                 var spanner = bk0.append("span").attr("class", "middle")

                 var image = getImagePath(obj)
                 spanner.append("img").attr("src", image).attr("width", 20).attr("align", "middle").attr("onerror", "this.onerror=null;this.src='images/src/icon.png';")

                 var override = function () {
                     var tl = "(";
                     if (obj["Inputs"] != undefined) {
                         obj["Inputs"].forEach(function (e, k) {
                             if (k < obj["Inputs"].length - 1) {
                                 tl += "" + e.Name + ", ";
                             } else {
                                 tl += "" + e.Name + ")";
                             }
                         })
                     }
                     return tl;
                 }();

                 if (li.length > 1) {
                     if (obj.Name == ogo.Name || obj.Name == li[(j + 1) % (li.length)].Name) {
                         spanner.append('text').text(' ' + obj.Name + '').append('text').text(' ' + override + '').style("color", "lightgray")
                     } else {
                         spanner.append('text').text(' ' + obj.Name + '')
                     }
                 } else {
                     spanner.append('text').text(' ' + obj.Name + '')
                 }

             }
             ogo = obj;
         })

     };

     var bod = leftdiv;

     addAccordion(mainlist, bod, 1)
     mainPages();

 });

 function mainPages() {
     var imdiv = rightdiv.append("div").attr("class", "imageTiles").style("margin-left", "3%").style("margin-right", "1%")
     orderedList.forEach(function (d, i) {
         var image = getImagePath(d)

         var tile = imdiv.append("span").append("img").attr("src", image).attr("height", 30).attr("width", 30).attr("src", image).attr("onerror", "this.onerror=null;this.src='images/src/icon.png';").data([d]).enter()
         var tname = d3.selectAll(".seeAlso").html("<b>&nbsp&nbspNodes</b><br><br>");
         d3.selectAll(".imageTiles").selectAll("img")
             .on("mouseover", function (d) {
                 d3.select("body").style("cursor", "pointer")
                 d3.select(this).transition().duration(0).style("background-color", d3.rgb(70, 130, 180));
                 if (matrify == true) {
                     var tname = "<hr><br><b>Node:&nbsp&nbsp</b>" + d.Name + "<br><br>";

                     if (d3.select(".nodeName").selectAll("text").text() == "Welcome to the Dynamo Dictionary!") {
                         tname = "<b>Node:&nbsp&nbsp</b>" + d.Name + "<br><br>";
                     }
                     d3.selectAll(".seeAlso").html(tname);
                 }
             })
             .on("mouseout", function (d) {
                 d3.select("body").style("cursor", "default")

                 var tname = "<hr><br><b>Nodes</b><br><br>";
                 if (d3.select(".nodeName").selectAll("text").text() == "Welcome to the Dynamo Dictionary!") {
                     tname = "<b>Nodes</b><br><br>";
                 }
                 d3.selectAll(".seeAlso").html(tname);

                 d3.select(this).transition().duration(0).style("background-color", d3.rgb(34, 34, 34));

             })
             .on("click", function (d) {
                 updateInfo(d)
             });
     })
 }

 function getImagePath(ob) {

     var image = 'images\\' + ob.SmallIcon;
     var splitter = image.split("src");
     if (splitter.length < 2) {
         image = "images/src/icon.png";
     }
     return image;
 }

 function updateInfo(ob) {
     d3.select(".nodeName").html()

     var descript = d3.select(".nodeName")
     descript.select('text').html('' + ob.Name + '<hr>')

     d3.selectAll(".imageTiles").selectAll("img").attr("width", 0)
     d3.selectAll(".addedText").remove();
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

     d3.select(".nodeGroup").html("<b>Group:</b><br>&nbsp&nbsp   " + ob.Group)
     d3.select(".nodeDesc").html("<br><b>Description:</b><br>&nbsp&nbsp  " + ob.Description)

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
             .on("click", function () {
                 alert("functionality not yet available.")
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
             .on("click", function () {
                 alert("functionality not yet available.")
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
             .on("click", function () {
                 alert("functionality not yet available.")
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
             .on("click", function () {
                 alert("functionality not yet available.")
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

     if (related.length > 0) {
         var tname = d3.selectAll(".seeAlso").html("<hr><br><b>See Also</b><br><br>");

     }

     related.forEach(function (t, u) {

         var image = getImagePath(t)

         var im = d3.selectAll(".seeAlso").append("img").style("margin-left", "5px").attr("height", 30).attr("width", 30).attr("src", image).attr("onerror", "this.onerror=null;this.src='images/src/icon_offset.png';")
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
 }
