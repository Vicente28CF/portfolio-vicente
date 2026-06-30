import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import Stack from "@/components/sections/Stack";
import ServicesSection from "@/components/sections/ServicesSection";
import Projects from "@/components/sections/Projects";
import DemoSection from "@/components/sections/DemoSection";
import GitHubActivitySection from "@/components/sections/GitHubActivitySection";
import CompatibilitySection from "@/components/sections/CompatibilitySection";
import Contact from "@/components/sections/Contact";
import Providers from "@/components/Providers";

export default function Home() {
  return (
    <Providers>
      <Navbar />
      <main>
        <Hero />
        <Stack />
        <GitHubActivitySection />
        <ServicesSection />
        <Projects />
        <CompatibilitySection />
        <DemoSection />
        <Contact />
      </main>
    </Providers>
  );
}
