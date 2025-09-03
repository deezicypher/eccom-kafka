import { Kafka } from "kafkajs";


const kafka = new Kafka({
    clientId:"order-service",
    brokers: ["localhost:9094","localhost:9095", "localhost:9096"]
})

const consumer = kafka.consumer({groupId:'order-service'});
const producer = kafka.producer();


const run = async () => {
    try {
        await consumer.connect()
        console.log("Order consumer connected")
        await producer.connect()
        console.log("Order Producer connected")

        await consumer.subscribe({
            topic: "payment-successful",
            fromBeginning:true
        })

        await consumer.run({
            eachMessage: async ({topic,partition,message}) => {
                const value = message.value!.toString();
                
                const {userId, cart} = JSON.parse(value);
                
                // Create order on DB
                const orderId = '12'
                console.log(`order created for user ${userId}`)

                await producer.send({
                    topic:'order-successful',
                    messages: [{value: JSON.stringify({userId,orderId})}]
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
};

run()