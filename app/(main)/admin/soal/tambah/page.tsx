import DashboardLayout from "@/components/ui/DashboardLayout";
import SoalForm from "@/components/ui/SoalForm";

export default function TambahSoalPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-xl font-medium text-gray-900 mb-6">
          Tambah Mapel baru
        </h1>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <SoalForm mode="tambah" />
        </div>
      </div>
    </DashboardLayout>
  );
}
