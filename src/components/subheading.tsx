import React from "react";

import { AnimationProps, MotionProps } from "framer-motion";
import Balancer from "react-wrap-balancer";

import { cn } from "@/lib/utils";

export const Subheading = ({
  className,
  as: Tag = "h2",
  children,
}: {
  className?: string;
  as?: any;
  children: any;
  props?: React.HTMLAttributes<HTMLHeadingElement | AnimationProps>;
} & MotionProps &
  React.HTMLAttributes<HTMLHeadingElement | AnimationProps>) => {
  return (
    <Tag
      className={cn(
        "mx-auto my-4 max-w-4xl text-left text-sm md:text-base",
        "dark:text-muted-dark text-center font-normal text-muted",
        className
      )}
    >
      <Balancer>{children}</Balancer>
    </Tag>
  );
};
