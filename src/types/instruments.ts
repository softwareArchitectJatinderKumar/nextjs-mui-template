export interface Specification {
  keyName: string;
  keyValue: string;
  categoryId: number;
}

export interface Instrument {
  id: number;
  instrumentName: string;
  categoryId: number;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
  isOpen?: boolean;
}

export interface ChargeDetail {
  orgTypeId: number;
  sampleText: string;
  price: number;
}