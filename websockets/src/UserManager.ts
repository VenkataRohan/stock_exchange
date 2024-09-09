import { WebSocket } from "ws";
import { User } from './User'

export class UserManager {
    private static instance: UserManager;
    private users: Map<String, User> = new Map();

    public static getInstance() {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    public addUser(ws: WebSocket) {
        var userId = this.getRandomId();
        const user = new User(userId, ws);
        this.users.set(userId, user);
        this.registerOnClose(ws,userId);
        return user;
    }

    private registerOnClose(ws : WebSocket , userId : string){
        ws.on('close',()=>{
            this.users.delete(userId);
        })
    }

    public getUser(userId : string){
        return this.users.get(userId);
    }

    private getRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}