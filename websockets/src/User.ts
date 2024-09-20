import WebSocket from "ws";
import { SubscriptionManager } from "./SubscriptionManager";

export class User{
    private ws : WebSocket;
    private id : string;
    constructor(id : string ,ws : WebSocket){
        this.ws = ws;
        this.id = id;
        this.addEventListerners();
    }

    emit(mesage : string){
        this.ws.send(mesage);
    }

    private addEventListerners(){
        this.ws.on('message',async (message : string)=>{
            const msg = JSON.parse(message);

            if(msg.method == 'SUBSCRIBE'){
                console.log(msg); 
                await SubscriptionManager.getInstance().connect();
                msg.params.forEach(async(ele : string) => await SubscriptionManager.getInstance().subscribe(this.id,ele));
            }

            if(msg.method == 'UNSUBSCRIBE'){
                console.log(msg);  
                await SubscriptionManager.getInstance().connect();
                msg.params.forEach(async(ele : string) => await  SubscriptionManager.getInstance().unsubscribe(this.id,ele));
            }
        })
    }

}