import React from 'react';
import { EventItem } from '../../types/cif';
import EventsCarousel from './EventsCarousel';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

interface StyleProps {
  styles: { readonly [key: string]: string };
}
const EventsSection: React.FC<StyleProps> = ({ styles }) => {
  const events = [
    { img: "event-3.jpg", title: "Workshop on FESEM", date: "29-30 March" },
    { img: "event-1.jpg", title: "National workshop on XRD", date: "26-27 April" },
    { img: "event-2.jpg", title: "Summer Training", date: "3 June" }
  ];

  const chunkedEvents: any[][] = [];

  const chunkArray = (arr: any[], size: number): any[][] => {
    return arr.reduce((acc, _, i) =>
      (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);
  };

  chunkedEvents.push(...chunkArray(events, 3));
  
  const serverUrl: any = 'https://www.lpu.in/lpu-assets/images/cif/';
  
  const displayEvents = [...events, ...events, ...events];

  return (
 
    <section className="section">
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
          {events.map((event, index) => (
            <SwiperSlide key={index}>
              <div className="row text-center">
                <div className=" col-md-4 ">
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
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
    </section>
   
  );
};
export default EventsSection;

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
//                       src={`${serverUrl}${event.img}`}
//                       alt={event.title}
//                       className="img-fluid"
//                     />
//                     <div className="mt-4 mb-2">
//                       <strong className="d-block">{event.title}</strong>
//                       {event.date}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//     {/* <EventsCarousel events={displayEvents} serverUrl={serverUrl} /> */}
//     </>
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
