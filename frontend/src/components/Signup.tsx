import { useEffect, useState } from "react"

export function Signup() {
  const [email, setEmail] = useState('tst@email.com');
  const [username, setUsername] = useState('tst');
  const [password, setPassword] = useState('tst');
  useEffect(() => {
    
    
  }, [])
  const onSubmit = async (e : any) => {
    e.preventDefault();
    console.log(email);
    console.log(password);
    
  }

  return <>
  <div className="bg-black text-white flex h-[90%] flex-col items-center sm:justify-center">

    <div className="relative w-full max-w-lg ">
        <div
            className="mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 dark:shadow-white/20 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none">
            <div className="flex flex-col p-6">
                <h3 className="text-xl font-semibold leading-6 tracking-tighter">Signup</h3>
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
                                <input type="text" name="username" placeholder="username"
                                    className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
                                    value={username} onChange={(e) => setUsername(e.target.value)}
                                    />
                            </div>
                        </div>
                    </div>
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
                    <div className="mt-4 flex items-center justify-center gap-x-2">
                        <button
                            className=" font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2"
                            type="submit">Signup</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
  </>
}