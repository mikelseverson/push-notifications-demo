var express = require('express'),
	path = require('path');
var router = express.Router();

router.get("/endpoint", (req, res, next) => {
	res.json({
		'title': 'Why marketer get off trampoline?',
		'message': 'Bounce rate was too high',
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
