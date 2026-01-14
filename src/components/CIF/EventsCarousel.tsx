'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import styles from '@/styles/EventsCarousel.module.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface EventItem {
  title: string;
  date: string;
  img: string;
}

interface EventsCarouselProps {
  events: EventItem[];
  serverUrl: string;
}

const chunkArray = (arr: EventItem[], size: number) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export default function EventsCarousel({
  events,
  serverUrl,
}: EventsCarouselProps) {
  const groupedEvents = chunkArray(events, 3);

  return (
    <section className="section ">
      <div className="container">
        <div className="heading-wraper mb-4">
          <div className="main-head d-flex justify-content-between align-items-center">
            <h2>Events & Happenings</h2>

            <div className="inner-testi-slider-nav">
              <button className="inner-testi-prev-arrow" id="prev_event_slide">
                <img
                  src="https://www.lpu.in/lpu-assets/images/icons/vector-left.svg"
                  alt="Previous"
                />
              </button>
              <button className="inner-testi-next-arrow" id="next_event_slide">
                <img
                  src="https://www.lpu.in/lpu-assets/images/icons/vector-right.svg"
                  alt="Next"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 6600, disableOnInteraction: false }}
          navigation={{
            prevEl: '#prev_event_slide',
            nextEl: '#next_event_slide',
          }}
        >
          {groupedEvents.map((group, index) => (
            <SwiperSlide key={index}>
              <div className="row text-center">
                {group.map((event, idx) => (
                  <div className="col-md-3 p-4 m-2" key={idx}>
                    <img
                      src={`${serverUrl}${event.img}`}
                      alt={event.title}
                      className="img-fluid"
                    />
                    <div className="mt-4 mb-2">
                      <strong className="d-block">{event.title}</strong>
                      {event.date}
                    </div>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
