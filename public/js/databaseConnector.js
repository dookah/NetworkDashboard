var firebaseConfig = {
    apiKey: "AIzaSyD8szGZGGZsuruITbUe6VWS-vZMq492bKI",
    authDomain: "dashboard-cisco.firebaseapp.com",
    databaseURL: "https://dashboard-cisco.firebaseio.com",
    projectId: "dashboard-cisco",
    storageBucket: "dashboard-cisco.appspot.com",
    messagingSenderId: "10883792064",
    appId: "1:10883792064:web:bb39a00f4f0887f914c125",
    measurementId: "G-462T1ZCYCQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database();

firebase.database().ref('/meraki').once('value').then(function(snapshot) {
    //Prints meraki devices
    console.log(snapshot.val().devices.count)
});