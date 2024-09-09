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
        this.ws.on('message',(message : string)=>{
            const msg = JSON.parse(message);

            if(msg.method == 'SUBSCRIBE'){
                console.log(msg); 
                msg.params.forEach((ele : string) => SubscriptionManager.getInstance().subscribe(this.id,ele));
                
            }

            if(msg.method == 'UNSUBSCRIBE'){
                console.log(msg);  
                msg.params.forEach((ele : string) => SubscriptionManager.getInstance().unsubscribe(this.id,ele));
            }
        })
    }

}