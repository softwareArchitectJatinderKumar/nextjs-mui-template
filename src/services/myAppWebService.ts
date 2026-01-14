import axios from 'axios';
class MyAppWebService {
  apiClient: any;     folderUrl: any;      localApiUrl: any;   USER_KEY: any;


  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_AUTH_API,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
    });

    this.folderUrl = process.env.NEXT_PUBLIC_FOLDER_URL;
    this.localApiUrl = process.env.NEXT_PUBLIC_AUTH_API_LOCAL;
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
      const response = await this.apiClient.get('api/LpuJournal/GetAllJournalData');
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async getAllInstruments() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetAllInstruments');
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }


  async GetAuthoriseUserData(UserEmail: any, secreatKeys: any, userRole: any) {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetUserDataIdWise', {
        params: {
          Email: UserEmail,
          PasswordText: secreatKeys,
          UserRole: userRole,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }


  async GetInstrumentsDetails() {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetInstrumentsDetails', {
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
      const response = await this.apiClient.get('api/LpuJournal/CIFGetAllAssignedTesttoStaff', {
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }



  async GetAllUploadedResultsByStaff() {
    try {
      const response = await this.apiClient.get('api/LpuJournal/CIFGetAllAssignedTesttoStaff', {
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }
  async GetAllBookingTests() {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetAllBookingTests', {
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

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
  async GetUserPaymentDetails(UserEmailId: any) {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetUserPaymentDetails', {
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

  async GetAllPaymentDetails() {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetAllPaymentDetails', {
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

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
  async GetAllInstruments() {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetInstrumentsDetails', {
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }
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

  async GetUserResultsDetails(EmailId: any, BookingId: any) {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetUserResultsDetails', {
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

  async GetUserBookingStatus(UserEmailId: any) {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetUserBookingStatus', {
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
  async GetAllUserData() {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetAllApprovedUserData', {

      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }
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
  async GetAnalysisData(Id: any, TypeId: any) {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetAnalysisIdWisePriceDetails', {
        AnalysisId: Id,
        TypeId: TypeId
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async GetUserAllBookingSlot(Id: any) {
    try {
      const response = await this.apiClient.get('api/LpuJournal/GetAllUserBookingSlot', {
        UserId: Id,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

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
}

const myAppWebService = new MyAppWebService();
export default myAppWebService;

