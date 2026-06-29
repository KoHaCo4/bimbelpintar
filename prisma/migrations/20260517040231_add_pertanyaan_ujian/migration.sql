/*
  Warnings:

  - You are about to drop the column `link` on the `Soal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Soal` DROP COLUMN `link`,
    ADD COLUMN `linkPembahasan` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Pertanyaan` (
    `id` VARCHAR(191) NOT NULL,
    `soalId` VARCHAR(191) NOT NULL,
    `urutan` INTEGER NOT NULL,
    `tipe` ENUM('PILIHAN_GANDA', 'ESSAY') NOT NULL,
    `pertanyaan` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pilihan` (
    `id` VARCHAR(191) NOT NULL,
    `pertanyaanId` VARCHAR(191) NOT NULL,
    `huruf` VARCHAR(191) NOT NULL,
    `teks` TEXT NOT NULL,
    `isBenar` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HasilUjian` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `soalId` VARCHAR(191) NOT NULL,
    `skor` DOUBLE NULL,
    `selesaiAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jawaban` (
    `id` VARCHAR(191) NOT NULL,
    `hasilUjianId` VARCHAR(191) NOT NULL,
    `pertanyaanId` VARCHAR(191) NOT NULL,
    `jawaban` TEXT NOT NULL,
    `isBenar` BOOLEAN NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pertanyaan` ADD CONSTRAINT `Pertanyaan_soalId_fkey` FOREIGN KEY (`soalId`) REFERENCES `Soal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pilihan` ADD CONSTRAINT `Pilihan_pertanyaanId_fkey` FOREIGN KEY (`pertanyaanId`) REFERENCES `Pertanyaan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HasilUjian` ADD CONSTRAINT `HasilUjian_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HasilUjian` ADD CONSTRAINT `HasilUjian_soalId_fkey` FOREIGN KEY (`soalId`) REFERENCES `Soal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jawaban` ADD CONSTRAINT `Jawaban_hasilUjianId_fkey` FOREIGN KEY (`hasilUjianId`) REFERENCES `HasilUjian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jawaban` ADD CONSTRAINT `Jawaban_pertanyaanId_fkey` FOREIGN KEY (`pertanyaanId`) REFERENCES `Pertanyaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
