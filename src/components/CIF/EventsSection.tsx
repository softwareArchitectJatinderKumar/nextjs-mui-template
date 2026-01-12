import React from 'react';
import { EventItem } from '../../types/cif';

interface StyleProps {
  styles: { readonly [key: string]: string };
}

const EventsSection: React.FC<StyleProps> = ({ styles }) => {
  const events: EventItem[] = [
    { img: "event-3.jpg", title: "Workshop on FESEM", date: "29 - 30 March 2024" },
    { img: "event-1.jpg", title: "National workshop on XRD", date: "26 - 27 April 2024" },
    { img: "event-2.jpg", title: "Summer Training Programme", date: "3 June - 13 July 2024" }
  ];

  return (
    <section className="section bgDarkYellow">
      <div className="container">
        <h2>Events & Happenings</h2>
        <div className={styles.cifSlider}>
          {events.map((event, i) => (
            <div key={i} className={styles.cifItem}>
              <img src={`https://www.lpu.in/lpu-assets/images/cif/${event.img}`} alt={event.title} />
              <div className="mt-4">
                <strong>{event.title}</strong><br />({event.date})
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;

// import React from 'react';
// import { EventItem } from '../../types/cif';

// interface EventsProps {
//   styles: { readonly [key: string]: string };
// }

// const EventsSection: React.FC<EventsProps> = ({ styles }) => {
//   const events: EventItem[] = [
//     { 
//       img: "event-3.jpg", 
//       title: "Workshop on Field Emission Scanning Electron Microscope", 
//       date: "29 - 30 March 2024" 
//     },
//     { 
//       img: "event-1.jpg", 
//       title: "National workshop on X-Ray Diffraction and Particle Size Analyzer", 
//       date: "26 - 27 April 2024" 
//     },
//     { 
//       img: "event-2.jpg", 
//       title: "Summer Training Programme", 
//       date: "3 June - 13 July 2024" 
//     }
//   ];

//   return (
//     <section className="section bgDarkYellow">
//       <div className="container">
//         <div className="heading-wraper">
//           <div className="main-head">
//             <h2>Events & Happenings</h2>
//           </div>
//         </div>
//         <div className={styles.cifSlider}>
//           {events.map((event, i) => (
//             <div key={i} className={styles.cifItem}>
//               <img src={`https://www.lpu.in/lpu-assets/images/cif/${event.img}`} alt={event.title} />
//               <div className="mt-4 mb-2">
//                 <strong className="d-block">{event.title}</strong>
//                 ({event.date})
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default EventsSection;