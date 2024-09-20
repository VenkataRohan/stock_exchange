import { RabbitMqManager } from "./RabbitMqManager";


const main = async()=>{
    await RabbitMqManager.getInstance().connect();
    await RabbitMqManager.getInstance().consume();
}

main()