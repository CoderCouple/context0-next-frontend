"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";

export const Companies = () => {
  const [logos, setLogos] = useState([
    [
      {
        title: "netflix",
        src: "/logos/netflix.png",
      },
      {
        title: "google",
        src: "/logos/google.webp",
      },
      {
        title: "meta",
        src: "/logos/meta.png",
      },
      {
        title: "onlyfans",
        src: "/logos/onlyfans.png",
      },
    ],
    [
      {
        title: "netflix second",
        src: "/logos/netflix.png",
      },
      {
        title: "google second",
        src: "/logos/google.webp",
      },
      {
        title: "meta second",
        src: "/logos/meta.png",
      },
      {
        title: "onlyfans second",
        src: "/logos/onlyfans.png",
      },
    ],
  ]);
  const [activeLogoSet, setActiveLogoSet] = useState(logos[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const flipLogos = () => {
    setLogos((currentLogos) => {
      const newLogos = [...currentLogos.slice(1), currentLogos[0]];
      setActiveLogoSet(newLogos[0]);
      setIsAnimating(true);
      return newLogos;
    });
  };

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        flipLogos();
      }, 3000);
      return () => clearTimeout(timer); // Clear timeout if component unmounts or isAnimating changes
    }
  }, [isAnimating]);

  return (
    <div className="relative z-20 py-10 md:py-40">
      <Heading as="h2">Trusted by the best companies</Heading>
      <Subheading className="text-center text-neutral-600 dark:text-neutral-300">
        Context Zero AI is the choice of all the fortune 500 companies.
      </Subheading>

      <div className="relative mt-20 flex h-full w-full flex-wrap justify-center gap-10 md:gap-40">
        <AnimatePresence
          mode="popLayout"
          onExitComplete={() => {
            setIsAnimating(false);
          }}
        >
          {activeLogoSet.map((logo, idx) => (
            <motion.div
              initial={{
                y: 40,
                opacity: 0,
                filter: "blur(10px)",
              }}
              animate={{
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
              }}
              exit={{
                y: -40,
                opacity: 0,
                filter: "blur(10px)",
              }}
              transition={{
                duration: 0.8,
                delay: 0.1 * idx,
                ease: [0.4, 0, 0.2, 1],
              }}
              key={logo.title}
              className="relative"
            >
              <Image
                src={logo.src}
                alt={logo.title}
                width="100"
                height="100"
                className="h-10 w-20 object-contain filter md:h-20 md:w-40"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
