import React from 'react';
import styles from '@/styles/Instruments.module.css';
import { Link } from 'lucide-react';

interface Props {
  instrument: any;
  specs: any[];
  onViewCharges: () => void;
}

const InstrumentDetails: React.FC<Props> = ({ instrument, specs, onViewCharges }) => (
  <section className={`${styles.section} bg-dark-yellow py-5`}>
    <div className="container">
      <div className="row">
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">{instrument.instrumentName}</h2>
            <div className={styles.callAction}>
              <a className="d-flex align-items-center fw-bold text-decoration-none" href='/login'>
                <img
                  src="https://www.lpu.in/lpu-assets/images/icons/chevron-right.svg"
                  alt="Know more"
                />
                Book Test
              </a>
            
          </div>
            {/* <button 
              onClick={onViewCharges} 
              className="btn btn-warning fw-bold px-4"
              style={{ backgroundColor: '#ef7d00', border: 'none', color: 'white' }}
            >
              View Testing Charges
            </button> */}
          </div>
          <div className={`alert ${instrument.isActive ? 'alert-success' : 'alert-danger'}`}>
            <strong>{instrument.isActive ? 'Instrument is Active' : 'Instrument is Currently Inactive'}</strong>
          </div>
          <img 
            src={instrument.imageUrl} 
            className={styles.imageSizes} 
            alt={instrument.instrumentName} 
          />
          <div className="mt-4 fs-5 " style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: instrument.description }} />
        </div>
        <div className="col-lg-3">
          <div className={`${styles.sectionLightRed} p-3 rounded text-white shadow`}>
            <h4 className="mb-3 border-bottom pb-2">Technical Specifications</h4>
            <ul className="list-unstyled">
              {specs.map((s, i) => (
                <li key={i} className="mb-3 border-bottom border-light pb-2">
                  <small className="d-block opacity-75">{s.keyName}</small>
                  <strong>{s.keyValue}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default InstrumentDetails;
// import React from 'react';
// import styles from '@/styles/Instruments.module.css';

// const InstrumentDetails: React.FC<any> = ({ instrument, specs, onViewCharges }) => (
//   <section className="section bg-dark-yellow py-5">
//     <div className="container">
//       <div className="row">
//         <div className="col-lg-9">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2>{instrument.instrumentName}</h2>
//             <button onClick={onViewCharges} className="btn btn-warning">View Charges</button>
//           </div>
//           <img 
//             src={instrument.imageUrl} 
//             className={styles.imageSizes} 
//             alt={instrument.instrumentName} 
//           />
//           <div className="mt-4" dangerouslySetInnerHTML={{ __html: instrument.description }} />
//         </div>
//         <div className="col-lg-3">
//           <div className="section-light-red p-3 rounded text-white">
//             <h4>Specifications</h4>
//             <ul className="list-unstyled">
//               {specs.map((s: any, i: number) => (
//                 <li key={i} className="mb-2 border-bottom border-light pb-1">
//                   <strong>{s.keyName}:</strong> {s.keyValue}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   </section>
// );

// export default InstrumentDetails;