"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { Link } from "next-view-transitions";
import { HiArrowRight } from "react-icons/hi2";
import Balancer from "react-wrap-balancer";

import { Badge } from "@/components/badge";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  const router = useRouter();
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden pt-20  md:pt-40">
      <motion.div
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
        }}
        className="flex justify-center mb-10"
      >
        <Badge onClick={() => router.push("/blog/top-5-llm-of-all-time")}>
          The era of next gen AI apps has just begun.
        </Badge>
      </motion.div>
      <motion.h1
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
        }}
        className="relative z-10 mx-auto mt-6 max-w-6xl text-center text-2xl font-semibold md:text-4xl lg:text-8xl"
      >
        <Balancer> 
          <span className="bg-gradient-to-r from-orange-500 to-violet-600 text-transparentinline-block text-transparent bg-clip-text"> Create </span> <span className="text-neutral-200 dark:text-neutral-800" >| </span>
          <span className="bg-gradient-to-r from-orange-500 to-violet-600 text-transparentinline-block text-transparent bg-clip-text"> Deploy </span> <span className="text-neutral-200 dark:text-neutral-800">| </span>
          <span className="bg-gradient-to-r from-orange-500 to-violet-600 text-transparentinline-block text-transparent bg-clip-text"> Run </span> 
          </Balancer>
        <Balancer> AI-Powered Workflows</Balancer>
      </motion.h1>
      <motion.p
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
          delay: 0.2,
        }}
        className="dark:text-white/80 text-neutral-800 relative z-10 mx-auto mt-7 text-muted max-w-3xl text-center text-base md:text-xl"
      >
        <Balancer>
          Context AI connects all your AI agents and MCP servers into one seamless platform — so you can build and deploy workflows with a single click.
        </Balancer>
      </motion.p>
      <motion.div
        initial={{
          y: 80,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          ease: "easeOut",
          duration: 0.5,
          delay: 0.4,
        }}
        className="relative z-10 mt-6 flex items-center justify-center gap-4"
      >
        <Button className=" rounded-full">Get started</Button>
        <Button
          asChild
          variant="simple"
          className="group flex items-center space-x-2"
        >
          <Link href="/contact">
            <span>Contact us</span>
            <HiArrowRight className="h-3 w-3 stroke-[1px] dark:text-neutral-200 text-neutral-800 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Button>
      </motion.div>
      <div className="relative mt-20 rounded-[32px] border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full scale-[1.1] bg-gradient-to-b from-transparent via-white to-white dark:via-black/50 dark:to-black" />
        <div className="rounded-[24px] border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-black">
          <Image
            src="/header.png"
            alt="header"
            width={1920}
            height={1080}
            className="rounded-[20px]"
          />
        </div>
      </div>
    </div>
  );
};
