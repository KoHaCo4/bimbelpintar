/*
  Warnings:

  - A unique constraint covering the columns `[hasilUjianId,pertanyaanId]` on the table `Jawaban` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Jawaban_hasilUjianId_pertanyaanId_key` ON `Jawaban`(`hasilUjianId`, `pertanyaanId`);
