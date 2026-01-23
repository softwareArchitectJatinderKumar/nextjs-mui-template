'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Box, Container, Paper, Typography } from '@mui/material';
import type { Swiper as SwiperType } from 'swiper';

// Essential Swiper Styles
import 'swiper/css';
import 'swiper/css/pagination';

const EventsCarousel = () => {
  const swiperRef = useRef<SwiperType>(null);
  const serverUrl = 'https://www.lpu.in/lpu-assets/images/cif/';

  const events = [
    {
      img: 'Advanced-Materials-Characterization.webp',
      title: 'Short Term Course on Advanced Materials and Characterization: Theory & Applications',
      date: '(03 November - 07 November, 2025)'
    },
    {
      img: 'summer-training-programme-2025.webp',
      title: 'ANRF Sponsored Summer Training Programme',
      date: '(2 June - 11 July 2025)'
    },
    {
      img: 'event-10.jpg',
      title: 'Discovering the Crystalline and Nano world using X-ray Diffraction and Particle Size and Zeta Potential Analyzer: A National Workshop',
      date: '(24 - 26 April 2025)'
    },
    {
      img: 'event-9.jpg',
      title: 'National Workshop on Advance Research with Field Emission Scanning Electron Microscopy: Exploring the Nano-Structural Imaging',
      date: '(27 - 29 March 2025)'
    },
    {
      img: 'event-7.jpg',
      title: 'National Workshop on Advanced Chromatographic Techniques Theory & Applications',
      date: '(19 - 21 September, 2024)'
    },
    {
      img: 'event-8.jpg',
      title: 'SHORT-TERM COURSE on Advanced Materials analysis & Characterization Techniques: Hands-on-Training and Data Interpretation',
      date: '(09 - 13 December, 2024)'
    },
    {
      img: 'event-1.jpg',
      title: 'National workshop on X-Ray Diffraction and Particle Size Analyzer',
      date: '(26 - 27 April 2024)'
    },
    {
      img: 'event-2.jpg',
      title: 'Summer Training Programme',
      date: '(3 June - 13 July 2024)'
    },
    {
      img: 'event-3.jpg',
      title: 'Workshop on Field Emission Scanning Electron Microscope',
      date: '(29 - 30 March 2024)'
    }
  ];

  return (
    <Box component="section" sx={{  py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        
        {/* Your Custom Header Structure */}
        <div className="heading-wraper mb-4">
          <div className="main-head d-flex justify-content-between align-items-center">
            <h2 className="fw-bold">Events & Happenings</h2>
            <div className="inner-testi-slider-nav">
              <button 
                id="prev_event_slide" 
                className="inner-testi-prev-arrow" 
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <img src="https://www.lpu.in/lpu-assets/images/icons/vector-left.svg" alt="prev" />
              </button>
              <button 
                id="next_event_slide" 
                className="inner-testi-next-arrow" 
                onClick={() => swiperRef.current?.slideNext()}
              >
                <img src="https://www.lpu.in/lpu-assets/images/icons/vector-right.svg" alt="next" />
              </button>
            </div>
          </div>
        </div>

        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 8000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="eventsSwiper"
          style={{ paddingBottom: '140px' }}
        >
          {events.map((event, index) => (
            <SwiperSlide key={index}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 4,
                  overflow: 'hidden',
                  height: '100%',
                  border: '1px solid #eee',
                  '&:hover': { transform: 'translateY(-5px)', transition: '0.3s' }
                }}
              >
                <Box
                  component="img"
                  src={`${serverUrl}${event.img}`}
                  alt={event.title}
                  sx={{ width: '100%', height: 220, objectFit: 'cover' }}
                />
                <Box sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, minHeight: '8.5em', mb: 1 }}>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.date}
                  </Typography>
                </Box>
              </Paper>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      {/* Adding LPU specific arrow styles */}
      <style jsx>{`
        .inner-testi-slider-nav {
          display: flex;
          gap: 10px;
        }
        .inner-testi-prev-arrow, .inner-testi-next-arrow {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .inner-testi-prev-arrow:hover, .inner-testi-next-arrow:hover {
          background: #ef7d00;
        }
        .inner-testi-prev-arrow:hover img, .inner-testi-next-arrow:hover img {
          filter: brightness(0) invert(1);
        }
      `}</style>
    </Box>
  );
};

export default EventsCarousel;

// import React from 'react';
// import { EventItem } from '../../types/cif';

// interface StyleProps {
//   styles: { readonly [key: string]: string };
// }
// const EventsSection: React.FC<StyleProps> = ({ styles }) => {
 

//    const  events = [
//     {
//       img: 'Advanced-Materials-Characterization.webp',//short-term-course-2025.webp',
//       title: 'Short Term Course on Advanced Materials and Characterization: Theory & Applications',
//       date: '(03 November - 07 November, 2025)'
//     },
//     {
//       img: 'summer-training-programme-2025.webp',
//       title: 'ANRF Sponsored Summer Training Programme',
//       date: '(2 June - 11 July 2025)'
//     },
//     {
//       img: 'event-10.jpg',
//       title: 'Discovering the Crystalline and Nano world using X-ray Diffraction and Particle Size and Zeta Potential Analyzer: A National Workshop',
//       date: '(24 - 26 April 2025)'
//     },
//     {
//       img: 'event-9.jpg',
//       title: 'National Workshop on Advance Research with Field Emission Scanning Electron Microscopy: Exploring the Nano-Structural Imaging',
//       date: '(27 - 29 March 2025)'
//     },
//     {
//       img: 'event-7.jpg',
//       title: 'National Workshop on Advanced Chromatographic Techniques Theory & Applications',
//       date: '(19 - 21 September, 2024)'
//     },
//     {
//       img: 'event-8.jpg',
//       title: 'SHORT-TERM COURSE on Advanced Materials analysis & Characterization Techniques: Hands-on-Training and Data Interpretation',
//       date: '(09 - 13 December, 2024)'
//     },
//     {
//       img: 'event-1.jpg',
//       title: 'National workshop on X-Ray Diffraction and Particle Size Analyzer',
//       date: '(26 - 27 April 2024)'
//     },
//     {
//       img: 'event-2.jpg',
//       title: 'Summer Training Programme',
//       date: '(3 June - 13 July 2024)'
//     },
//     {
//       img: 'event-3.jpg',
//       title: 'Workshop on Field Emission Scanning Electron Microscope',
//       date: '(29 - 30 March 2024)'
//     },
//     {
//       img: 'summer-training-programme-2025.webp',
//       title: 'ANRF Sponsored Summer Training Programme',
//       date: '(2 June - 11 July 2025)'
//     },
//   ];
//   // Triplicate the events to ensure there's always content filling the horizontal space
//   const displayEvents = [...events, ...events, ...events];

//   return (
//     <div className={styles.marqueeWrapper}>
//       <div className={styles.marquee}>
//         {displayEvents.map((event, i) => (
//           <div key={i} className={styles.eventCard}>
//              <img 
//                src={`https://www.lpu.in/lpu-assets/images/cif/${event.img}`} 
//                className={styles.eventImg} 
//                alt={event.title} 
//              />
//              <div className="p-3">
//                 <h4 className={styles.eventTitle}>{event.title}</h4>
//                 <p className={styles.eventDate}><b>Date:</b> {event.date}</p>
//              </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
// export default EventsSection;

// import React from 'react';
// import { EventItem } from '../../types/cif';

// interface StyleProps {
//   styles: { readonly [key: string]: string };
// }

// const EventsSection: React.FC<StyleProps> = ({ styles }) => {
//   const events: EventItem[] = [
//     { img: "event-3.jpg", title: "Workshop on FESEM", date: "29 - 30 March 2024" },
//     { img: "event-1.jpg", title: "National workshop on XRD", date: "26 - 27 April 2024" },
//     { img: "event-2.jpg", title: "Summer Training Programme", date: "3 June - 13 July 2024" }
//   ];

//   // We duplicate the events array to ensure the marquee has enough items to scroll infinitely
//   const displayEvents = [...events, ...events, ...events];

//   return (
//     <section className="sectionGlobal bgDarkYellow">
//       <div className="container">
//         <h2 className="mainHeading">Events & Happenings</h2>
        
//         <div className={styles.marqueeWrapper}>
//           <div className={styles.marquee}>
//             {displayEvents.map((event, i) => (
//               <div key={i} className={styles.eventCard}>
//                 <img 
//                   src={`https://www.lpu.in/lpu-assets/images/cif/${event.img}`} 
//                   alt={event.title} 
//                   className={styles.eventImg}
//                 />
//                 <div className="mt-3">
//                   <h3 className={styles.eventTitle}>{event.title}</h3>
//                   <span className={styles.eventDate}>({event.date})</span>
//                 </div>
//                 <p className={styles.eventDetails}>
//                   Join us for this specialized session at the Central Instrumentation Facility.
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default EventsSection;

// import React from 'react';
// import { EventItem } from '../../types/cif';

// interface StyleProps {
//   styles: { readonly [key: string]: string };
// }

// const EventsSection: React.FC<StyleProps> = ({ styles }) => {
//   const events: EventItem[] = [
//     { img: "event-3.jpg", title: "Workshop on FESEM", date: "29 - 30 March 2024" },
//     { img: "event-1.jpg", title: "National workshop on XRD", date: "26 - 27 April 2024" },
//     { img: "event-2.jpg", title: "Summer Training Programme", date: "3 June - 13 July 2024" }
//   ];

//   return (
//     <section className="section bgDarkYellow">
//       <div className="container">
//         <h2>Events & Happenings</h2>
//         <div className={styles.cifSlider}>
//           {events.map((event, i) => (
//             <div key={i} className={styles.cifItem}>
//               <img src={`https://www.lpu.in/lpu-assets/images/cif/${event.img}`} alt={event.title} />
//               <div className="mt-4">
//                 <strong>{event.title}</strong><br />({event.date})
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default EventsSection;
