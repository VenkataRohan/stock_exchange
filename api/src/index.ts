import express from 'express';
import { orderRouter } from './routes/orders';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());


app.use('/api/v1/order',orderRouter);


app.listen(PORT,()=>{
    console.log('Server running on port ' + PORT);
})


