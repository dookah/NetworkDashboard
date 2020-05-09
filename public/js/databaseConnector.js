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
    networkInformation.current.meraki.merakiCount = getLatestInfo(snapshot.val().networkDevices.ms) + getLatestInfo(snapshot.val().networkDevices.mr) + getLatestInfo(snapshot.val().networkDevices.mx) + getLatestInfo(snapshot.val().networkDevices.mg);

    //Grab the device info
    networkInformation.current.devices.online = getLatestInfo(snapshot.val().networkClients.online);
    networkInformation.current.devices.offline = getLatestInfo(snapshot.val().networkClients.offline);


    //call the render function
    renderPage();
});
dnacDeviceInfo.on('value', function (snapshot) {
    networkInformation.current.dnac.apCount = getLatestInfo(snapshot.val().networkDevices.aps);
    networkInformation.current.dnac.switchCount = getLatestInfo(snapshot.val().networkDevices.sw);
    networkInformation.current.dnac.routerCount = getLatestInfo(snapshot.val().networkDevices.routers);
    networkInformation.current.dnac.wlcCount = getLatestInfo(snapshot.val().networkDevices.wlc);
    // Add all the above fields
    networkInformation.current.dnac.ciscoCount = getLatestInfo(snapshot.val().networkDevices.aps) + getLatestInfo(snapshot.val().networkDevices.sw) + getLatestInfo(snapshot.val().networkDevices.routers) + getLatestInfo(snapshot.val().networkDevices.wlc);
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
    //returns the value of the newest datapoint
    return object[lastIndex];
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
    //online component render
    onlineDevices.message = networkInformation.current.devices.online;
    offlineDevices.message = networkInformation.current.devices.offline;



    myDeviceChart.data.datasets[0].data[0] = networkInformation.current.meraki.msCount + networkInformation.current.dnac.switchCount;
    myDeviceChart.data.datasets[0].data[1] = networkInformation.current.meraki.mxCount + networkInformation.current.dnac.routerCount;
    myDeviceChart.data.datasets[0].data[2] = networkInformation.current.meraki.mrCount + networkInformation.current.dnac.apCount;
    myDeviceChart.data.datasets[0].data[3] = networkInformation.current.dnac.wlcCount;
    myDeviceChart.update();
}


//Vue component for the Network Devices
var networkDevices = new Vue({
    el: '#networkDevices',
    data: {
        message: "Loading",
        change: "+33%"
    }
})

var onlineDevices = new Vue({
    el: '#onlineDevices',
    data: {
        message: "Loading"
    }
})

var offlineDevices = new Vue({
    el: '#offlineDevices',
    data: {
        message: "Loading"
    }
})

var deviceChartContext = document.getElementById('deviceChart').getContext('2d');
var myDeviceChart = new Chart(deviceChartContext, {

    type: 'horizontalBar',
    data: {
        labels: ["", "", "", ""],
        datasets: [{
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
            data: [1, 1, 1, 1]
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true
                }
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