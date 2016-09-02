//require(["d3"], function (Github) {
var textContent = {};

function prepDate() {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var hours = dateObj.getUTCHours();
    var mins = dateObj.getUTCMinutes();
    var secs = dateObj.getUTCSeconds();
    return year + "-" + month + "-" + day + "-" + hours + "-" + mins + "-" + secs;
}

function checkDescription() {
    d3.selectAll("#inDepthDescription").each(function () {
        textContent.text = $j(this).html().split("<html>")[0]
            //        console.log(textContent)
    })
}

function updateText() {
    //    console.log(hitob)
    checkDescription();
    d3.selectAll("#inDepthDescription").each(function () {
        textContent.text = $j(this).html()
            //        console.log(textContent)
        input = $j('<textarea />', {
            'type': 'text'
            , 'style': 'color:gray;'
            , 'name': 'aname'
            , 'id': 'inDepthDescription'
            , 'html': textContent.text
        });
        $j(this).parent().append(input);
        $j(this).remove();
        input.focus();
//                console.log(hitob,currob)
//        console.log(currob, hitob, fullJson[1])
        var pathList = []
        currob["Categories"].forEach(function (d) {
            pathList.push(d)
        })
        pathList.push(currob["Group"])
        pathList.join('/');
//                console.log(Object.keys(hitob).length)
        if (Object.keys(hitob).length==0) {
            hitob = {
                "Name": currob["Name"]
                , "categories": currob["Categories"]
                , "dynFile": []
                , "imageFile": []
                , "folderPath": pathList
                , "inDepth": "..."
                , "index": fullJson.length
            };
        }
//        console.log(fullJson[fullJson.length-1])
        fullJson.push(hitob)
         d3.selectAll("#inDepthDescription").on('blur', function () {
            textContent.text = $j(this).val();
            hitob.inDepth = textContent.text;
            input.blur();
            $j(this).parent().append($j('<pre style="color:gray;" id="inDepthDescription"/>').html(textContent.text));
            $j(this).remove();
        });
    })
}

function editAttributes() {
    d3.select('#editButton').on('click', function () {
        prFlash();
        branchPopup()
    })
}

function dateString() {
    var date = new Date(Date.now());
    var millis = date.getMilliseconds();
    var secs = date.getSeconds();
    var minutes = date.getMinutes();
    var hr = date.getHours();
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    //    ////////console.log(day, monthNames[monthIndex], year);
    return ([year, monthIndex, day, hr, minutes, secs].join('-'))
        //    document.write(day + ' ' + monthNames[monthIndex] + ' ' + year);
}

function dataURItoBlob(dataURI, callback) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab]);
    return bb;
}

function clearImFile() {
    $j("#imageFileLoader").val('');
}

function clearDynFile() {
    $j("#dynFileLoader").val('');
}

function renameFiles(arrayOfFilenames) {
    var nameTracker = {}
        , namer = function (fileName, num) {
            return fileName + "(" + num + ")"
        };
    return arrayOfFilenames.map(function (name) {
        // extension name
        var extension = nameTracker[name] || 0;
        // how many times filename is used
        nameTracker[name] = extension + 1;
        // 0 return true, if not proceed...
        if (!extension) {
            return name;
        }
        // while the key exists
        keyName = namer(name, extension);
        while (nameTracker[keyName]) {
            keyName = namer(name, extension++);
        }
        nameTracker[keyName] = 1;
        return keyName;
    });
};

function checkNew(file, st) {
    console.log(hitob)
    var str = file.name;
    if (newFile) {
        var arr = hitob[st];
        var blankArr = JSON.parse(JSON.stringify(arr))
        console.log(blankArr)
        blankArr.push(file.name.split('.')[0])
            //        console.log(arr, Array.isArray(arr))
        var newarr = renameFiles(blankArr);
        str = newarr.pop();
        console.log(str, blankArr)
        str += '.' + file.name.split('.')[1]
    }
    return str;
}

function loadImage() {
    require(["fileSaver"], function (fs) {
        file = document.querySelector('#imageFileLoader').files[0];
        reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file); //reads the data as a URL
        }
        reader.onloadend = function () {
            ilc = {
                d: reader.result
                , f: file
            };
            if (newFile) {
                newic = true
            }
        }
    })
}

function loadDyn() {
    require(["fileSaver"], function (fs) {
        file = document.querySelector('#dynFileLoader').files[0];
        reader = new FileReader();
        if (file) {
            reader.readAsText(file); //reads the data as a URL
        }
        reader.onloadend = function () {
            dlc = reader.result;
            if (newFile) {
                newdc = true
            }
            //            if (newFile) {
            //                eOb[hitob.index][ipindex]["dynName"] +=prepDate();
            //            }
        }
    })
}
var prOut = function () {
    d3.select("#submitPR").style('display', 'block').transition().duration(400).style("opacity", 0)
}
var prFlash = function () {
    d3.select("#submitPR").style('display', 'block').transition().duration(400).style("opacity", 1)
}
window.onbeforeunload = function () {
    if (d3.select("#submitPR").style("opacity") > 0 && submittedpr == false) {
        prFlash();
        return 'sure?'
    }
};