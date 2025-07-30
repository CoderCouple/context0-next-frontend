import { Metadata } from "next";

import { Background } from "@/components/background";
import { ContactForm } from "@/components/contact";
import { FeaturedTestimonials } from "@/components/featured-testimonials";
import { HorizontalGradient } from "@/components/horizontal-gradient";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us - Everything AI",
  description:
    "Everything AI is a platform that provides a wide range of AI tools and services to help you stay on top of your business. Generate images, text and everything else that you need to get your business off the ground.",
  openGraph: {
    images: ["https://ai-saas-template-aceternity.vercel.app/banner.png"],
  },
};

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden bg-gray-50 px-4 py-20 dark:bg-black md:px-20 md:py-0">
      <div className="relative grid min-h-screen w-full grid-cols-1 overflow-hidden md:grid-cols-2">
        <Background />
        <ContactForm />
        <div className="relative z-20 hidden w-full items-center justify-center overflow-hidden border-l border-neutral-100 bg-gray-50 dark:border-neutral-900 dark:bg-black md:flex">
          <div className="mx-auto max-w-sm">
            <FeaturedTestimonials />
            <p
              className={cn(
                "text-neutral-700 dark:text-neutral-200 text-center text-xl font-semibold"
              )}
            >
              Context Zero AI is used by thousands of users
            </p>
            <p
              className={cn(
                "mt-8 text-center text-base font-normal text-neutral-500 dark:text-neutral-200"
              )}
            >
              With lots of AI applications around, Context Zero AI stands out with
              its state of the art memory layer capabilities.
            </p>
          </div>
          <HorizontalGradient className="top-20" />
          <HorizontalGradient className="bottom-20" />
          <HorizontalGradient className="inset-y-0 -right-80 h-full rotate-90 scale-x-150 transform" />
          <HorizontalGradient className="inset-y-0 -left-80 h-full rotate-90 scale-x-150 transform" />
        </div>
      </div>
    </div>
  );
}
