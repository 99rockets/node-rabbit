const express = require('express')
const amqp = require('amqplib/callback_api')

const app = express()

const rabbitConnection = amqp.connect('amqp://rabbitmq:rabbitmq@rabbit_1:5672', (err, conn) => {
    if (err) {
        console.error(err)
    } else {
        console.info('Connected to RabbitMQ')
    }
})

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/send', (req, res) => {
    res.sendStatus(200)
})

app.get('/list', (req, res) => {
    res.sendStatus(200)
})

app.listen(8080, () => {
    console.log('Demo app listening on port 8080!')
})
