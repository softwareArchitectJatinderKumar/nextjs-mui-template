import React from 'react';
import Link from 'next/link';
import { Instrument } from '../../types/cif';
import styles from '@/styles/Facilities.module.css';

interface FacilitiesProps {
  instruments: Instrument[];
}

const FacilitiesSection: React.FC<FacilitiesProps> = ({ instruments }) => {
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

    
        <div className={`${styles.InstrumentGrid} row`} id="instrumentGrid">
          {instruments.map((instrument) => (
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
      </div>
    </section>
  );
};

export default FacilitiesSection;
