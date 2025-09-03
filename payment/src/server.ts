import express,{NextFunction, Request, Response} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Kafka } from "kafkajs";



dotenv.config()

const app = express()
app.use(express.json())

const allowedOrigins = ['http://localhost:3000']
if(process.env.NODE_ENV === 'dev'){
    app.use(cors({
        credentials:true,
        origin:allowedOrigins
    }))
}
const kafka = new Kafka({
    clientId:"payment-service",
    brokers: ["localhost:9094","localhost:9095", "localhost:9096"]
})

const producer = kafka.producer();

const connectToKafka = async () => {
    try {
        await producer.connect();
        console.log('Producer connected');
    } catch (error) {
        console.error('Error connecting to kafka',error)
    }
}

app.post('/payment-service', async (req, res) => {
    const {cart} = req.body
    const userId = '1'

    // TODO PAYMENT
    console.log('Payment successful')

    // KAFKA
    await producer.send({
        topic: 'payment-successful',
        messages: [{key:userId, value: JSON.stringify({userId,cart})}]
    })

    return res.send("Payment successful")
})

app.use((err:any,req:Request, res:Response, next:NextFunction) => {
    res.status(err.status || 500).send(err.message)
})

app.listen(8000,() => {
    connectToKafka()
    console.log('Payment service is running on port 8000')
})