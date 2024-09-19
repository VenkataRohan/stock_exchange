import express from 'express';
import { orderRouter } from './routes/orders';
import { depthRouter } from './routes/depth';
import cors from 'cors'

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin : 'http://localhost:5173'
}))
app.use(express.json());


app.use('/api/v1/order',orderRouter);
app.use('/api/v1/depth',depthRouter);


app.listen(PORT,()=>{
    console.log('Server running on port ' + PORT);
})


