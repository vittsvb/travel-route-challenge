const router = require('express').Router()
const { getBestRoute, createNewRoute } = require('../controllers/travelController')

router.get('/route', async function (req, res, next) {
	try {
		let returnMessage = await getBestRoute(req.query)
		res.status(200).send(returnMessage)
	} catch (err) {
		next(err)
	}
})

router.post('/route', async function (req, res, next) {
	try {
		let returnMessage = await createNewRoute(req.body)
		res.status(200).send(returnMessage)
	} catch (err) {
		next(err)
	}
})


module.exports = router
