import { Background } from "@/components/background";
import { Companies } from "@/components/companies";
import { Container } from "@/components/container";
import { CTA } from "@/components/cta";
import { Features } from "@/components/features";
import { GridFeatures } from "@/components/grid-features";
import { Hero } from "@/components/hero";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <div className="relative">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Background />
      </div>
      <Container className="flex min-h-screen flex-col items-center justify-between">
        <Hero />
        <Companies />
        <Features />
        <GridFeatures />
        <Testimonials />
      </Container>
      <div className="relative">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <Background />
        </div>
        <CTA />
      </div>
    </div>
  );
}
