var express = require('express'),
	path = require('path');
var router = express.Router();

router.get("/endpoint.txt", (req, res, next) => {
	res.json({
		'title': 'title',
		'message': 'tdsajdksakdsal',
		'link': 'http://google.com',
		'image' : {}
	})
});

router.get("/*", (req, res, next) => {
    var file = req.params[0] || "views/index.html";
    res.sendFile(path.join(__dirname, "../public", file));
});

module.exports = router;
