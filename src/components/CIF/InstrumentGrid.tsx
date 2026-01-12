import React from 'react';
import styles from '@/styles/Instruments.module.css';

interface Props {
  instruments: any[];
  selectedId: number | null;
  onSelect: (catId: number, id: number) => void;
}

const InstrumentGrid: React.FC<Props> = ({ instruments, selectedId, onSelect }) => (
  <div className={styles.instrumentGrid}>
    {instruments.map((inst) => (
      <div 
        key={inst.id} 
        className={`${styles.instrumentBlock} ${inst.id === selectedId ? styles.selectedInstrument : ''}`}
        onClick={() => onSelect(inst.categoryId, inst.id)}
      >
        <span className={styles.instrumentLink}>{inst.instrumentName}</span>
      </div>
    ))}
  </div>
);

export default InstrumentGrid;