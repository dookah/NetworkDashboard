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

//hold the current network infrastructure information
let networkInformation = {
    meraki : {
        count : undefined,
        ms : undefined, //Switches
        mx : undefined, //Firewalls
        mg : undefined, //
        mr : undefined  //
    },
    dnac : {

    }
}

console.log(networkInformation.meraki.count)
// Initialize Firebase
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

//References Meraki Devices entry in Firebase
var merakiDeviceInfo = firebase.database().ref('/meraki');
var dnacDeviceInfo = firebase.database().ref('/dnac');

//On Firebase updating call this fuction
merakiDeviceInfo.on('value', function (snapshot) {
    let merakiSwitchCount = getLatestInfo(snapshot.val().networkDevices.ms);
    let merakiAPCount = getLatestInfo(snapshot.val().networkDevices.mr);
    let merakiFirewallCount = getLatestInfo(snapshot.val().networkDevices.mx);
    let merakiCellularCount = getLatestInfo(snapshot.val().networkDevices.mg);
});
dnacDeviceInfo.on('value', function (snapshot) {
    let ciscoAPCount = getLatestInfo(snapshot.val().networkDevices.aps);
    let ciscoSwitchCount = getLatestInfo(snapshot.val().networkDevices.sw); 
    let ciscoRouterCount = getLatestInfo(snapshot.val().networkDevices.routers);
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