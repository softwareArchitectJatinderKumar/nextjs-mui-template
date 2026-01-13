import React from 'react';
import { EventItem } from '../../types/cif';

interface StyleProps {
  styles: { readonly [key: string]: string };
}
const EventsSection: React.FC<StyleProps> = ({ styles }) => {
  const events = [
    { img: "event-3.jpg", title: "Workshop on FESEM", date: "29-30 March" },
    { img: "event-1.jpg", title: "National workshop on XRD", date: "26-27 April" },
    { img: "event-2.jpg", title: "Summer Training", date: "3 June" }
  ];

  // Triplicate the events to ensure there's always content filling the horizontal space
  const displayEvents = [...events, ...events, ...events];

  return (
    <div className={styles.marqueeWrapper}>
      <div className={styles.marquee}>
        {displayEvents.map((event, i) => (
          <div key={i} className={styles.eventCard}>
             <img 
               src={`https://www.lpu.in/lpu-assets/images/cif/${event.img}`} 
               className={styles.eventImg} 
               alt={event.title} 
             />
             <div className="p-3">
                <h4 className={styles.eventTitle}>{event.title}</h4>
                <p className={styles.eventDate}><b>Date:</b> {event.date}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
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
