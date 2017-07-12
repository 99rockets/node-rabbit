const http = require('http')
const express = require('express')
const amqp = require('amqplib/callback_api')

amqp.connect('amqp://rabbitmq:rabbitmq@rabbit_1:5672', (err, conn) => {
    if (err) console.error(err)

    const app = express()

    conn.createChannel((err, channel) => {
        if (err) console.error(err)
        const Queue = "test"

        channel.assertQueue(Queue, {durable: true})

        app.get('/', (req, res) => {
            res.send('Welcome to server')
        })

        app.get('/send', (req, res) => {
            channel.sendToQueue(Queue, new Buffer(JSON.stringify("testme")))
            console.info(`Published message on channel ${Queue}`)
            res.sendStatus(200)
        })

        app.get('/:number', (req, res) => {
            const number = req.params.number
            const start = new Date()
            for (var i=0; i < number; i++) {
                channel.sendToQueue(Queue, new Buffer(JSON.stringify(`Task #${i}`)))
            }
            const end = new Date() - start
            res.send(`${number} tasks recived to RabbitMQ; Performance time: ${(end/1000)%60} sec`)
        })

        channel.consume(Queue, (msg) => {
            const text = msg.content.toString('utf8')

            return new Promise((resolve, reject) => {
                const options = {
                    hostname: '192.168.99.100',
                    port: 8080
                }
                http.get(options, (res) => {
                    console.log(`Recived: ${text}`)
                    resolve(res.statusCode)
                })
            })

            // setTimeout(() => {
            //     console.log(`Recived: ${text}`)
            // }, 4000)
        }, {noAck: true})

        app.listen(8080, () => {
            console.log('Demo app listening on port 8080!')
        })
    })
})
