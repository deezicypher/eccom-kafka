import { Kafka } from "kafkajs";


const kafka = new Kafka({
    clientId:"analytic-service",
    brokers: ["localhost:9094"]
})

const consumer = kafka.consumer({groupId:'analytic-service'});



const run = async () => {
    try {
        await consumer.connect()
        console.log("Analytic consumer connected")
        await consumer.subscribe({
            topic: "payment-successful",
            fromBeginning:true
        })

        await consumer.run({
            eachMessage: async ({topic,partition,message}) => {
                const value = message.value!.toString();
                
                const {userId, cart} = JSON.parse(value);
                
                const total = Number(cart.reduce((acc: any, item: { price: any; }) => acc + item.price, 0)).toFixed();
                console.log(`Analytic consumer: User ${userId} paid ${total}`)
            }
        })
    } catch (error) {
        console.log(error)
    }
};

run()