import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import { SingnalManager } from './utils/SingnalManager';
import { MarketHome } from './components/MarketHome';
import { Account } from './components/account/Account';
import { Orders } from './components/order/Orders';
import { Navbar } from './components/Navbar';
import { Markets } from './components/Markets';
import { Login } from './components/Login';
import { Signup } from './components/Signup';

// const symbol = 'AERONOX'
// const userId = '035rmc3g8m830vvk04lq4pvg'

function App() {
  const [symbol,setSymbol] = useState('AERONOX');
  // const [userId,setUserId] = useState('576syjahp4cs3qkvrfp4j');
  // const [userId,setUserId] = useState('5ny23qr9cp9m561nlbmjja');
  // const [userId,setUserId] = useState('5z4gomfcw4itif3uqpks4');
  const [userId,setUserId] = useState('5z4gomfcw4itif3uqpks4');
  const [accessToken, setAccessToken] = useState(localStorage.getItem('ACCESS_TOKEN') || '')

  useEffect(() => {
    // setAccessToken(localStorage.getItem('ACCESS_TOKEN') || '');
    SingnalManager.getInstance();

    return () => {
      SingnalManager.getInstance().close();
    }
  }, []);

  return (
    <Router>
      <Navbar  accessToken = {accessToken}/>
      
      <Routes>
      
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Navigate to="/markets" />} />
        <Route path="/markets" element={<Markets/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/market/:symbol" element={<MarketHome accessToken = {accessToken}  />} />
        <Route path="/get_order" element={<Orders accessToken = {accessToken} />} />
        <Route path="/balance" element={<Account accessToken = {accessToken} />} />
      </Routes>
    </Router>

  )
}

export default App
