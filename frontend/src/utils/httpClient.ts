import axios from 'axios';
import { messageFromApi, order } from '../types';

const BASE_URL = 'http://localhost:3000/api/v1'


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


export const getBalance = async (userId: string) => {
  const res = await axios.post(`${BASE_URL}/account/balance`, { userId: userId }, {
    headers: {
      //   'Authorization': 'Bearer ', 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return res.data;
}

export const getStockBalance = async (userId: string, symbol: string) => {
  const res = await axios.post(`${BASE_URL}/account/stock_balance`, { userId: userId, symbol: symbol }, {
    headers: {
      //   'Authorization': 'Bearer ', 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return res.data;
}

export const getAllStockBalance = async (userId: string) => {
  const res = await axios.post(`${BASE_URL}/account/all_stock_balance`, { userId: userId}, {
    headers: {
      //   'Authorization': 'Bearer ', 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return res.data;
}


export const getOrders = async (userId: string): Promise<messageFromApi> => {
  const res = await axios.get(`${BASE_URL}/order?userId=${userId}`, {
    headers: {
      //   'Authorization': 'Bearer ', 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return res.data;
}

export const addBalance = async (userId : string ,amount : string) => {
  const res = await axios.post(`${BASE_URL}/account/add_balance`, { userId, amount }, {
    headers: {
      //   'Authorization': 'Bearer ', 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return res.data;
}


export const placeOrder = async (data: order): Promise<order> => {
  const res = await axios.post(`${BASE_URL}/order`, data, {
    headers: {
      //   'Authorization': 'Bearer ', 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return res.data;
}

export const cancelOrder = async (data: any) => {
  const res = await axios.delete(`${BASE_URL}/order`, {
    headers: {
      //   'Authorization': 'Bearer ', 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data
  });
  return res.data;
}
