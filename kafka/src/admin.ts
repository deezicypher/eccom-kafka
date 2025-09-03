import { Kafka } from "kafkajs";


const kafka = new Kafka({
    clientId:"kafka-service",
    brokers: ["localhost:9094","localhost:9095", "localhost:9096"]
})

const admin = kafka.admin()

const run = async () => {
    try{
    await admin.connect()
    console.log("Kafka Connected")
    await admin.createTopics({
        topics:[
            {topic:"payment-successful", numPartitions:3, replicationFactor:3},
            {topic:"order-successful", numPartitions:3, replicationFactor:3},
            {topic:"email-successful", numPartitions:3, replicationFactor:3}
        ]
    })
    console.log("Topics Created")
}catch(err){
    console.error('Error connecting to kafka',err)
}
}

run()