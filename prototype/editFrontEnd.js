require(["d3"], function (Github) {
    var textContent={};
    
    d3.selectAll("#spanToForm")
            .each(function () {
                textContent.text=$(this).html().split("<html>")[0]
    })
    
    d3.select("#prButton").on('click',function(){
        commitChanges(JSON.stringify(textContent, null, 4))
    })
    d3.select('#editButton').on('click', function () {

        d3.selectAll("#spanToForm")
            .each(function () {
                textContent.text=$(this).html().toString()
                textContent.text=textContent.text.split("Best")
                console.log(textContent.text)
                
                console.log(textContent)
                input = $('<input />', {
                    'type': 'text',
                    'name': 'aname',
                    'id': 'spanToForm',
                    'value': textContent.text
                });
            
                $(this).parent().append(input);
                $(this).remove();
                input.focus();

                d3.selectAll("#spanToForm").on('blur', function () {
                    input.blur();
                    $(this).parent().append($('<span id="spanToForm"/>').html($(this).val()));
                    $(this).remove();
                    textContent.text=$(this).val();
                });
            })
        console.log(textContent)
    })
})
