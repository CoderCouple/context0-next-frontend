import { Metadata } from "next";
import dynamic from "next/dynamic";

import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Pricing } from "@/components/pricing";
import { Subheading } from "@/components/subheading";

// Lazy load heavy components
const Background = dynamic(() => import("@/components/background").then(mod => ({ default: mod.Background })), {
  loading: () => <div className="absolute inset-0 bg-gray-50 dark:bg-black" />
});
const Companies = dynamic(() => import("@/components/companies").then(mod => ({ default: mod.Companies })), {
  loading: () => <div className="h-32 bg-gray-50 dark:bg-black animate-pulse rounded" />
});
const PricingTable = dynamic(() => import("./pricing-table").then(mod => ({ default: mod.PricingTable })), {
  loading: () => <div className="h-96 bg-gray-50 dark:bg-black animate-pulse rounded" />
});

export const metadata: Metadata = {
  title: "Pricing - Context0",
  description:
    "Context0 is a secure AI memory layer that captures, stores, and injects personal context across assistants like ChatGPT, enabling smarter, more personalized interactions through local-first storage and user-controlled permissions.",
  openGraph: {
    images: ["https://ai-saas-template-aceternity.vercel.app/banner.png"],
  },
};

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <Background />
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          <Heading as="h1">Simple pricing that scales with you</Heading>
          <Subheading className="text-center text-neutral-600 dark:text-neutral-300">
            Choose the perfect plan for your AI memory needs. From developers getting started
            to enterprises requiring advanced security and compliance features.
          </Subheading>
        </div>
        <Pricing />
        <PricingTable />
        <Companies />
      </Container>
    </div>
  );
}
