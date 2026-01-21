// services/myAppWebService.js

import axios from 'axios';

class MyAppWebService {
  apiClient: any;
  folderUrl: any
  localApiUrl: any;
  USER_KEY: any;



  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_AUTH_API,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
    });


    this.folderUrl = process.env.NEXT_PUBLIC_FOLDER_URL; // Use the folder URL from env
    this.localApiUrl = process.env.NEXT_PUBLIC_AUTH_API_LOCAL; // Use the local API URL from env
    this.USER_KEY = 'auth-user';
  }

  getFolderUrl() {
    return this.folderUrl;
  }



  clean(): void {
    window.sessionStorage.clear();
  }
  public saveUser(user: any): void {
    window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(this.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }


  async loginInternalUser(userId: string, key: string) {

    try {
      const loginData = new FormData();
      loginData.append('userName', userId);
      loginData.append('password', key);

      const response = await this.apiClient.post('security/createtoken', loginData, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async GetEmployeeDetails(token:any) {
    try {
      const response = await this.apiClient.get('api/Mou/GetEmployeeDetails', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }


  async getStudentById(regNo: any) {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetStudentById', {
        params: {
          RegNo: regNo
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async getAuthoriseUserData(UserEmail: any, secreatKeys: any, userRole: any) {
    try {
      const loginData = new FormData();
      loginData.append('Email', UserEmail);
      loginData.append('PasswordText', secreatKeys);
      loginData.append('UserRole', userRole);
      const response = await this.apiClient.post('api/LpuCIF/GetUserDataIdWise', loginData, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }


  async GetAllBooksDetails() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAllJournalData');
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }



  // Method to fetch instruments
  async getAllInstruments() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAllInstruments');
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }
 
async GetAllSampleStatus() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAllSampleStatus');
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
    
  }
  // New API added 

  async GetAuthoriseUserData(formData: FormData) {
    try {
      const res = await this.apiClient.post(`api/LpuCIF/GetUserDataIdWise`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      });
      return res.data;
      // const response = await this.apiClient.post('api/LpuCIF/GetUserDataIdWise', 
      //   formData,

      // );
      // return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

 

  async GetInstrumentsDetails() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetInstrumentsDetails', {
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async GetAnalysisDetails(InstrumentId: any) {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetInstrumentWiseAnalysisDetails', {
        params: {
          InstrumentId: InstrumentId
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }


  async GetDuationAndPrice(AnalysisId: any, UserId: any, Duration: any) {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetDuationAndPrice', {
        params: {
          AnalysisId: AnalysisId,
          UserId: UserId,
          Duration: Duration
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async addBookingSlot(newBookingData: any) {
    try {
      const response = await this.apiClient.post('api/LpuCIF/NewBookingSlot', newBookingData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding booking slot:', error);
      throw error;
    }
  }

  async NewUserSignUp(newUserData: any) {
    try {
      const response = await this.apiClient.post('api/LpuCIF/CIFNewUserSignUpInsert', newUserData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding booking slot:', error);
      throw error;
    }
  }

  async NewUserRecord(newUserData: any) {
    try {
      const response = await this.apiClient.post('api/LpuCIF/CreateCIFUserAccount', newUserData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding booking slot:', error);
      throw error;
    }
  }



  async GetAllBookingSlot(UserEmailId: any) {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAllBookingSlot', {
        params: {
          UserId: UserEmailId
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }



  async GetAllBooking() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/CIFGetAllAssignedTesttoStaff', {
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }



  async GetAllUploadedResultsByStaff() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/CIFGetAllAssignedTesttoStaff', {
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }
  // get 
  async GetAllBookingTests() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAllBookingTests', {
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  // post
  async MakePaymentforTest(newPaymentRecord: any) {
    try {
      const response = await this.apiClient.post('api/LpuCIF/MakePaymentNowNew', newPaymentRecord, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding booking slot:', error);
      throw error;
    }
  }
  // get call
  async GetUserPaymentDetails(UserEmailId: any) {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetUserPaymentDetails', {
        params: {
          UserId: UserEmailId
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }


  // get request admin panel 
  async GetAllPaymentDetails() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAllPaymentDetails', {
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }



  // Post  
  async CIFResultsUploads(dataSoft: any) {
    try {
      const response = await this.apiClient.post('api/LpuCIF/CIFResultsUploads', dataSoft, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding booking slot:', error);
      throw error;
    }
  }

  // get request 

  async GetAllInstruments() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetInstrumentsDetails', {
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  // Post  
  async CIFUpdateStatusInstruments(dataSoft: any) {
    try {
      const response = await this.apiClient.post('api/LpuCIF/CIFUpdateStatusInstruments', dataSoft, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding booking slot:', error);
      throw error;
    }
  }


  // Post  
  async CIFAssignTestToStaff(dataSoft: any) {
    try {
      const response = await this.apiClient.post('api/LpuCIF/CIFAssignTestToStaff', dataSoft, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding booking slot:', error);
      throw error;
    }
  }


  // get request 

  async GetUserResultsDetails(EmailId: any, BookingId: any) {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetUserResultsDetails', {
        params: {
          Uid: EmailId,
          BookingId: BookingId
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }



  // get request 

  async GetUserBookingStatus(UserEmailId: any) {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetUserBookingStatus', {
        params: {
          Uid: UserEmailId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }
  // get request 

  async GetAllUserData() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAllApprovedUserData', {

      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }



  // Post  
  async CIFUpdateUserDetails(UpdateUserData: any) {
    try {
      const response = await this.apiClient.post('api/LpuCIF/CIFChangePasswordDetails', UpdateUserData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      return response.data;
    } catch (error) {
      console.error('Error adding booking slot:', error);
      throw error;
    }
  }


  // get request 

  async GetAnalysisData(Id: any, TypeId: any) {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAnalysisIdWisePriceDetails', {
        AnalysisId: Id,
        TypeId: TypeId
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }




  // get request 

  async GetUserAllBookingSlot(Id: any) {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAllUserBookingSlot', {
         params: {UserId: Id},
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    } 
  }




  // get request 

  async CIFGetUserDetails(UserEmail: any) {
    try {// LpuCIF/CIFGetUserDetails?EmailId=
      const response = await this.apiClient.get('api/LpuCIF/CIFGetUserDetails', {
        EmailId: UserEmail,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }
  // async fetchSpecifications(categoryId:any, instrumentId:any) {
  //     return this.apiClient.get(`api/LpuCIF/GetAllSpecifications`, {
  //       params: {
  //         categoryId,
  //         id: instrumentId,
  //       },
  //     });
  //  }

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

  async LoginAzureServer(EmailId: any, PasswordText: any, RemeberMe: any) {
    try {
      var dataSoft = { id: EmailId, password: PasswordText, RemeberMe: RemeberMe }
      const response = await axios.post('https://loadlogic.azurewebsites.net/api/webauth/0', dataSoft,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  // Post  
  // async CIFUpdateStatusInstruments(dataSoft: any) {
  //   try {
  //     const response = await this.apiClient.post('api/LpuCIF/CIFUpdateStatusInstruments', dataSoft, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error adding booking slot:', error);
  //     throw error;
  //   }
  // }


  // GetDecodePaymentStatusDetails(Data: FormData): Observable<any> {
  // let authToken = this.storageService.getUser();
  // let headers = new HttpHeaders()
  //   .set('Authorization', 'Bearer ' + this.authToken)
  // return this.http.post(
  //   // AUTH_API_LOCAL + 'api/LpuCIF/DecodePaymentStatusDetails', Data, { headers }
  //     AUTH_API + 'api/LpuCIF/DecodePaymentStatusDetails', Data, { headers }
  // );
  // }
  // GetUserPaymentStatusDetails(UserEmailId: string): Observable<any> {
  // let token = this.storageService.getUser();
  // let headers = new HttpHeaders()
  // // .set('Authorization', 'Bearer ' + token)
  // .set('Authorization', 'Bearer ' + this.authToken)
  // .set('Content-Type', 'application/json');
  // return this.http.get(
  //    AUTH_API + 'api/LpuCIF/GetUserPaymentStatusDetails?UserId=' + UserEmailId,
  // //  AUTH_API_LOCAL + 'api/LpuCIF/GetUserPaymentStatusDetails?UserId=' + UserEmailId,
  //   {headers}
  // );
  // }

  // GetAllInstrumentsData(): Observable<any> {
  // let token = this.storageService.getUser();
  // let headers = new HttpHeaders()
  // .set('Authorization', 'Bearer ' + this.authToken)
  // .set('Content-Type', 'application/json');
  // return this.http.get(
  //    AUTH_API + 'api/LpuCIF/GetAllInstruments',
  //   // AUTH_API_LOCAL + 'api/LpuCIF/GetAllInstruments',
  //   {headers}
  // );
  // }


  // fetchSpecifications(): Observable<any> {
  //   let token = this.storageService.getUser();
  //   let headers = new HttpHeaders()
  //     .set('Authorization', 'Bearer ' + this.authToken)
  //     .set('Content-Type', 'application/json');
  //   return this.http.get(
  //     AUTH_API + 'api/LpuCIF/GetAllSpecifications', { headers }
  //   );
  // }
  // InsertPaymentDetails(Data: any): Observable<any> {
  //   let authToken = this.storageService.getUser();
  //   let headers = new HttpHeaders()
  //     .set('Authorization', 'Bearer ' + this.authToken)
  //   return this.http.post(
  //     AUTH_API_LOCAL + 'api/LpuCIF/AddPaymentDetails', Data, { headers }
  //       // AUTH_API + 'api/LpuCIF/AddPaymentDetails', Data, { headers }
  //   );

  // }

  // UpdateInstrumentImageFile(dataSoft:FormData): Observable<any> {
  //   let authToken = this.storageService.getUser();
  //   let headers = new HttpHeaders()
  //     .set('Authorization', 'Bearer ' + this.authToken)
  //   return this.http.post(
  //      AUTH_API + 'api/LpuCIF/UpdateInstrumentImage',dataSoft,
  //     // AUTH_API_LOCAL + 'api/LpuCIF/UpdateInstrumentImage',dataSoft,
  //    {headers}
  //   );
  // }

  // CIFInstrumentUpdateDetails(dataSoft:FormData): Observable<any> {
  //   let authToken = this.storageService.getUser();
  //   let headers = new HttpHeaders()
  //     .set('Authorization', 'Bearer ' + this.authToken)
  //   return this.http.post(
  //     //  AUTH_API + 'api/LpuCIF/CIFInstrumentUpdateData',dataSoft,
  //     AUTH_API_LOCAL + 'api/LpuCIF/CIFInstrumentUpdateData',dataSoft,
  //    {headers}
  //   );
  // }


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

const myAppWebService = new MyAppWebService();
export default myAppWebService;

