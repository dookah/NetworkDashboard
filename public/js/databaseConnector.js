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
    meraki : {
        msCount : undefined, //Switches
        mxCount : undefined, //Firewalls
        mgCount : undefined, //Cellular Gateway
        mrCount : undefined, //Wireless
        merakiCount : undefined
    },
    dnac : {
        switchCount : undefined, //Switches
        apCount : undefined,     //Access Points
        routerCount : undefined,  //Routers
        wlcCount : undefined,  //wireless LAN controller
        ciscoCount : undefined
    },
    devices : {
        online : undefined,
        offline : undefined, 
        os : [undefined, undefined, undefined] //[Windows, Mac, Linux]
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
    networkInformation.meraki.msCount = getLatestInfo(snapshot.val().networkDevices.ms);
    networkInformation.meraki.mrCount = getLatestInfo(snapshot.val().networkDevices.mr);
    networkInformation.meraki.mxCount = getLatestInfo(snapshot.val().networkDevices.mx);
    networkInformation.meraki.mgCount = getLatestInfo(snapshot.val().networkDevices.mg);
    // Add all the above fields
    networkInformation.meraki.merakiCount = getLatestInfo(snapshot.val().networkDevices.ms) + getLatestInfo(snapshot.val().networkDevices.mr) + getLatestInfo(snapshot.val().networkDevices.mx) + getLatestInfo(snapshot.val().networkDevices.mg);
    
    //Grab the device info
    networkInformation.devices.online = getLatestInfo(snapshot.val().networkClients.online);

    
    //call the render function
    renderPage();
});
dnacDeviceInfo.on('value', function (snapshot) {
    networkInformation.dnac.apCount = getLatestInfo(snapshot.val().networkDevices.aps);
    networkInformation.dnac.switchCount = getLatestInfo(snapshot.val().networkDevices.sw); 
    networkInformation.dnac.routerCount = getLatestInfo(snapshot.val().networkDevices.routers);
    networkInformation.dnac.wlcCount = getLatestInfo(snapshot.val().networkDevices.wlc);
    // Add all the above fields
    networkInformation.dnac.ciscoCount = getLatestInfo(snapshot.val().networkDevices.aps) + getLatestInfo(snapshot.val().networkDevices.sw) + getLatestInfo(snapshot.val().networkDevices.routers) + getLatestInfo(snapshot.val().networkDevices.wlc);
    renderPage();
});

//Function which returns sorted keys of a JSON object passed in
function getSortedKeys(object){
    //returns a sorted array of dates, from oldest to newest
    return Object.keys(object).sort();
}

//Function gets value of newest value in object
function getLatestInfo(object){
    //get an arr of all the keys in the object sorted
    let sortedKeys = getSortedKeys(object);
    //finds the newest datapoint in the object 
    let lastIndex = sortedKeys[(sortedKeys.length)-1];
    //returns the value of the newest datapoint
    return object[lastIndex];
}

//Function to update the page last updated
function updatePageTimer(){

}

function renderPage(){
    networkDevices.message = networkInformation.meraki.merakiCount + networkInformation.dnac.ciscoCount;
    onlineDevices.message = networkInformation.devices.online;
}


//Vue component for the Network Devices
var networkDevices = new Vue({
    el: '#networkDevices',
    data: {
      message: "Loading"
    }
})

var onlineDevices = new Vue({
    el : '#onlineDevices',
    data : {
        message : "Loading"
    }
})