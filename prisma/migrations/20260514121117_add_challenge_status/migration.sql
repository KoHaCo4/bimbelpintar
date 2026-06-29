/*
  Warnings:

  - The values [SUKSES,GAGAL] on the enum `Pembelian_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Pembelian` MODIFY `status` ENUM('PENDING', 'SUCCESS', 'FAILED', 'CHALLENGE', 'SETTLEMENT', 'EXPIRE', 'CANCEL') NOT NULL DEFAULT 'PENDING';
