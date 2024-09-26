import { useEffect, useState } from "react"

import {  placeOrder } from "../utils/httpClient";


export function Login() {
  const [email, setEmail] = useState('tst@email.com');
  const [password, setPassword] = useState('tst');
  useEffect(() => {
    
    
  }, [])
  const onSubmit = async () => {
    console.log(email);
    console.log(password);
    
  }

  return <>
    <div className="flex flex-col">
      <label htmlFor="email">
        Email :  <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label htmlFor="password">
        Password : <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <div>
        <button className="bg-blue-500" onClick={onSubmit}>Login</button>
      </div>
    </div>
  </>
}