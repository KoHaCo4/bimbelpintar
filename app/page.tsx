import LandingNavbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import CaraKerja from "@/components/landing/CaraKerja";
import MataPelajaran from "@/components/landing/MataPelajaran";
import Fitur from "@/components/landing/Fitur";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <Hero />
      <CaraKerja />
      <MataPelajaran />
      <Fitur />
      <CTA />
      <Footer />
    </div>
  );
}
