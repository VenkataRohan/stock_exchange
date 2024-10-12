import { useEffect, useState } from "react"
import { login, placeOrder } from "../utils/httpClient";
import { useNavigate, useLocation } from 'react-router-dom';

export function Login({ setAccessToken }: { setAccessToken: any }) {
    const [email, setEmail] = useState('test5@gmail.com');
    const [password, setPassword] = useState('tst');
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/markets';
    useEffect(() => {

    }, [])

    const onSubmit = async (e: any) => {
        e.preventDefault();

        const res = await login(email, password)
        console.log(from);

        console.log(res);
        localStorage.setItem('ACCESS_TOKEN', res.token)
        console.log(from);
        console.log(location.state);
        navigate(from, { replace: true });
        setAccessToken(res.token)
        console.log(from);
        
    }



    return <>
        <div className="bg-black text-white flex h-[90%] flex-col items-center sm:justify-center">

            <div className="relative w-full max-w-lg ">
                <div
                    className="mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 dark:shadow-white/20 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none">
                    <div className="flex flex-col p-6">
                        <h3 className="text-xl font-semibold leading-6 tracking-tighter">Login</h3>
                        <p className="mt-1.5 text-sm font-medium text-white/50">Welcome back
                        </p>
                    </div>
                    <div className="p-6 pt-0">
                        <form onSubmit={onSubmit}>
                            <div>
                                <div>
                                    <div
                                        className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                                        <div className="flex justify-between">
                                            <label
                                                className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">Username</label>

                                        </div>
                                        <input type="text" name="email" placeholder="email"
                                            className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
                                            value={email} onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div>
                                    <div
                                        className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                                        <div className="flex justify-between">
                                            <label
                                                className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">Password</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="password" name="password"
                                                className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground"
                                                value={password} onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-end gap-x-2">
                                <a className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:ring hover:ring-white h-10 px-4 py-2 duration-200"
                                    href="/register">Register</a>
                                <button
                                    className="font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2"
                                    type="submit">Log in</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
}