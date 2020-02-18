
//Get the context of all the graphs on the page
var numOfDevCtx = document.getElementById('throughputChart').getContext('2d');
var sentimentCtx = document.getElementById('sentimentChart').getContext('2d');
var deviceTypeCtx = document.getElementById('deviceChart').getContext('2d');


var numOfDevicesChart = new Chart(sentimentCtx, {
    // The type of chart we want to create
    type: 'doughnut',
    // The data for our dataset
    data: {
        //X Axis tags, Left to Right
        labels: ['Happy', 'Unhappy'],
        datasets: [{
            //Line Background Transparent
            //Date from left to right, should be length 7
            data: [66, 33],
            pointHoverRadius: 5,
            pointBackgroundColor: '#9f00ff',
            lineTension: 0.35,
            borderColor: "#2f91e5",
            borderWidth: 2


        }]
    },

    // Configuration options go here
    options: {
        // Disable the label 
        legend: {
            display: false
        },

    }
});




//Grab the current date
var date = new Date();
//Array for days of the week
var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

//Set the context to a Chart object
var numOfDevicesChart = new Chart(numOfDevCtx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
        //X Axis tags, Left to Right
        labels: [days[date.getDay() - 7], days[date.getDay() - 6], days[date.getDay() - 5], days[date.getDay() - 4], days[date.getDay() - 3], days[date.getDay() - 2], 'Now'],
        datasets: [{
            //Line Background Transparent
            backgroundColor: 'rgb(255, 99, 132, 0)',
            //Date from left to right, should be length 7
            data: [0, 10, 5, 2, 20, 30, 45],
            pointHoverRadius: 5,
            pointBackgroundColor: '#9f00ff',
            lineTension: 0.35,
            borderColor: "#2f91e5",
            borderWidth: 4,
            borderCapStyle: "round"

        }]
    },

    // Configuration options go here
    options: {
        // Disable the label 
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                gridLines: {
                    drawOnChartArea: false
                }
            }],
            yAxes: [{
                gridLines: {
                    drawOnChartArea: false
                }
            }]
        }
    }
});


//Set the context to a Chart object
var deviceTypeChart = new Chart(deviceTypeCtx, {
    // The type of chart we want to create
    type: 'bar',
    // The data for our dataset
    data: {
        labels: ['APs', 'Switches', 'Routers', 'Firewalls'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: '#18ca8e',
            borderColor: '#9f00ff',
            data: [37, 10, 5, 2],
            barPercentage: 0.3,
            barThickness: 30,
            barPercentage: 0.3
        }]
    },

    // Configuration options go here
    options: {
        aspectRatio: 1,
        barPercentage: 0.3,
        barThickness: 30,
        barPercentage: 0.3,
        legend: {
            display: false,
        },
        scales: {
            xAxes: [{
                gridLines: {
                    drawOnChartArea: false
                },
                barPercentage: 0.3
            }],
            yAxes: [{
                gridLines: {
                    drawOnChartArea: false
                }
            }]
        }
    }
});
