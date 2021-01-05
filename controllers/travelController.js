const fs = require('fs')
const path = require('path')
const neatCsv = require('neat-csv')
const csvWriter = require('csv-write-stream')
const { ErrorHandler } = require('../helpers/error')

async function getBestRoute(payload) {
	try {

		//Throw error if request does not have the necessary parameters
		if (!payload.travel) throw new ErrorHandler(400, 'Please inform the travel to be calculated')

		//Load CSV file data
		let fileData = await fs.promises.readFile(path.join(__dirname, `../${process.env.npm_config_inputFile}`))
		let csvData = await neatCsv(fileData, {
			headers: false
		})

		//Split the input parameters to get from-to values
		let from = (payload.travel.split('-')[0]).toUpperCase()
		let to = (payload.travel.split('-')[1]).toUpperCase()

		//Throw error if departure and the destination are the same
		if (from === to) throw new ErrorHandler(400, 'Departure and destination must be different')

		//Call 'calculateTravelCost' function
		let travelCosts = calculateTravelCost(from, to, csvData)

		//Order from the cheapest to the most expensive travel
		travelCosts.sort(function (a, b) {
			return a.cost - b.cost
		})

		//Throw error if not possible to find a route between the departure and the destination
		if (!travelCosts[0]) throw new ErrorHandler(500, 'It is not possible to get a route for this travel, please check your input')

		return travelCosts[0]

	} catch (err) {
		throw new ErrorHandler(err.statusCode, err.message)
	}
}

//Recursive function that identifies possible routes and calculates costs
function calculateTravelCost(from, to, csvData, cost = 0, route = '', routesAndCosts = []) {
	try {
		csvData.map(row => {
			if (row['0'] === from) {
				if (row['1'] === to) {
					cost += parseInt(row['2'])
					route = route + from + ' '
					route = route + to

					routesAndCosts.push({
						route,
						cost
					})

					cost = 0
					route = ''
				} else {
					cost += parseInt(row['2'])
					route = route + from + ' '

					//Recursive call
					calculateTravelCost(row['1'], to, csvData, cost, route, routesAndCosts)

					cost = 0
					route = ''
				}
			}
		})
		return routesAndCosts
	} catch (err) {
		throw new Error(err)
	}
}

async function createNewRoute(payload) {
	try {

		//Throw error if request does not have the necessary parameters
		if (!payload.to || !payload.from || !payload.cost) throw new ErrorHandler(400, 'Missing required parameter')

		//Load CSV file data
		let fileData = await fs.promises.readFile(path.join(__dirname, `../${process.env.npm_config_inputFile}`))
		let csvData = await neatCsv(fileData, {
			headers: false
		})

		//Throw error if route already exists
		if (csvData.some(el => el['0'] === payload.to && el['1'] === payload.from)) throw new ErrorHandler(409, 'This route already exists')

		//Write the new route to the CSV file
		let writer = csvWriter({
			headers: ['0', '1', '2'],
			separator: ',',
			newline: '\n',
			sendHeaders: false
		})
		writer.pipe(fs.createWriteStream(path.join(__dirname, `../${process.env.npm_config_inputFile}`), {
			flags: 'a'
		}))
		writer.write([
			payload.to,
			 payload.from,
			 payload.cost
		])
		writer.end()

		return ({
			message: 'New route successfully registered'
		})

	} catch (err) {
		throw new ErrorHandler(err.statusCode, err.message)
	}
}

module.exports = {
	getBestRoute,
	createNewRoute
}
