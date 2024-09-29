const WS_URL = 'ws://localhost:3001'

export class SingnalManager {
    private ws: WebSocket;
    private static instance: SingnalManager;
    private bufferedMsg: any;
    private id: number;
    private initialized: boolean = false;
    private callbackMap: any;

    constructor() {
        this.ws = new WebSocket(WS_URL);
        this.bufferedMsg = []
        this.id = 1;
        this.callbackMap = new Map();
        this.init();
    }

    public static getInstance() {
        if (!SingnalManager.instance) {
            SingnalManager.instance = new SingnalManager();
        }
        return SingnalManager.instance;
    }

    private init() {
        this.ws.onopen = () => {
            this.initialized = true;
            this.bufferedMsg.forEach((msg: any) => {
                this.ws.send(JSON.stringify(msg))
            })
            this.bufferedMsg = [];
        }

        this.ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            console.log(msg);
            
            if (this.callbackMap.get(msg.stream)) {
                console.log(this.callbackMap.get(msg.stream));
                console.log("idshfadshf fljkhasdj fhajlskdhf laskjdhfal kjsdfhl");
                
                const callbacks = this.callbackMap.get(msg.stream)
                callbacks.forEach((ele : any) => ele.callback(msg.data));
            }
        }
    }

    sendMessages(msg: any) {
        const msgToSend = {
            ...msg,
            id: this.id++
        }
        if (!this.initialized) {
            this.bufferedMsg.push(msgToSend);
            return;
        }

        this.ws.send(JSON.stringify(msgToSend));
    }

    registerCallback(type: string, callback: any, id: string) {
        this.callbackMap.set(type, (this.callbackMap.get(type) || []).concat({ callback, id }));
    }

    deregisterCallback(type: string, id : string) {
        if (this.callbackMap.get(type)) {
            const ind = this.callbackMap[type]?.findIndex((callback : any)=> callback.id === id);
            if(ind && ind != -1){
                this.callbackMap[type].splice(ind,1);
            }
        }
    }



    close() {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.close();
        }
    }
}