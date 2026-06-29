import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.soal.createMany({
    data: [
      {
        judul: "Latihan soal persamaan kuadrat & pemfaktoran",
        mapel: "MATEMATIKA",
        kelas: 10,
        deskripsi:
          "Berisi soal-soal persamaan kuadrat lengkap dengan pembahasan.",
        harga: 15000,
        jumlahSoal: 40,
        durasi: 60,
        linkPembahasan: "https://contoh.com/soal-1",
      },
      {
        judul: "Soal sistem reproduksi manusia & hewan",
        mapel: "IPA",
        kelas: 9,
        deskripsi:
          "Soal IPA tentang sistem reproduksi lengkap dengan kunci jawaban.",
        harga: 12000,
        jumlahSoal: 35,
        durasi: 50,
        linkPembahasan: "https://contoh.com/soal-2",
      },
      {
        judul: "Reading comprehension & grammar UTBK",
        mapel: "BAHASA_INGGRIS",
        kelas: 11,
        deskripsi: "Latihan soal bahasa Inggris persiapan UTBK.",
        harga: 20000,
        jumlahSoal: 50,
        durasi: 75,
        linkPembahasan: "https://contoh.com/soal-3",
      },
      {
        judul: "Teks argumentasi, eksposisi & narasi",
        mapel: "BAHASA_INDONESIA",
        kelas: 8,
        deskripsi: "Soal bahasa Indonesia berbagai jenis teks.",
        harga: 10000,
        jumlahSoal: 30,
        durasi: 45,
        linkPembahasan: "https://contoh.com/soal-4",
      },
    ],
  });

  console.log("Seed berhasil!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
