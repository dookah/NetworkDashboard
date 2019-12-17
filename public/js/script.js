

//Assign the graph context to a variable so we can edit it
var numOfDevCtx = document.getElementById('myChart').getContext('2d');
//Set the context to a Chart object
var numOfDevicesChart = new Chart(numOfDevCtx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
        //X Axis tags, Left to Right
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
            //Line Background Transparent
            backgroundColor: 'rgb(255, 99, 132, 0)',
            //Color of the Line
            borderColor: '#9f00ff',
            //Date from left to right, should be length 7
            data: [0, 10, 5, 2, 20, 30, 45],
            pointRadius: 5,
            pointHoverRadius: 5,
            pointBackgroundColor: '#9f00ff',
            lineTension: 0.4
        }]
    },

    // Configuration options go here
    options: {
        // Disable the label 
        legend: {
            display: false
        }
    }
});

//Assign the graph context to a variable so we can edit it
var deviceTypeCtx = document.getElementById('myChart2').getContext('2d');
//Set the context to a Chart object
var deviceTypeChart = new Chart(deviceTypeCtx, {
    // The type of chart we want to create
    type: 'bar',
    // The data for our dataset
    data: {
        labels: ['APs', 'Switches', 'Routers', 'Firewalls'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: '#9f00ff',
            data: [37, 10, 5, 2],
            barPercentage: 0.3,
            barThickness: 'flex',
            barPercentage: 0.3
        }]
    },

    // Configuration options go here
    options: {
        aspectRatio: 1,
        barPercentage: 0.3,
        barThickness: 'flex',
        barPercentage: 0.3,
        legend: {
            display: false,
        }
    }
});