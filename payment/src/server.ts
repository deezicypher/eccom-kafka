import express,{NextFunction, Request, Response} from 'express'


const app = express()
app.use(express.json())

app.post('/payment-service', async (req, res) => {
    const {cart} = req.body
    const userId = '1'

    // TODO PAYMENT
    console.log('API endpoint Hit')

    // KAFKA

    return res.send("Payment successful")
})

app.use((err:any,req:Request, res:Response, next:NextFunction) => {
    res.status(err.status || 500).send(err.message)
})

app.listen(8000,() => {
    console.log('Payment service is running on port 8000')
})