"use client";

import Image from "next/image";
import React from "react";

import { motion } from "framer-motion";

import { BlurImage } from "@/components/blur-image";

export const SkeletonOne = () => {
  return (
    <div className="relative flex h-full gap-10 p-8">
      <div className="group mx-auto h-full w-full bg-white p-5 shadow-2xl dark:bg-neutral-900 md:w-[90%]">
        <div className="flex h-full w-full flex-1 flex-col space-y-2 opacity-20 dark:opacity-60">
          <UserMessage>
            I want to generate an image of two people, fighting outside a bar.
            They fight to the core. Once they&apos;re done, they sit down and
            drink beer.
          </UserMessage>
          <AIMessage>
            Certainly, I&apos;m generating this picture for you in a while. BTW
            are you talking about THAT movie?
          </AIMessage>
          <UserMessage>
            I don&apos;t know what you&apos;re talking about.
          </UserMessage>
          <AIMessage>Are you sure?</AIMessage>
          <UserMessage>
            Yes, I&apos;m sure. But if you&apos;re generating that scene, make
            sure the fighters have clown shoes and rubber chickens instead of
            fists!
          </UserMessage>
          <AIMessage>Affirmative, here&apos;s your image.</AIMessage>
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col gap-4">
        <div className="r z-20 mx-auto h-[250px] w-[250px] flex-shrink-0 rounded-[32px] border border-neutral-200 bg-neutral-100 p-2 transition duration-200 group-hover:scale-[1.02] dark:border-neutral-700 dark:bg-neutral-800 md:h-[300px] md:w-[300px]">
          <div className="flex-shrink-0 rounded-[24px] border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-black">
            <BlurImage
              src="/skeleton-one.png"
              alt="header"
              width={800}
              height={800}
              className="aspect-square h-full w-full flex-shrink-0 rounded-[20px] object-cover object-bottom grayscale"
            />
          </div>
        </div>
        <div className="r z-20 mx-auto h-[250px] w-[250px] flex-shrink-0 rounded-[32px] border border-neutral-200 bg-neutral-100 p-2 transition duration-200 group-hover:scale-[1.02] dark:border-neutral-700 dark:bg-neutral-800 md:h-[300px] md:w-[300px]">
          <div className="flex-shrink-0 rounded-[24px] border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-black">
            <BlurImage
              src="/tyler.jpeg"
              alt="header"
              width={800}
              height={800}
              className="aspect-square h-full w-full flex-shrink-0 rounded-[20px] object-cover object-bottom grayscale"
            />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-60 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-60 w-full bg-gradient-to-b from-white via-transparent to-transparent dark:from-black" />
    </div>
  );
};

const UserMessage = ({ children }: { children: React.ReactNode }) => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  return (
    <motion.div
      variants={variants}
      className="flex flex-row items-start space-x-2 rounded-2xl bg-white p-2 dark:bg-neutral-900"
    >
      <Image
        src="/avatar.jpeg"
        alt="avatar"
        height="100"
        width="100"
        className="h-4 w-4 rounded-full md:h-10 md:w-10"
      />
      <p className="text-[10px] text-neutral-500 sm:text-sm">{children}</p>
    </motion.div>
  );
};

const AIMessage = ({ children }: { children: React.ReactNode }) => {
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      transition: {
        duration: 0.2,
      },
    },
  };
  return (
    <motion.div
      variants={variantsSecond}
      className="flex flex-row items-center justify-start space-x-2 rounded-2xl bg-white p-2 dark:bg-neutral-900"
    >
      <div className="h-4 w-4 flex-shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 md:h-10 md:w-10" />
      <p className="text-[10px] text-neutral-500 sm:text-sm">{children}</p>
    </motion.div>
  );
};
