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
