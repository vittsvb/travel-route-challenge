const prompts = require('prompts')
const { getBestRoute } = require('./controllers/travelController')

async function commandLineTravel() {
	const userInput = await prompts({
		type: 'text',
		name: 'travel',
		message: 'Please enter the route:',
	})

	let returnMessage = await getBestRoute(userInput)

	console.log('best route: ' + returnMessage.route +' > '+ returnMessage.cost)
	userInputTravel()
}

commandLineTravel()
