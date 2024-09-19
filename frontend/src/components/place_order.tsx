import { useEffect, useState } from "react"
import axios from "axios";

export function PlaceOrder() {
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const onSubmit = ()=>{
        console.log(quantity);
        console.log(price);
        let data = JSON.stringify({
            "orderType": "Limit",
            "symbol": "TATA",
            "price": price,
            "quantity": quantity,
            "side": "Bid",
            "userId": "7sjkdzii9fpk9wlvimul3"
          });
          
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/api/v1/order',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log(error);
          });
        
    }

    return <>
        <div className="flex flex-col">
            <label htmlFor="qty">
                Quatity :  <input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </label>

            <label htmlFor="price">
                Price : <input value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <div>
            <button className="bg-blue-500" onClick={onSubmit}>Place Order</button>
            </div>
        </div>
    </>
}