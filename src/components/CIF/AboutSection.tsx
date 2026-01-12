import React from 'react';

const AboutSection: React.FC = () => (
  <section className="section">
    <div className="container">
      <div className="heading-wraper mb-4">
        <div className="main-head">
          <h1>About the Instruments</h1>
          <div className="call-action gap-3">
            <a href="/Home" className="link-btn">
              <img src="https://www.lpu.in/lpu-assets/images/icons/chevron-right.svg" alt="Icon" />
              Home Page
            </a>
          </div>
        </div>
      </div>
      <p>
        CIF of Lovely Professional University is equipped with sophisticated instruments to carry out spectral
        measurements, structure determination and chemical analysis. Click on the instrument name in the
        following table to view their description.
      </p>
    </div>
  </section>
);

export default AboutSection;