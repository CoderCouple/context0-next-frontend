import React from "react";

import { GridLineHorizontal, GridLineVertical } from "@/components/grid-lines";
import { Heading } from "@/components/heading";
import { SkeletonOne } from "@/components/skeletons/first";
import { SkeletonFour } from "@/components/skeletons/fourth";
import { SkeletonTwo } from "@/components/skeletons/second";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";

import { SkeletonThree } from "./skeletons/third";

export const Features = () => {
  const features = [
    {
      title: "Generate images with text",
      description:
        "Generate images from a text prompt, a video, or a video segment in bulk at the speed of light.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 md:col-span-4 border-b border-r dark:border-neutral-800",
    },
    {
      title: "Create stupid simple chatbots",
      description:
        "Create Chatbots with a single button click. Customize as per your requirements and the AI will take care of the rest.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 md:col-span-2 dark:border-neutral-800",
    },
    {
      title: "We support every single LLM",
      description:
        "Whether it's OpenAI, GroQ or Your Mom's Basement LLM, we support everything.",
      skeleton: <SkeletonThree />,
      className: "col-span-1 md:col-span-3 border-r dark:border-neutral-800",
    },
    {
      title: "Deploy in seconds",
      description:
        "With our blazing fast, state of the art, cutting edge, we are so back cloud servies (read AWS) - you can deploy your model in seconds.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 md:col-span-3",
    },
  ];
  return (
    <div className="relative z-20 py-10 md:py-40">
      <Heading as="h2">Packed with thousands of features</Heading>
      <Subheading className="text-center text-neutral-600 dark:text-neutral-300">
        From Image generation to video generation, Context Zero AI has APIs for
        literally everything. It can even create this website copy for you.
      </Subheading>

      <div className="relative">
        <div className="mt-12 grid grid-cols-1 md:grid-cols-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
        <GridLineHorizontal
          style={{
            top: 0,
            left: "-10%",
            width: "120%",
          }}
        />

        <GridLineHorizontal
          style={{
            bottom: 0,
            left: "-10%",
            width: "120%",
          }}
        />

        <GridLineVertical
          style={{
            top: "-10%",
            right: 0,
            height: "120%",
          }}
        />
        <GridLineVertical
          style={{
            top: "-10%",
            left: 0,
            height: "120%",
          }}
        />
      </div>
    </div>
  );
};

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("relative overflow-hidden p-4 sm:p-8", className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Heading as="h3" size="sm" className="text-left">
      {children}
    </Heading>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Subheading className="mx-0 my-2 max-w-sm text-left md:text-sm text-neutral-600 dark:text-neutral-300">
      {children}
    </Subheading>
  );
};
