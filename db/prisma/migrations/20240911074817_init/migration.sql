CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- CreateTable
CREATE TABLE "stock" (
    "id" SERIAL NOT NULL,
    "symbol" VARCHAR(255) NOT NULL,
    "price" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_id_time_key" ON "stock"("id", "time");

SELECT create_hypertable('"stock"', 'time');