-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('SISWA', 'ADMIN') NOT NULL DEFAULT 'SISWA',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Soal` (
    `id` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `mapel` ENUM('MATEMATIKA', 'IPA', 'IPS', 'BAHASA_INDONESIA', 'BAHASA_INGGRIS') NOT NULL,
    `kelas` INTEGER NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `harga` INTEGER NOT NULL,
    `jumlahSoal` INTEGER NOT NULL,
    `durasi` INTEGER NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pembelian` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `soalId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'SUKSES', 'GAGAL') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pembelian` ADD CONSTRAINT `Pembelian_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembelian` ADD CONSTRAINT `Pembelian_soalId_fkey` FOREIGN KEY (`soalId`) REFERENCES `Soal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
