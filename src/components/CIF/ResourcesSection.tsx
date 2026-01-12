import React from 'react';

const ResourcesSection: React.FC = () => (
  <section className="section academics-section right-top-circle">
    <div className="container-fluid">
      <div className="prospectus-grid">
        <div className="history-about">
          <img src="https://www.lpu.in/lpu-assets/images/admissions/prospectus.jpg" alt="Resources" />
        </div>
        <div className="history-facts">
          <h2>CIF Resources</h2>
          <ul>
            <li><a href="#">Application Form</a></li>
            <li><a href="#">Test Charges</a></li>
            <li><a href="#">Payment Options</a></li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default ResourcesSection;
// import React from 'react';

// const ResourcesSection: React.FC = () => {
//   return (
//     <section className="section academics-section right-top-circle">
//       <div className="container-fluid">
//         <div className="prospectus-grid">
//           <div className="history-about">
//             <img 
//               src="https://www.lpu.in/lpu-assets/images/admissions/prospectus.jpg" 
//               alt="CIF Resources" 
//             />
//           </div>
//           <div className="history-facts">
//             <div className="heading-wraper row">
//               <div className="main-head">
//                 <h2>CIF Resources</h2>
//               </div>
//             </div>
//             <ul>
//               <li><a href="#">Application Form</a></li>
//               <li><a href="#">Test Charges</a></li>
//               <li><a href="#">Payment Options</a></li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ResourcesSection;