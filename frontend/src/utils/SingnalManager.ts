const WS_URL = 'ws://localhost:3001'

export class SingnalManager{
    private ws : WebSocket;
    private static instance : SingnalManager;
    private bufferedMsg : any ;
    private id: number;
    private initialized : boolean = false;
    private callbackMap : any;

    constructor(){
        this.ws = new WebSocket(WS_URL);
        this.bufferedMsg = []
        this.id = 1;
        this.callbackMap = new Map();
        this.init();
    }

    public static getInstance(){
        if(!SingnalManager.instance){
            SingnalManager.instance = new SingnalManager();
        }
        return SingnalManager.instance;
    }

    private init(){
        this.ws.onopen = ()=>{
            console.log('ws open');
            
            this.initialized = true;
            this.bufferedMsg.forEach((msg : any)=>{
                this.ws.send(JSON.stringify(msg))
            })
            this.bufferedMsg = [];
        }

        this.ws.onmessage = (event)=>{
            const msg = JSON.parse(event.data);
            console.log(msg);
            if(this.callbackMap.get(msg.stream)){
                const callback = this.callbackMap.get(msg.stream)
                console.log(callback);
                
                callback(msg.data);
                console.log('data from ws if');
            }
        }
    }

    sendMessages(msg: any){
        const msgToSend = {
            ...msg,
            id : this.id++
        }
        if(!this.initialized){
            this.bufferedMsg.push(msgToSend);
            return;
        }

        this.ws.send(JSON.stringify(msgToSend));
    }

    registerCallback(type : string ,callback : any){
        this.callbackMap.set(type,callback);
    }

    deregisterCallback(type : string){
        if(this.callbackMap.get(type)){
            this.callbackMap.remove(type)
        }
    }



    close(){
        if(this.ws.readyState === WebSocket.OPEN){
            console.log('ws close');        
            this.ws.close();
        }
    }
}