$(document).ready(function () {
    // Create DataTable
    var table = $('#example').DataTable({
        dom: 'Bfrtip',
        buttons: ['excel']
    });
 
    // Create the chart with initial data
    var container = $('<div/>').insertBefore(table.table().container());
 
    var chart = Highcharts.chart(container[0], {
        chart: {
            type: 'pie',
        },
        title: {
            text: 'Father State of Origin / Gender / Age',
            
        },
        series: [
            {
                size: 150,
                center: [200, 150],
                data: chartData(table),
            },
            {
                size: 150,
                center: [500, 150],
                data: chartData1(table),
            },
            {
                size: 150,
                center: [800, 150],
                data: chartData2(table),
            }
        ],
    });
 
    // On each draw, update the data in the chart
    table.on('draw', function () {
        chart.series[0].setData(chartData(table));
    }
    
    );
});
 
function chartData(table) {
    var counts = {};
    
    // Count the number of entries for each position
    table
        .column(8, { search: 'applied' })
        .data()
        .each(function (val) {
            if (counts[val]) {
                counts[val] += 1;
            } else {
                counts[val] = 1;
            }
        });
 
    // And map it to the format highcharts uses
    return $.map(counts, function (val, key) {
        return {
            name: key,
            y: val,
        };
    });
}

function chartData1(table) {
    var counts = {};
    
    // Count the number of entries for each position
    table
        .column(4, { search: 'applied' })
        .data()
        .each(function (val) {
            if (counts[val]) {
                counts[val] += 1;
            } else {
                counts[val] = 1;
            }
        });
 
    // And map it to the format highcharts uses
    return $.map(counts, function (val, key) {
        return {
            name: key,
            y: val,
        };
    });
}


function chartData2(table) {
    var counts = {};
    
    // Count the number of entries for each position
    table
        .column(6, { search: 'applied' })
        .data()
        .each(function (val) {
            if (counts[val]) {
                counts[val] += 1;
            } else {
                counts[val] = 1;
            }
        });
 
    // And map it to the format highcharts uses
    return $.map(counts, function (val, key) {
        return {
            name: key,
            y: val,
        };
    });
}
