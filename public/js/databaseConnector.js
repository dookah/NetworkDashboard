let config = {
    apiKey: "AIzaSyD8szGZGGZsuruITbUe6VWS-vZMq492bKI",
    authDomain: "dashboard-cisco.firebaseapp.com",
    databaseURL: "https://dashboard-cisco.firebaseio.com",
    projectId: "dashboard-cisco",
    storageBucket: "dashboard-cisco.appspot.com",
    messagingSenderId: "10883792064",
    appId: "1:10883792064:web:bb39a00f4f0887f914c125",
    measurementId: "G-462T1ZCYCQ"
};


//Object to hold the current state of the network
let networkInformation = {
    current: {
        meraki: {
            msCount: 0, //Switches
            mxCount: 0, //Firewalls
            mgCount: 0, //Cellular Gateway
            mrCount: 0, //Wireless
            merakiCount: 0
        },
        dnac: {
            switchCount: 0, //Switches
            apCount: 0, //Access Points
            routerCount: 0, //Routers
            wlcCount: 0, //wireless LAN controller
            ciscoCount: 0
        },
        devices: {
            online: 0,
            offline: 0,
            os: [0, 0, 0] //[Windows, Mac, Linux]
        }
    }
}


// Initialize Firebase
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();


//Holds the total device count for each category
let totalMerakiDeviceCount = null;
let totalDnaDeviceCount = null;

//References Meraki Devices entry in Firebase
var merakiDeviceInfo = firebase.database().ref('/meraki');
var dnacDeviceInfo = firebase.database().ref('/dnac');

//On Firebase updating call this fuction
merakiDeviceInfo.on('value', function (snapshot) {
    networkInformation.current.meraki.msCount = getLatestInfo(snapshot.val().networkDevices.ms);
    networkInformation.current.meraki.mrCount = getLatestInfo(snapshot.val().networkDevices.mr);
    networkInformation.current.meraki.mxCount = getLatestInfo(snapshot.val().networkDevices.mx);
    networkInformation.current.meraki.mgCount = getLatestInfo(snapshot.val().networkDevices.mg);
    // Add all the above fields
    networkInformation.current.meraki.merakiCount = getLatestInfo(snapshot.val().networkDevices.ms)[0] + getLatestInfo(snapshot.val().networkDevices.mr)[0] + getLatestInfo(snapshot.val().networkDevices.mx)[0] + getLatestInfo(snapshot.val().networkDevices.mg)[0];

    //Grab the device info
    networkInformation.current.devices.online = getLatestInfo(snapshot.val().networkClients.online);
    networkInformation.current.devices.offline = getLatestInfo(snapshot.val().networkClients.offline);
    networkInformation.current.devices.os = [getLatestInfo(snapshot.val().networkClients.OS.Windows), getLatestInfo(snapshot.val().networkClients.OS.Mac), getLatestInfo(snapshot.val().networkClients.OS.Linux)]
    
    myLineChart.data.datasets[0].data = getLatestFiveEntries(snapshot.val().networkClients.OS.Windows)[0].reverse()
    myLineChart.data.datasets[1].data = getLatestFiveEntries(snapshot.val().networkClients.OS.Mac)[0].reverse()
    myLineChart.data.datasets[2].data = getLatestFiveEntries(snapshot.val().networkClients.OS.Linux)[0].reverse()

    myLineChart.data.labels = getLatestFiveEntries(snapshot.val().networkClients.OS.Windows)[1].reverse()
    //call the render function
    renderPage();
});
dnacDeviceInfo.on('value', function (snapshot) {
    networkInformation.current.dnac.apCount = getLatestInfo(snapshot.val().networkDevices.aps);
    networkInformation.current.dnac.switchCount = getLatestInfo(snapshot.val().networkDevices.sw);
    networkInformation.current.dnac.routerCount = getLatestInfo(snapshot.val().networkDevices.routers);
    networkInformation.current.dnac.wlcCount = getLatestInfo(snapshot.val().networkDevices.wlc);
    // Add all the above fields
    networkInformation.current.dnac.ciscoCount = getLatestInfo(snapshot.val().networkDevices.aps)[0] + getLatestInfo(snapshot.val().networkDevices.sw)[0] + getLatestInfo(snapshot.val().networkDevices.routers)[0] + getLatestInfo(snapshot.val().networkDevices.wlc)[0];
    renderPage();
});


//Function which returns sorted keys of a JSON object passed in
function getSortedKeys(object) {
    //returns a sorted array of dates, from oldest to newest
    return Object.keys(object).sort();
}

//Function gets value of newest value in object
function getLatestInfo(object) {
    //get an arr of all the keys in the object sorted
    let sortedKeys = getSortedKeys(object);
    //finds the newest datapoint in the object 
    let lastIndex = sortedKeys[(sortedKeys.length) - 1];

    // Index 0 : Num of Devices, Index 1: Timestamp of when that was taken
    return [object[lastIndex], lastIndex];
}



//Function gets value of newest value in object
function getLatestFiveEntries(object) {
    //get an arr of all the keys in the object sorted
    let sortedKeys = getSortedKeys(object);

    let listOfData = [[],[]]
    listOfData[0].push(object[sortedKeys[(sortedKeys.length) - 1]]);
    listOfData[0].push(object[sortedKeys[(sortedKeys.length) - 2]]);
    listOfData[0].push(object[sortedKeys[(sortedKeys.length) - 3]]);
    listOfData[0].push(object[sortedKeys[(sortedKeys.length) - 4]]);
    listOfData[0].push(object[sortedKeys[(sortedKeys.length) - 5]]);

    listOfData[1].push(formatDate(sortedKeys[(sortedKeys.length) - 1]));
    listOfData[1].push(formatDate(sortedKeys[(sortedKeys.length) - 2]));
    listOfData[1].push(formatDate(sortedKeys[(sortedKeys.length) - 3]));
    listOfData[1].push(formatDate(sortedKeys[(sortedKeys.length) - 4]));
    listOfData[1].push(formatDate(sortedKeys[(sortedKeys.length) - 5]));

    console.log(listOfData)
    // Index 0 : Num of Devices, Index 1: Timestamp of when that was taken
    return listOfData;
}

function getDayBefore(object) {

    let sortedKeys = getSortedKeys(object);
    let lastIndex = sortedKeys[(sortedKeys.length) - 2];
    return object[lastIndex];
}

function calculatePercentageChange(previous, current) {
    //calculate the how much change has occured between the two numbers
    let increase = current - previous;
    //calculate the percentage increase/decrease of that change
    let percentageIncrease = (increase / previous) * 100;
    //return the percentageIncrease/Decrease
    return percentageIncrease;
}

function renderPage() {
    //networkDevices component render
    networkDevices.message = networkInformation.current.meraki.merakiCount + networkInformation.current.dnac.ciscoCount;
    

    //Online Component Render
    onlineDevices.message = networkInformation.current.devices.online[0];
    onlineDevices.date = formatDate(networkInformation.current.devices.online[1]);

    //Offline Component Render
    offlineDevices.message = networkInformation.current.devices.offline[0];
    offlineDevices.date = formatDate(networkInformation.current.devices.offline[1]);

    //Popular OS Component Render
    popularOS.message = findPopularOS(networkInformation.current.devices.os);
    popularOS.date = formatDate(networkInformation.current.devices.os[0][1])

    //--------  Update Charts on page -------
    //---- Update Device Histogram ------
    myDeviceChart.data.datasets[0].data[0] = networkInformation.current.meraki.msCount[0] + networkInformation.current.dnac.switchCount[0];
    myDeviceChart.data.datasets[0].data[1] = networkInformation.current.meraki.mxCount[0] + networkInformation.current.dnac.routerCount[0];
    myDeviceChart.data.datasets[0].data[2] = networkInformation.current.meraki.mrCount[0] + networkInformation.current.dnac.apCount[0];
    myDeviceChart.data.datasets[0].data[3] = networkInformation.current.dnac.wlcCount[0];  
    myDeviceChart.update();

    //---- Update OS Chart ----
    //Windows


    myLineChart.update();

    //---- Update Sentimeter ---- 
}



function findPopularOS(arr){
    //holds the most popular os
    let currentOS = ""
    //max amount of deices
    let currentCounter = 0;
    //Loop through the array
    for(let i = 0; i < arr.length; i++){
        //If the current device amount is higher than previous found
        if (arr[i][0] > currentCounter){
            //update the highest amount
            currentCounter = arr[i][0]
            //set the most popular os depending on index
            if(i == 0){
                currentOS = 'Windows'
            } if (i == 1){
                currentOS = 'Mac'
            } if (i == 2){
                currentOS = 'Linux'
            }
        }
    }

    return currentOS;
}


//Vue component for the Network Devices
var networkDevices = new Vue({
    el: '#networkDevices',
    data: {
        message: "Loading",
        date: "Last Updated: "
    }
})

var onlineDevices = new Vue({
    el: '#onlineDevices',
    data: {
        message: "Loading",
        date: "Loading"
    }
})

var offlineDevices = new Vue({
    el: '#offlineDevices',
    data: {
        message: "Loading",
        date: "Loading"
    }
})

var popularOS = new Vue({
    el: '#popularOS',
    data: {
        message : 'Loading',
        date: 'Loading'
    }
})


var deviceChartContext = document.getElementById('deviceChart').getContext('2d');
var myDeviceChart = new Chart(deviceChartContext, {

    type: 'horizontalBar',
    data: {
        labels: ["", "", "", ""],
        datasets: [{
            barThickness: 400,
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
            data: [1, 1, 1, 1]
        }]
    },
    options: {
        responsive : false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                barThickness: 'flex'
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true
                },
                barThickness: 10
            }]
        },
        legend: {
            display: false
        },

        tooltips: {
            callbacks: {
                label: function (tooltipItem) {
                    return tooltipItem.yLabel;
                }
            }
        }
    }
});


function formatDate(dateString){

    if (dateString === undefined){
        return;
    }

    let SplitString = dateString.split('')
    let year = SplitString[0] + SplitString[1] + SplitString[2] + SplitString[3]
    let month = SplitString[4] + SplitString[5]
    let day = SplitString[6] + SplitString[7]
    let hour = SplitString[8] + SplitString[9]
    let minute = SplitString[10] + SplitString[11]

    return (hour + ':' + minute  + ' '+ day + '/' + month )
}


let osTrendsContext = document.getElementById('osTrends').getContext('2d');
var myLineChart = new Chart(osTrendsContext, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {fill: false,
             strokeColor: "rgba(220,220,220,1)",
             data: [1,2,3,4,5]
            },
            {fill: false,
             strokeColor: "rgba(151,187,205,1)",
             data: [5,4,3,2,1]
            },
            {fill: false,
            borderColor : '#3cba9f',
             data: [1,4,3,3,4]
            }
        ]
    },
    options: {
        legend: {
            display: false
        }
    }
});

