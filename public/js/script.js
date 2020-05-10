
let closeButton = document.getElementById('close').addEventListener('click', () => {
    document.getElementById('modal').classList.remove('is-active');
})

let settingsButton = document.getElementById('settings').addEventListener('click', () => {
    document.getElementById('modal').classList.add('is-active');
})

var sentimentCtx = document.getElementById('sentimentChart').getContext('2d');

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
            backgroundColor: [
                '#18ca8e',
                '#FF6961'
            ],
            borderColor: [
                '#18ca8e',
                '#FF6961'
            ],
            lineTension: 0.35,
            borderWidth: 2


        }]
    },

    // Configuration options go here
    options: {
        responsive : true,
        // Disable the label 
        legend: {
            display: false
        },

    }
});

