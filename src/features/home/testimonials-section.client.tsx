"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { TestimonialSummary } from "@/content/types";
import { wrapImageIndex } from "@/components/media/carousel-index";
import { EASE, Reveal, WordReveal } from "@/components/motion/portfolio-motion.client";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function QuoteMark() {
  return (
    <svg className="testimonial-mark" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.58 17.32C3.55 16.23 3 15 3 13.01c0-3.5 2.46-6.64 6.03-8.19l.89 1.38c-3.33 1.8-3.98 4.14-4.24 5.61.54-.28 1.24-.38 1.93-.31 1.8.17 3.22 1.65 3.22 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.17Zm10 0C13.55 16.23 13 15 13 13.01c0-3.5 2.46-6.64 6.03-8.19l.89 1.38c-3.33 1.8-3.98 4.14-4.24 5.61.54-.28 1.24-.38 1.93-.31 1.8.17 3.22 1.65 3.22 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.17Z" />
    </svg>
  );
}

function TestimonialCard({ item }: { item: TestimonialSummary }) {
  return (
    <>
      <QuoteMark />
      {item.sample && <span className="testimonial-sample">Sample</span>}
      <blockquote className="testimonial-quote">
        {item.content.split(/\n\s*\n/).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </blockquote>
      <figcaption className="testimonial-author">
        {item.image ? (
          <img className="testimonial-avatar" src={item.image} alt="" width={44} height={44} loading="lazy" />
        ) : (
          <span className="testimonial-avatar testimonial-initials" aria-hidden="true">
            {initials(item.name)}
          </span>
        )}
        <span className="testimonial-who">
          <span className="testimonial-name">{item.name}</span>
          <span className="testimonial-company">
            {item.role ? `${item.role}, ` : ""}
            {item.company}
          </span>
        </span>
        {item.companyLogo && <img className="testimonial-logo" src={item.companyLogo} alt="" height={28} loading="lazy" />}
      </figcaption>
    </>
  );
}

/**
 * Client quotes from content/testimonials, one at a time. Every slide sits in the same grid cell so the card keeps
 * the height of the longest quote and the page never jumps; only the active slide is visible and focusable.
 */
export function TestimonialsSection({ testimonials }: { testimonials: TestimonialSummary[] }) {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;
  if (!count) return null;
  const step = (delta: number) => setIndex((current) => wrapImageIndex(current + delta, count));

  return (
    <section className="home-section" id="testimonials" aria-labelledby="testimonials-heading">
      <WordReveal text="Testimonials" id="testimonials-heading" className="heading-section" />
      <Reveal>
        <div
          className="testimonial-slider"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          tabIndex={count > 1 ? 0 : undefined}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") step(1);
            if (event.key === "ArrowLeft") step(-1);
          }}
        >
          <motion.div
            className="testimonial-stage"
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50 || info.velocity.x < -400) step(1);
              else if (info.offset.x > 50 || info.velocity.x > 400) step(-1);
            }}
          >
            {testimonials.map((item, slide) => {
              const active = slide === index;
              return (
                <motion.figure
                  key={item.slug}
                  className="testimonial"
                  aria-roledescription="slide"
                  aria-label={`${slide + 1} of ${count}`}
                  aria-hidden={!active}
                  inert={!active}
                  initial={false}
                  animate={{ opacity: active ? 1 : 0, x: active ? 0 : slide < index ? -24 : 24, filter: active ? "blur(0px)" : "blur(4px)" }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <TestimonialCard item={item} />
                </motion.figure>
              );
            })}
          </motion.div>
          {count > 1 && (
            <div className="testimonial-controls">
              <div className="testimonial-dots">
                {testimonials.map((item, dot) => (
                  <button
                    type="button"
                    key={item.slug}
                    className="testimonial-dot-hit"
                    aria-label={`Show testimonial ${dot + 1} of ${count}`}
                    aria-current={dot === index ? "true" : undefined}
                    onClick={() => setIndex(dot)}
                  >
                    <motion.span
                      className="testimonial-dot"
                      animate={{ width: dot === index ? 18 : 6, opacity: dot === index ? 1 : 0.35 }}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  </button>
                ))}
              </div>
              <div className="testimonial-arrows">
                <motion.button type="button" whileTap={{ scale: 0.88 }} className="testimonial-btn" aria-label="Previous testimonial" onClick={() => step(-1)}>
                  <ChevronLeftIcon size={14} />
                </motion.button>
                <motion.button type="button" whileTap={{ scale: 0.88 }} className="testimonial-btn" aria-label="Next testimonial" onClick={() => step(1)}>
                  <ChevronRightIcon size={14} />
                </motion.button>
              </div>
            </div>
          )}
          <span className="sr-only" aria-live="polite">
            {count > 1 ? `Testimonial ${index + 1} of ${count}: ${testimonials[index].name}, ${testimonials[index].company}` : ""}
          </span>
        </div>
      </Reveal>
    </section>
  );
}
