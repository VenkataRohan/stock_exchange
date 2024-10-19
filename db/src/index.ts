import { RabbitMqManager } from "./RabbitMqManager";
import prisma from "../prisma/prisma";

async function main() {
  await RabbitMqManager.getInstance().connect();
}
main()
