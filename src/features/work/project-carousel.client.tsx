"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { useState } from "react";
import { wrapImageIndex } from "@/components/media/carousel-index";
import { EASE } from "@/components/motion/portfolio-motion.client";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { ProjectMock, mockSlides, type MockTheme } from "./project-mock";

type Image = { src: string; alt: string; width: number; height: number };
type Slide = { type: "image"; image: Image } | { type: "mock"; kind: (typeof mockSlides)[number] };

const slideVariants: Variants = {
  enter: (direction: number) => ({ x: direction >= 0 ? "40%" : "-40%", opacity: 0, scale: 0.96, filter: "blur(8px)" }),
  center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: (direction: number) => ({ x: direction >= 0 ? "-40%" : "40%", opacity: 0, scale: 0.96, filter: "blur(8px)" }),
};

export function ProjectCarousel({
  title,
  shortTitle,
  tags,
  images,
  theme,
}: {
  title: string;
  shortTitle: string;
  tags: string[];
  images: Image[];
  theme: MockTheme;
}) {
  const slides: Slide[] = images.length
    ? images.map((image) => ({ type: "image", image }))
    : mockSlides.map((kind) => ({ type: "mock", kind }));
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const count = slides.length;
  const step = (delta: number) => setState(([current]) => [wrapImageIndex(current + delta, count), delta]);
  const jump = (target: number) => setState(([current]) => [target, target > current ? 1 : -1]);
  const slide = slides[index];

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} images`}
      tabIndex={count > 1 ? 0 : undefined}
      style={{ background: theme.frame }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={index}
          className="carousel-slide"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: EASE }}
          drag={count > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50 || info.velocity.x < -400) step(1);
            else if (info.offset.x > 50 || info.velocity.x > 400) step(-1);
          }}
        >
          {slide.type === "image" ? (
            <img
              className="carousel-image"
              src={slide.image.src}
              alt={slide.image.alt}
              width={slide.image.width}
              height={slide.image.height}
              draggable={false}
              style={{ objectFit: slide.image.height > slide.image.width ? "contain" : "cover" }}
            />
          ) : (
            <ProjectMock kind={slide.kind} theme={theme} name={shortTitle} tags={tags} />
          )}
        </motion.div>
      </AnimatePresence>
      {count > 1 && (
        <>
          <div className="carousel-ctrl">
            <motion.button type="button" whileTap={{ scale: 0.85 }} className="carousel-btn" aria-label="Previous slide" onClick={() => step(-1)}>
              <ChevronLeftIcon size={12} />
            </motion.button>
            <div className="carousel-dots">
              {slides.map((_, dot) => (
                <button
                  type="button"
                  key={dot}
                  aria-label={`Slide ${dot + 1} of ${count}`}
                  aria-current={dot === index ? "true" : undefined}
                  onClick={() => jump(dot)}
                  className="carousel-dot-hit"
                >
                  <motion.span
                    className="carousel-dot"
                    animate={{ width: dot === index ? 18 : 5, opacity: dot === index ? 1 : 0.45 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                </button>
              ))}
            </div>
            <motion.button type="button" whileTap={{ scale: 0.85 }} className="carousel-btn" aria-label="Next slide" onClick={() => step(1)}>
              <ChevronRightIcon size={12} />
            </motion.button>
          </div>
          <span className="flick-hint" aria-hidden="true">
            flick to navigate
          </span>
        </>
      )}
      <span className="sr-only" aria-live="polite">
        Slide {index + 1} of {count}
      </span>
    </div>
  );
}
