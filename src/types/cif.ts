export interface Instrument {
  id: string | number;
  instrumentName: string;
  categoryId?: string | number | undefined | null;
  imageUrl?: string;
  sampleExcelSheetUrl?: string;
}

export interface Offer {
  title: string;
  desc: string;
}

export interface EventItem {
  img: string;
  title: string;
  date: string;
}