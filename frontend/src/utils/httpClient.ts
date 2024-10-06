import axios from 'axios';
import { messageFromApi, order } from '../types';

const BASE_URL = 'http://localhost:3000/api/v1'

export const login = async (email :string , password  : string): Promise<any> => {
  const res = await axios.post(`${BASE_URL}/login`,{email,password}, {
    headers: {
      //   'Authorization': 'Bearer ', 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  return res.data;
}

export const getDepth = async (symbol: string): Promise<messageFromApi> => {
  const res = await axios.get(`${BASE_URL}/depth?symbol=${symbol}`, {
    headers: {
      //   'Authorization': 'Bearer ', 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  return res.data;
}

export const getTrade = async (symbol: string): Promise<messageFromApi> => {
  const res = await axios.get(`${BASE_URL}/trade?symbol=${symbol}`, {
    headers: {
      //   'Authorization': 'Bearer ', 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  return res.data;
}

export const getTicker = async (symbol: string): Promise<messageFromApi> => {
  const res = await axios.get(`${BASE_URL}/ticker?symbol=${symbol}`, {
    headers: {
      //   'Authorization': 'Bearer ', 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  return res.data;
}
export const getCurrentPrice = async (symbol: string): Promise<messageFromApi> => {
  const res = await axios.get(`${BASE_URL}/ticker/currentPrice?symbol=${symbol}`, {
    headers: {
      //   'Authorization': 'Bearer ', 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  return res.data;
}

export const getStockStats = async (symbol: string): Promise<any> => {
  const res = await axios.get(`${BASE_URL}/stockStats?symbol=${symbol}`, {
    headers: {
      //   'Authorization': 'Bearer ', 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  return res.data;
}


export const getBalance = async (accessToken: string) => {
  const res = await axios.post(`${BASE_URL}/account/balance`, {}, {
    headers: {
      'Authorization': `Bearer ${accessToken}`, 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return res.data;
}

export const getStockBalance = async (accessToken: string, symbol: string) => {
  const res = await axios.post(`${BASE_URL}/account/stock_balance`, {  symbol: symbol }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`, 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return res.data;
}

export const getAllStockBalance = async (accessToken: string) => {
  const res = await axios.post(`${BASE_URL}/account/all_stock_balance`, { }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`, 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return res.data;
}


export const getOrders = async (accessToken: string): Promise<messageFromApi> => {
  const res = await axios.get(`${BASE_URL}/order`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`, 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return res.data;
}

export const addBalance = async (accessToken : string ,amount : string) => {
  const res = await axios.post(`${BASE_URL}/account/add_balance`, {  amount }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`, 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return res.data;
}


export const placeOrder = async (order: order , accessToken : string): Promise<order> => {
  const res = await axios.post(`${BASE_URL}/order`, order, {
    headers: {
        'Authorization': `Bearer ${accessToken}`, 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return res.data;
}

export const cancelOrder = async (data: { orderId: string, symbol: string }, accessToken : string) => {
  const res = await axios.delete(`${BASE_URL}/order`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`, 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data
  });
  return res.data;
}
