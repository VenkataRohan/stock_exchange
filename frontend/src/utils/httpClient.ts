import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1'


export const getDepth = async (symbol: string) => {
    const res = await axios.get(`${BASE_URL}/depth?symbol=${symbol}`,{
        headers: {
        //   'Authorization': 'Bearer ', 
          'Content-Type': 'application/json',
          'Accept' : 'application/json'
        }
    })
    return res.data;
}

export const placeOrder =async (data : any) => {
    const res = await axios.post(`${BASE_URL}/order`,data,{
        headers: {
        //   'Authorization': 'Bearer ', 
          'Content-Type': 'application/json',
          'Accept' : 'application/json'
        }
    });
    return res.data;
}

