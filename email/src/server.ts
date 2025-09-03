import { Kafka } from "kafkajs";


const kafka = new Kafka({
    clientId:"email-service",
    brokers: ["localhost:9094","localhost:9095", "localhost:9096"]
})

const consumer = kafka.consumer({groupId:'email-service'});
const producer = kafka.producer();


const run = async () => {
    try {
        await consumer.connect()
        console.log("Email consumer connected")
        await producer.connect()
        console.log("Email producer connected")

        await consumer.subscribe({
            topic: "order-successful",
            fromBeginning:true
        })

        await consumer.run({
            eachMessage: async ({topic,partition,message}) => {
                const value = message.value!.toString();
                
                const {userId, orderId} = JSON.parse(value);
                
               
                // Send Email to the user
                const emailId = '7xgyu2v3762'
                console.log(`Email sent to user ${userId}`)

                
                await producer.send({
                    topic:'email-successful',
                    messages: [{value: JSON.stringify({userId,emailId})}]
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
};

run()