import { Kafka } from "kafkajs";


const kafka = new Kafka({
    clientId:"analytic-service",
    brokers: ["localhost:9094","localhost:9095", "localhost:9096"]
})

const consumer = kafka.consumer({groupId:'analytic-service'});



const run = async () => {
    try {
        await consumer.connect()
        console.log("Analytic consumer connected")
        await consumer.subscribe({
            topics: ["payment-successful","order-successful","email-successful"],
            fromBeginning:true
        })

        await consumer.run({
            eachMessage: async ({topic,partition,message}) => {
                switch (topic) {
                    case "payment-successful": {
                        const value = message.value!.toString();
                
                        const {userId, cart} = JSON.parse(value);
                        
                        const total = Number(cart.reduce((acc: any, item: { price: any; }) => acc + item.price, 0)).toFixed();
                        console.log(`Analytic consumer: User ${userId} paid ${total}`)
                    }
                        break;
                    case "order-successful": {
                        const value = message.value!.toString();
                
                        const {userId, orderId} = JSON.parse(value);
                        
                        
                        console.log(`Analytic consumer: order id ${orderId} created for user ${userId}`)
                    }
                        break; 
                    case "email-successful": {
                        const value = message.value!.toString();
                
                        const {userId, emailId} = JSON.parse(value);
                        
                        
                        console.log(`Analytic consumer: email id ${emailId} sent to user ${userId}`)
                    }
                    break;          
                    default:
                        break;
                }
         
            }
        })
    } catch (error) {
        console.log(error)
    }
};

run()