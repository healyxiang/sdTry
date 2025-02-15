-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('TEXT2IMG', 'IMG2IMG', 'AVATAR');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "type" "TaskType" NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "prompt" TEXT,
    "initImage" TEXT,
    "outputImage" TEXT,
    "modelId" TEXT,
    "settings" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tasks_userId_idx" ON "tasks"("userId");

-- CreateIndex
CREATE INDEX "tasks_type_idx" ON "tasks"("type");

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "tasks"("status");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
