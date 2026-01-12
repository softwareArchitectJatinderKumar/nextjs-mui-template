import React from 'react';

const ContactSection: React.FC = () => (
  <section className="section section-gray">
    <div className="container">
      <div className="row">
        <div className="col-md-5"><h2>Research and Development Cell</h2></div>
        <div className="col-md-3">
          <a href="tel:+911824444021">+91 1824-444021</a>
        </div>
        <div className="col-md-4">
          <a href="mailto:cif@lpu.co.in">cif@lpu.co.in</a>
        </div>
      </div>
    </div>
  </section>
);

export default ContactSection;

// import React from 'react';

// const ContactSection: React.FC = () => {
//   return (
//     <section className="section section-gray">
//       <div className="container">
//         <div className="row">
//           <div className="col-md-5">
//             <div className="heading-wraper">
//               <div className="main-head">
//                 <h2>Research and <br />Development Cell</h2>
//               </div>
//             </div>
//           </div>
          
//           <div className="col-md-3">
//             <div className="contact-box">
//               <div className="contant-icon-box mb-3">
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                   <path d="M18.9996 15.4817V17.5893..." stroke="#EF7D00" strokeWidth="1.5" />
//                 </svg>
//               </div>
//               <div className="contact-text">
//                 <a href="tel:+911824444021">+91 1824-444021</a>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div className="contact-box">
//               <div className="contant-icon-box mb-3">
//                 <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
//                    <path d="M16 0.523438L7.95831 6.52344L0 0.523438" stroke="#EF7D00" strokeWidth="1.5" />
//                 </svg>
//               </div>
//               <div className="contact-text">
//                 <a href="mailto:cif@lpu.co.in">cif@lpu.co.in</a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactSection;