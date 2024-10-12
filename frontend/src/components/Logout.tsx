import { useNavigate } from 'react-router-dom';

export function Logout({setAccessToken}: {setAccessToken : any}) {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('ACCESS_TOKEN');
        setAccessToken()
        // navigate('/login')
    };



    return <>
        <button onClick={handleLogout}>
            Logout
        </button>
    </>
}