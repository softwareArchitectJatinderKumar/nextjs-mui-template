'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
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
    <section className="py-5 py-md-5">
      <div className="container-fluid px-lg-5" style={{ maxWidth: '1450px' }}>
        
        {/* Header Structure */}
        <div className="heading-wrapper mb-4">
          <div className="main-head d-flex justify-content-between align-items-center">
            <h2 className="fw-bold">Events & Happenings</h2>
            <div className="inner-testi-slider-nav d-flex gap-2">
              <button 
                className="inner-testi-prev-arrow shadow-sm" 
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous Slide"
              >
                <img src="https://www.lpu.in/lpu-assets/images/icons/vector-left.svg" alt="prev" />
              </button>
              <button 
                className="inner-testi-next-arrow shadow-sm" 
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next Slide"
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
          spaceBetween={25}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          breakpoints={{
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
          className="eventsSwiper pb-5"
        >
          {events.map((event, index) => (
            <SwiperSlide key={index} className="h-auto">
              <div className="card h-100 border-1 border-light-subtle rounded-4 overflow-hidden event-card shadow-sm">
                <div className="ratio ratio-4x3">
                  <img
                    src={`${serverUrl}${event.img}`}
                    className="card-img-top object-fit-cover"
                    alt={event.title}
                    loading="lazy"
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column">
                  <h6 className="card-title fw-bold mb-3 text-dark" style={{ minHeight: '4.5rem', lineHeight: '1.4' }}>
                    {event.title}
                  </h6>
                  <p className="card-text small text-secondary mt-auto">
                    <i className="bi bi-calendar3 me-2"></i>
                    {event.date}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        .event-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .event-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .inner-testi-prev-arrow, .inner-testi-next-arrow {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .inner-testi-prev-arrow:hover, .inner-testi-next-arrow:hover {
          background: #ef7d00;
          border-color: #ef7d00;
        }
        .inner-testi-prev-arrow:hover img, .inner-testi-next-arrow:hover img {
          filter: brightness(0) invert(1);
        }
        /* Swiper Pagination Styling */
        :global(.eventsSwiper .swiper-pagination-bullet-active) {
          background: #ef7d00 !important;
        }
        :global(.eventsSwiper .swiper-pagination) {
          bottom: 0px !important;
        }
      `}</style>
    </section>
  );
};

export default EventsCarousel;

// 'use client';

// import React, { useRef } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// import { Box, Container, Paper, Typography } from '@mui/material';
// import type { Swiper as SwiperType } from 'swiper';

// // Essential Swiper Styles
// import 'swiper/css';
// import 'swiper/css/pagination';

// const EventsCarousel = () => {
//   const swiperRef = useRef<SwiperType>(null);
//   const serverUrl = 'https://www.lpu.in/lpu-assets/images/cif/';

//   const events = [
//     {
//       img: 'Advanced-Materials-Characterization.webp',
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
//     }
//   ];

//   return (
//     <Box component="section" sx={{  py: { xs: 6, md: 10 } }}>
//       <Container maxWidth="lg" sx={{ maxWidth:1450 }}>
        
//         {/* Your Custom Header Structure */}
//         <div className="heading-wraper mb-4">
//           <div className="main-head d-flex justify-content-between align-items-center">
//             <h2 className="fw-bold">Events & Happenings</h2>
//             <div className="inner-testi-slider-nav">
//               <button 
//                 id="prev_event_slide" 
//                 className="inner-testi-prev-arrow" 
//                 onClick={() => swiperRef.current?.slidePrev()}
//               >
//                 <img src="https://www.lpu.in/lpu-assets/images/icons/vector-left.svg" alt="prev" />
//               </button>
//               <button 
//                 id="next_event_slide" 
//                 className="inner-testi-next-arrow" 
//                 onClick={() => swiperRef.current?.slideNext()}
//               >
//                 <img src="https://www.lpu.in/lpu-assets/images/icons/vector-right.svg" alt="next" />
//               </button>
//             </div>
//           </div>
//         </div>

//         <Swiper
//           onBeforeInit={(swiper) => {
//             swiperRef.current = swiper;
//           }}
//           modules={[Navigation, Pagination, Autoplay]}
//           spaceBetween={30}
//           slidesPerView={1}
//           pagination={{ clickable: true }}
//           autoplay={{ delay: 6000, disableOnInteraction: false }}
//           breakpoints={{
//             768: { slidesPerView: 3 },
//             1024: { slidesPerView: 4 },
//           }}
//           className="eventsSwiper"
//           style={{ paddingBottom: '140px' }}
//         >
//           {events.map((event, index) => (
//             <SwiperSlide key={index}>
//               <Paper
//                 elevation={0}
//                 sx={{
//                   bgcolor: 'white',
//                   borderRadius: 4,
//                   overflow: 'hidden',
//                   height: '100%',
//                   border: '1px solid #eee',
//                   '&:hover': { transform: 'translateY(-5px)', transition: '0.3s' }
//                 }}
//               >
//                 <Box
//                   component="img"
//                   src={`${serverUrl}${event.img}`}
//                   alt={event.title}
//                   sx={{ width: '100%', height: 220, objectFit: 'cover' }}
//                 />
//                 <Box sx={{ p: 3 }}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: 700, minHeight: '8.5em', mb: 1 }}>
//                     {event.title}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {event.date}
//                   </Typography>
//                 </Box>
//               </Paper>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </Container>

//       {/* Adding LPU specific arrow styles */}
//       <style jsx>{`
//         .inner-testi-slider-nav {
//           display: flex;
//           gap: 10px;
//         }
//         .inner-testi-prev-arrow, .inner-testi-next-arrow {
//           background: #fff;
//           border: 1px solid #eee;
//           border-radius: 80%;
//           width: 40px;
//           height: 40px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }
//         .inner-testi-prev-arrow:hover, .inner-testi-next-arrow:hover {
//           background: #ef7d00;
//         }
//         .inner-testi-prev-arrow:hover img, .inner-testi-next-arrow:hover img {
//           filter: brightness(0) invert(1);
//         }
//       `}</style>
//     </Box>
//   );
// };

// export default EventsCarousel;
 