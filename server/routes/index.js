var express = require('express'),
	path = require('path');
var router = express.Router();

router.get("/endpoint", (req, res, next) => {
	res.json({
		'title': 'Welcome to Cat Facts!',
		'message': 'A group of kittens is called a \'kindle\'!',
		'link': 'https://www.mikelseverson.com',
		'image' : {
			'url': 'https://s-media-cache-ak0.pinimg.com/736x/48/db/2f/48db2f90e1927fc995d6e14d89c7f086.jpg'
		}
	})
});

router.get("/*", (req, res, next) => {
    var file = req.params[0] || "views/index.html";
    res.sendFile(path.join(__dirname, "../public", file));
});

module.exports = router;
