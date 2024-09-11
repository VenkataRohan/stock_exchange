import prisma from "./prisma";

async function main() {

    const result = await prisma.$queryRaw`
  SELECT
    time_bucket('1 hour', "time") AS bucket,
    "symbol",
    first("price", "time") AS open,
    max("price") AS high,
    min("price") AS low,
    last("price", "time") AS close
  FROM stock
  GROUP BY bucket, "symbol"
`;

console.log(result);


}
main()
