import React from 'react';
import Link from 'next/link';
import { Instrument } from '../../types/cif';
import styles from '@/styles/Facilities.module.css';

interface FacilitiesProps {
  instruments: Instrument[];
}

const FacilitiesSection: React.FC<FacilitiesProps> = ({ instruments }) => {
  // Handle empty or undefined instruments array
  const validInstruments = Array.isArray(instruments) ? instruments : [];
  
  return (
    <section className={styles.section + ' pb-5 ' + styles.bgDarkYellow}>
      <div className="container">
        <div className={`mb-4 mt-4 ${styles.headingWrapper}`}>
          <h2 className="fw-bold mb-0">Facilities</h2>

          <div className={styles.callAction}>
            <Link href="/OurInstruments" className="link-btn">
              <img
                src="https://www.lpu.in/lpu-assets/images/icons/chevron-right.svg"
                alt="Know more"
              />
              Know more
            </Link>
          </div>
        </div>

        <p className="mb-4">
          CIF is equipped with sophisticated instruments to carry out spectral
          measurements, structure determination and chemical analysis. Click on
          the instrument name in the following table to view their description.
        </p>

        {/* Show message when no instruments available */}
        {validInstruments.length === 0 ? (
          <div className="alert alert-secondary" role="alert">
            <div className="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-info-circle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
              <div>
                No facilities available at the moment. Please check back later or contact support.
              </div>
            </div>
          </div>
        ) : (
          <div className={`${styles.InstrumentGrid} row`} id="instrumentGrid">
            {validInstruments.map((instrument) => (
              <div className={`${styles.instrumentBlock} g-col-lg-3 g-col-6 d-grid col-md-3`} key={instrument.id}>
                <div className={`${styles.imageSizes} mb-3`}>
                  <img
                    src={instrument.imageUrl || '/default-placeholder.png'}
                    alt={instrument.instrumentName}
                    className={`${styles.imageSizes} img-fluid`}
                  />
                </div>

                <Link
                  href={{
                    pathname: '/OurInstruments',
                    query: {
                      name: instrument.instrumentName,
                      id: instrument.id,
                      categoryId: instrument.categoryId,
                    },
                  }}
                  className={styles.instrumentLink}
                >
                  {instrument.instrumentName.slice(0, 40)}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FacilitiesSection;
