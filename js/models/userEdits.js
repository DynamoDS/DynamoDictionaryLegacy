//require(["d3"], function (Github) {
var textContent = {};

function checkDescription() {

    d3.selectAll("#inDepthDescription")
        .each(function () {
            textContent.text = $j(this).html().split("<html>")[0]
            console.log(textContent)
        })
    
    d3.select("#submitPR").on('click', function () {
        
        
        
//        this will submit the PR to github
//        commitChanges(JSON.stringify(fullJson, null, 4))
        
        
        
        
        
    })
    .on('mouseover',function(){
        d3.select("body").style("cursor","pointer")
    })
    .on('mouseout',function(){
        d3.select("body").style("cursor","default")
    })
    .transition().duration(1000).style("opacity",1.0)
}

function editAttributes() {
    d3.select('#editButton').on('click', function () {
        checkDescription();
        d3.selectAll("#inDepthDescription")
            .each(function () {
            console.log($j(this).html())
                textContent.text = $j(this).html()

                console.log(textContent)
                input = $j('<textarea />', {
                    'type': 'text',
                    'style':'color:gray;',
                    'name': 'aname',
                    'id': 'inDepthDescription',

                    'html': textContent.text
                });

                $j(this).parent().append(input);
                $j(this).remove();
                input.focus();

                d3.selectAll("#inDepthDescription").on('blur', function () {
                    textContent.text = $j(this).val();
                    hitob.inDepth=textContent.text;
                    input.blur();
                    $j(this).parent().append($j('<pre style="color:gray;" id="inDepthDescription"/>').html(textContent.text));
                    $j(this).remove();
                    
                });
            })
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
//window.onbeforeunload = function(){
//  return 'are you sure?'
//};