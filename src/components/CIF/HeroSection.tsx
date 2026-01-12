import React from 'react';
 import { Offer } from '../../types/cif';

const HeroSection: React.FC = () => {
  const offers: Offer[] = [
    { title: "Leading class testing equipments", desc: "CIF is equipped with sophisticated instruments to carry out spectral measurements, structure determination, and chemical analysis." },
    { title: "High degree of reliable and quick test results", desc: "Given the time-tested machines & committed research base, CIF can assure authentic & reproducible results" },
    { title: "Dedicated CIF team", desc: "We have committed faculty members, scientific operators, and administrative officers working round the clock." }
  ];

  return (
    <section className="section bgDarkYellow pb-0">
      <div className="container">
        <div className="headingWraper mb-4">
          <div className="mainHead"><h1>Central Instrumentation Facility</h1></div>
        </div>
        <p>
           Central Instrumentation Facility (CIF) of Lovely Professional University (LPU) houses a wide range of
             high-end instruments for pushing the boundaries of research in science and technology to higher level. These
             instruments and facilities help the faculties, research scholars and students to carry out globally
             competitive research in basic, applied and medical sciences. The center also hopes for expansion of the
             facilities each year making it a core facility in the country. By realizing CIF, we expect a prominent hub
             for pioneering and collaborative analytical research in our country. CIF runs under the purview of Research
             and Development Cell of the university and is expected to self-sustain by revenue generation for the upkeep
             and maintenance of the instruments.
        </p>
        <div className="banner mb-5">
          <img src="https://www.lpu.in/lpu-assets/images/cif/banner.jpg" alt="CIF Banner" />
        </div>
        <div className="section-red p-4">
          <h2 className="white">What we offer</h2>
          <div className="cif-fact row">
            {offers.map((offer, i) => (
              <div key={i} className="facts col-lg-4 col-12">
                <div className="icon"><img src="https://www.lpu.in/lpu-assets/images/cif/icon.svg" alt="icon" /></div>
                <span className="head">{offer.title}</span>
                <p>{offer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
// import React from 'react';
//  import { Offer } from '../types/cif';

// const HeroSection: React.FC = () => {
//   const offers: Offer[] = [
//     { title: "Leading class testing equipments", desc: "CIF is equipped with sophisticated instruments to carry out spectral measurements, structure determination, and chemical analysis." },
//     { title: "High degree of reliable and quick test results", desc: "Given the time-tested machines & committed research base, CIF can assure authentic & reproducible results" },
//     { title: "Dedicated CIF team", desc: "We have committed faculty members, scientific operators, and administrative officers working round the clock." }
//   ];

//   return (
//     <section className="section bgDarkYellow pb-0">
//       <div className="container">
//         <div className="headingWraper mb-4">
//           <div className="mainHead">
//             <h1>Central Instrumentation Facility</h1>
//           </div>
//         </div>
//         <p>
//           Central Instrumentation Facility (CIF) of Lovely Professional University (LPU) houses a wide range of
//           high-end instruments for pushing the boundaries of research in science and technology to higher level...
//         </p>
//         <div className="banner mb-5">
//           <img src="https://www.lpu.in/lpu-assets/images/cif/banner.jpg" alt="CIF Banner" />
//         </div>
//         <div className="section-red p-4">
//           <div className="heading-wraper mb-4">
//             <div className="main-head"><h2 className="white">What we offer</h2></div>
//             <div className="bottom-line"></div>
//             <div className="cif-fact row">
//               {offers.map((offer, i) => (
//                 <div key={i} className="facts col-lg-4 col-12">
//                   <div className="icon">
//                     <img src="https://www.lpu.in/lpu-assets/images/cif/icon.svg" alt="icon" />
//                   </div>
//                   <span className="head">{offer.title}</span>
//                   <p>{offer.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;