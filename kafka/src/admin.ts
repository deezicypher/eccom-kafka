import { Kafka } from "kafkajs";


const kafka = new Kafka({
    clientId:"kafka-service",
    brokers: ["localhost:9094"]
})

const admin = kafka.admin()

const run = async () => {
    try{
    await admin.connect()
    console.log("Kafka Connected")
    await admin.createTopics({
        topics:[
            {topic:"payment-successful"},
            {topic:"order-successful"}
        ]
    })
    console.log("Topics Created")
}catch(err){
    console.error('Error connecting to kafka',err)
}
}

run()