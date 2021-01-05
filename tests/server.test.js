const fs = require('fs')
const path = require('path')
const csvWriter = require('csv-write-stream')
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index')
const expect = chai.expect

chai.use(chaiHttp)

createCSVFileToTests()

function createCSVFileToTests() {
	//Remove old file
	fs.unlinkSync(path.join(__dirname, `../${process.env.npm_config_inputFile}`))

	const data = [
		{ '0': 'GRU', '1': 'BRC', '2': 10 },
		{ '0': 'BRC', '1': 'SCL', '2': 5 },
		{ '0': 'GRU', '1': 'CDG', '2': 75 },
		{ '0': 'GRU', '1': 'SCL', '2': 20 },
		{ '0': 'GRU', '1': 'ORL', '2': 56 },
		{ '0': 'ORL', '1': 'CDG', '2': 5 },
		{ '0': 'SCL', '1': 'ORL', '2': 20 }
	]

	//Create e populate a new CSV to be used in tests
	data.map(row => {
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
			row['0'],
			row['1'],
			row['2']
		])
		writer.end()
	})
}


describe('GET /route API tests', () => {
	it('Test a valid travel', (done) => {
		chai.request(app)
			.get('/api/route?travel=GRU-CDG')
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res.body).to.be.a('object')
				expect(res.body.cost).to.be.an('number')
				expect(res.body.route).to.be.an('string')
				done()
			})
	})

	it('Test a invalid destination', (done) => {
		chai.request(app)
			.get('/api/route?travel=GRU-MAO')
			.end((err, res) => {
				expect(res).to.have.status(500)
				expect(res.body).to.be.a('object')
				expect(res.body.status).to.be.an('string')
				expect(res.body.status).to.be.equal('error')
				expect(res.body.message).to.be.an('string')
				done()
			})
	})

	it('Test a invalid departure', (done) => {
		chai.request(app)
			.get('/api/route?travel=MAO-ORL')
			.end((err, res) => {
				expect(res).to.have.status(500)
				expect(res.body).to.be.a('object')
				expect(res.body.status).to.be.an('string')
				expect(res.body.status).to.be.equal('error')
				expect(res.body.message).to.be.an('string')
				done()
			})
	})

	it('Test same departure and destination', (done) => {
		chai.request(app)
			.get('/api/route?travel=GRU-GRU')
			.end((err, res) => {
				expect(res).to.have.status(400)
				expect(res.body).to.be.a('object')
				expect(res.body.status).to.be.an('string')
				expect(res.body.status).to.be.equal('error')
				expect(res.body.message).to.be.an('string')
				done()
			})
	})

	it('Test not send parameter', (done) => {
		chai.request(app)
			.get('/api/route')
			.end((err, res) => {
				expect(res).to.have.status(400)
				expect(res.body).to.be.a('object')
				expect(res.body.status).to.be.an('string')
				expect(res.body.status).to.be.equal('error')
				expect(res.body.message).to.be.an('string')
				done()
			})
	})

})

describe('POST /route API tests', async () => {

	it('Test create new route', (done) => {
		chai.request(app)
			.post('/api/route')
			.send({
				'to': 'BRC',
				'from': 'MAO',
				'cost': 20
			})
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res.body).to.be.a('object')
				expect(res.body.message).to.be.an('string')
				done()
			})
	})

	it('Test create already existing route', (done) => {
		chai.request(app)
			.post('/api/route')
			.send({
				'to': 'BRC',
				'from': 'MAO',
				'cost': 20
			})
			.end((err, res) => {
				expect(res).to.have.status(409)
				expect(res.body).to.be.a('object')
				expect(res.body.status).to.be.an('string')
				expect(res.body.status).to.be.equal('error')
				expect(res.body.message).to.be.an('string')
				done()
			})
	})

	it('Test missing required parameters', (done) => {
		chai.request(app)
			.post('/api/route')
			.send({
				'from': 'MAO',
				'cost': 20
			})
			.end((err, res) => {
				expect(res).to.have.status(400)
				expect(res.body).to.be.a('object')
				expect(res.body.status).to.be.an('string')
				expect(res.body.status).to.be.equal('error')
				expect(res.body.message).to.be.an('string')
				done()
			})
	})
})
