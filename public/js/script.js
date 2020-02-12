

//Assign the graph context to a variable so we can edit it
var numOfDevCtx = document.getElementById('myChart').getContext('2d');
var date = new Date();
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
            //Color of the Line
            borderColor: '#0d274d',
            //Date from left to right, should be length 7
            data: [0, 10, 5, 2, 20, 30, 45],
            pointRadius: 0,
            pointHoverRadius: 5,
            pointBackgroundColor: '#9f00ff',
            lineTension: 0.3,
            backgroundColor: '#00bceb'
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
function openModal(id) {
    $('#' + id).before('<div id="' + id + '-placeholder"></div>').detach().appendTo('body').removeClass('hide');
}
function closeModal(id) {
    $('#' + id).detach().prependTo(('#' + id + '-placeholder')).addClass('hide');
}