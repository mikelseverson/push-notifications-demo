var express = require('express'),
	path = require('path');
var router = express.Router();

router.get("/endpoint", (req, res, next) => {
	res.json({
		'title': 'Why did the market get off the trampoline',
		'message': 'Gotta keep the bounce rate down',
		'link': 'https://www.mikelseverson.com',
		'image' : {
			'url': 'https://cdn2.iconfinder.com/data/icons/advertisement-marketing/512/ad_banner-512.png'
		}
	})
});

router.get("/*", (req, res, next) => {
    var file = req.params[0] || "views/index.html";
    res.sendFile(path.join(__dirname, "../public", file));
});

module.exports = router;
