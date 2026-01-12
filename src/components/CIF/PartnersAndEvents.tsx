// import React from 'react';

// const PartnersAndEventsSection: React.FC = () => {
//   const logos = ['brunker.png', 'jeol.png', 'malvern.png', 'shimadzu.png', 'perkin.png', 'metrohm.png'];
//   return (
//     <section className="section industry-partners-grid">
//       <div className="container">
//         <div className="placement-stats">
//           <h2>In Collaboration with</h2>
//           <p>The Center of Excellence facilitates research and exchange of ideas.</p>
//         </div>
//         <div className="placement-logo">
//           {logos.map((logo, idx) => (
//             <div key={idx} className="placement-grid-logo">
//               <img src={`https://www.lpu.in/lpu-assets/images/cif/logo/${logo}`} alt="Partner Logo" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PartnersAndEventsSection;


import React from 'react';

const PartnersSection: React.FC = () => {
  const logos = ['brunker.png', 'jeol.png', 'malvern.png', 'shimadzu.png', 'perkin.png', 'metrohm.png'];
  return (
    <section className="section industry-partners-grid">
      <div className="container">
        <div className="placement-stats">
          <h2>In Collaboration with</h2>
          <p>The Center of Excellence facilitates research and exchange of ideas.</p>
        </div>
        <div className="placement-logo">
          {logos.map((logo, idx) => (
            <div key={idx} className="placement-grid-logo">
              <img src={`https://www.lpu.in/lpu-assets/images/cif/logo/${logo}`} alt="Partner Logo" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
// import React from 'react';
// import { EventItem } from '../../types/cif';

// interface StyleProps {
//   styles: { readonly [key: string]: string };
// }

// export const PartnersAndEvents: React.FC<StyleProps> = ({ styles }) => {
//   const events: EventItem[] = [
//     { img: "event-3.jpg", title: "Workshop on FESEM", date: "29 - 30 March 2024" },
//     { img: "event-1.jpg", title: "National workshop on XRD", date: "26 - 27 April 2024" },
//     { img: "event-2.jpg", title: "Summer Training Programme", date: "3 June - 13 July 2024" }
//   ];

//   return (
//     <section className="section bgDarkYellow">
//       <div className="container">
//         <div className="main-head"><h2>Events & Happenings</h2></div>
//         <div className={styles.cifSlider}>
//           {events.map((event, i) => (
//             <div key={i} className={styles.cifItem}>
//               <img src={`https://www.lpu.in/lpu-assets/images/cif/${event.img}`} alt={event.title} />
//               <div className="mt-4 mb-2">
//                 <strong className="d-block">{event.title}</strong> ({event.date})
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };