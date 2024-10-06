-- CreateTable
CREATE TABLE "UserBalance" (
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "UserBalance_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
