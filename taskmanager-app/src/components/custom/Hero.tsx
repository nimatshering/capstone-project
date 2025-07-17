"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const Hero = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["It's Amazing", "Works wonderful", "Beautiful", "Work Smart"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full  py-10 lg:py-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2">
          <div className="flex gap-4 flex-col">
            <div className="flex gap-4 flex-col">
              <div className="flex gap-8 py-10 lg:py-20 items-center justify-center flex-col">
                <div className="flex gap-4 flex-col">
                  <h1 className="text-3xl md:text-5xl max-w-2xl tracking-tighter text-center font-regular">
                    <div className="text-spektr-cyan-50 lg:pb-20">
                      Task Management Made Simple
                    </div>
                    <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-10 md:pt-1">
                      &nbsp;
                      {titles.map((title, index) => (
                        <motion.span
                          key={index}
                          className="absolute font-semibold"
                          initial={{ opacity: 0, y: "-100" }}
                          transition={{ type: "spring", stiffness: 50 }}
                          animate={
                            titleNumber === index
                              ? {
                                  y: 0,
                                  opacity: 1,
                                }
                              : {
                                  y: titleNumber > index ? -150 : 150,
                                  opacity: 0,
                                }
                          }
                        >
                          {title}
                        </motion.span>
                      ))}
                    </span>
                  </h1>

                  <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
                    Managing a small business today is already tough. Avoid
                    further complications by ditching outdated, tedious trade
                    methods. Our goal is to streamline SMB trade, making it
                    easier and faster than ever.
                  </p>
                </div>
                <div className="flex flex-row gap-3">
                  <Link href="/register">
                    <Button size="lg" className="gap-4">
                      Sign up here <MoveRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-muted rounded-md aspect-square">
            <div className="w-full mx-auto">
              <div className="relative bg-muted rounded-md aspect-square overflow-hidden">
                <Image
                  src="/img/pm.jpg"
                  alt="imgt"
                  fill
                  className="bject-bottom-left object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
