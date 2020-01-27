//Install my dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

const app = express();
const router = express.Router();

//Set up views so we can render pages
//Utilising EJS as a templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Sets up public folder
app.use('/public', express.static(__dirname + "/public"));

//Configure Body Parser for Posts
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function (req, res) {
	function getNetworkData(callback) {
		//GET request to firebase here
		res.render('loading', {});

		callback();
	}
	//Callback which is called after the network data is collected
	getNetworkData(function () {
		console.log("Loading")
		res.redirect('index', {});
	})
})

app.listen(port, () => console.log(`Server started on port ${port}`));