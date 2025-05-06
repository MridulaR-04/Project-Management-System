"use client";

import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import companies from "@/data/companies";
import Image from "next/image";

const CompanyCarousel = () => {
  const duplicatedCompanies = [...companies, ...companies];
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000, // Instant transitions
          stopOnInteraction: false,
        }),
      ]}
      opts={{
        loop: true,
        align: "start",
        duration: 30, // Adjust scroll speed (higher = slower)
      }}
      className="w-full py-10"
    >
      <CarouselContent className="flex gap-5 sm:gap-20 items-center">
        {duplicatedCompanies.map(({ name, path, id }, index) => (
          <CarouselItem
            key={`${id}-${index}`} // Unique key with index
            className="basis-1/3 lg:basis-1/6 flex-none px-2"
          >
            <Image
              src={path}
              alt={name}
              width={200}
              height={56}
              className="h-9 sm:h-14 w-auto object-contain mx-auto"
              priority={index < companies.length} // Lazy load only duplicates
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default CompanyCarousel;
