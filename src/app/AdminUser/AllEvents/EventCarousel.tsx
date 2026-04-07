// =============================================================
//  events-crud/EventCarousel.tsx
//  Carousel sub-component — mirrors Angular's ngb-carousel
//  with chunkedEvents / updateChunks() logic from the .ts file.
// =============================================================

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EventModel, SERVER_URL } from './types';
import { chunkArray } from './useEventsCrud';
import styles from './EventsCrud.module.css';

interface EventCarouselProps {
  events: EventModel[];
}

export default function EventCarousel({ events }: EventCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mirrors Angular's updateChunks() responsive breakpoints
  const updateItemsPerSlide = useCallback(() => {
    const width = window.innerWidth;
    if (width < 768) setItemsPerSlide(1);
    else if (width < 992) setItemsPerSlide(2);
    else setItemsPerSlide(3);
  }, []);

  useEffect(() => {
    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, [updateItemsPerSlide]);

  const chunks = chunkArray(events.filter(e => e.eventCategory === 'Happenings'), itemsPerSlide);
  const upcomingchunks = chunkArray(events.filter(e => e.eventCategory === 'Upcoming'), itemsPerSlide);
  const totalSlides = chunks.length;

  // Auto-play — mirrors ngb-carousel [interval]="15000"
  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 15000);
  }, [totalSlides]);

  useEffect(() => {
    if (totalSlides > 1) startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalSlides, startAutoPlay]);

  const goTo = (idx: number) => {
    setCurrentSlide(((idx % totalSlides) + totalSlides) % totalSlides);
    startAutoPlay();
  };

  if (events.length === 0) return null;

  const currentChunk = chunks[currentSlide] || [];

  return (
    <section className={styles.carouselSection}>
      <div className="container">
        {/* Header + nav arrows — mirrors Angular's heading-wraper */}
        <div className={styles.carouselHeader}>
          <h2 className={styles.carouselTitle}>Events &amp; Happenings</h2>
          <div className={styles.carouselNavBtns}>
            <button
              className={styles.carouselNavBtn}
              onClick={() => goTo(currentSlide - 1)}
              aria-label="Previous slide"
            >
              <img
                src="https://www.lpu.in/lpu-assets/images/icons/vector-left.svg"
                alt="Previous"
              />
            </button>
            <button
              className={styles.carouselNavBtn}
              onClick={() => goTo(currentSlide + 1)}
              aria-label="Next slide"
            >
              <img
                src="https://www.lpu.in/lpu-assets/images/icons/vector-right.svg"
                alt="Next"
              />
            </button>
          </div>
        </div>

        {/* Slide content */}
        <div className={styles.slideRow}>
          {currentChunk.map((event) => (
            <div
              key={event.eventId}
              className={styles.slideCard}
              style={{ flex: `0 0 calc(${100 / itemsPerSlide}% - 16px)` }}
            >
              <img
                src={SERVER_URL + event.imageUrl}
                alt={event.eventName}
                className={`img-fluid ${styles.slideImage}`}
              />
              <div className={styles.slideCaption}>
                <strong>{event.eventName}</strong>
                <span>{event.eventDetails}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators — mirrors [showNavigationIndicators]="true" */}
        {totalSlides > 1 && (
          <div className={styles.indicators}>
            {chunks.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`${styles.dot} ${i === currentSlide ? styles.dotActive : ''}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
