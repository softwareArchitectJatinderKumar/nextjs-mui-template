import axios, { AxiosInstance } from 'axios';

class InstrumentService {
  private apiClient: AxiosInstance;
  public folderUrl: string | undefined;

  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_AUTH_API,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
    });
    this.folderUrl = process.env.NEXT_PUBLIC_FOLDER_URL;
  }

  async getAllInstruments() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAllInstruments');
      return response.data.item1; 
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error; 
    }
  }

  async getSpecifications() {
  try {
    const response = await this.apiClient.get('api/LpuCIF/GetAllSpecifications', {
    });
    return response.data.item1; 
  } catch (error) {
    console.error('Error fetching authorized user data:', error);
    throw error; 
  } 
}

  async fetchSpecifications() {
  try {
    const response = await this.apiClient.get('api/LpuCIF/GetAllSpecifications', {
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching authorized user data:', error);
    throw error; 
  } 
}

  async getCharges(id: number) {
    const res = await this.apiClient.get(`api/LpuCIF/GetInstrumentChargesDetails?InstrumentID=${id}`);
    return res.data.item1 || [];
  }


  // GetChargesDetails(Id: any): Observable<any> {
//   let token = this.storageService.getUser();
//   let headers = new HttpHeaders()
//     .set('Authorization', 'Bearer ' + this.authToken)
//     .set('Content-Type', 'application/json');
//   return this.http.get(
//     // AUTH_API + 'api/LpuCIF/GetAGetInstrumentChargesDetailsllSpecifications', { headers }
//     AUTH_API_LOCAL + 'api/LpuCIF/GetInstrumentChargesDetails?InstrumentID='+Id, { headers }
//   );
// }

}

export const instrumentService = new InstrumentService();
// import axios, { AxiosInstance } from 'axios';
// import { Instrument, Specification, ChargeDetail } from '../types/instruments';

// class InstrumentService {
//   private apiClient: AxiosInstance;
//   public folderUrl: string | undefined;
//   public localApiUrl: string | undefined;

//   constructor() {
//     this.apiClient = axios.create({
//       baseURL: process.env.NEXT_PUBLIC_AUTH_API,
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
//       },
//     });

//     this.folderUrl = process.env.NEXT_PUBLIC_FOLDER_URL;
//     this.localApiUrl = process.env.NEXT_PUBLIC_AUTH_API_LOCAL;
//   }

//   async getAllInstruments(): Promise<Instrument[]> {
//     const response = await this.apiClient.get<{ item1: Instrument[] }>('/GetAllInstrumentsData');
//     return response.data.item1 || [];
//   }

//   async getSpecifications(): Promise<Specification[]> {
//     const response = await this.apiClient.get<{ item1: Specification[] }>('/fetchSpecifications');
//     return response.data.item1 || [];
//   }

//   async getCharges(id: number): Promise<ChargeDetail[]> {
//     const response = await this.apiClient.get<{ item1: ChargeDetail[] }>(`/GetChargesDetails/${id}`);
//     return response.data.item1 || [];
//   }
// }

// export const instrumentService = new InstrumentService();