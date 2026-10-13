import FeaturedProjects from "@/components/home/FeaturedProjects";
import FullStackOverview from "@/components/home/FullStackOverview";
import Hero from "@/components/home/Hero";
import ServicesPreview from "@/components/home/ServicesPreview";
import TechMarquee from "@/components/home/TechMarquee";
import CallToAction from "@/components/ui/CallToAction";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <FeaturedProjects />
      <FullStackOverview />
      <ServicesPreview />
      <CallToAction />
    </>
  );
}
