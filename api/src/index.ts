import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });

import express from 'express';
import { orderRouter } from './routes/orders';
import { depthRouter } from './routes/depth';
import cors from 'cors'
import { accountRouter } from './routes/account';
import { tradeRouter } from './routes/trades';
import { tickerRouter } from './routes/ticker';
import { loginRouter } from './routes/login';
import { signupRouter } from './routes/signup';
import { authenticateToken } from './utils';
import { stockStatsRouter } from './routes/stockStats';
import { engineRouter } from './routes/engine';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}))
app.use(express.json());



app.use('/api/v1/signup', signupRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/depth', depthRouter);
app.use('/api/v1/trade', tradeRouter);
app.use('/api/v1/ticker', tickerRouter);
app.use('/api/v1/stockStats', stockStatsRouter);

app.use('/api/v1/engine', engineRouter);


app.use(authenticateToken);

app.use('/api/v1/account', accountRouter);
app.use('/api/v1/order', orderRouter);


app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})


