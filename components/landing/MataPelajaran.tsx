const mapelList = [
  { label: "Matematika", emoji: "📐", color: "bg-blue-50 text-blue-700" },
  { label: "IPA", emoji: "🔬", color: "bg-green-50 text-green-700" },
  { label: "IPS", emoji: "🌍", color: "bg-purple-50 text-purple-700" },
  { label: "B. Indonesia", emoji: "📝", color: "bg-pink-50 text-pink-700" },
  { label: "B. Inggris", emoji: "🌐", color: "bg-orange-50 text-orange-700" },
];

export default function MataPelajaran() {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-3">
            Mata pelajaran tersedia
          </h2>
          <p className="text-gray-500 text-sm">
            Untuk semua jenjang dari SMP hingga SMA
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {mapelList.map((mapel) => (
            <div
              key={mapel.label}
              className={`${mapel.color} rounded-2xl p-4 sm:p-5 text-center w-[calc(50%-6px)] sm:w-auto sm:flex-1`}
            >
              <div className="text-3xl mb-2">{mapel.emoji}</div>
              <div className="text-sm font-medium">{mapel.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
