// services/myAppWebService.js
import { storageService } from './storageService';
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

    // Add response interceptor to handle API errors
    this.apiClient.interceptors.response.use(
      (response: any) => {
        // Check if the response indicates an error (common patterns)
        const data = response.data;
        
        // Check for common error indicators in the response
        if (data && typeof data === 'object') {
          if (data.success === false || data.isError === true || data.error === true) {
            const errorMessage = data.message || data.errorMessage || 'An error occurred';
            return Promise.reject(new Error(errorMessage));
          }
        }
        
        return response;
      },
      (error: any) => {
        // Handle axios errors (network errors, HTTP errors, etc.)
        let errorMessage = 'An error occurred';
        
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const data = error.response.data;
          
          if (data && data.message) {
            errorMessage = data.message;
          } else if (status === 401) {
            errorMessage = 'Unauthorized. Please login again.';
          } else if (status === 403) {
            errorMessage = 'Access denied.';
          } else if (status === 404) {
            errorMessage = 'Resource not found.';
          } else if (status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = `Error: ${status}`;
          }
        } else if (error.request) {
          // Request made but no response received
          errorMessage = 'Network error. Please check your connection.';
        } else {
          // Error in setting up the request
          errorMessage = error.message || 'An error occurred';
        }
        
        return Promise.reject(new Error(errorMessage));
      }
    );


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

      // Note: Do NOT set 'Content-Type' manually when sending FormData
      // Axios will set it automatically with the correct boundary
      const response = await this.apiClient.post('security/createtoken', loginData);

      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

  async GetEmployeeDetails(token:any) {
    const Token = storageService.getUser();
    try {
      const response = await this.apiClient.get('api/Mou/GetEmployeeDetails', {
        headers: {
          'Authorization': `Bearer ${Token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }
  }

///api/LpuCIFBridge/GetAllApprovedUserData
  async getStudentById(regNo: any) {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetStudentById', {
        params: {
          RegNo: regNo
        },
      });
      console.log('getStudentById response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching student data:', error);
      // Return a more descriptive error object
      if (error instanceof Error) {
        throw new Error(`Failed to fetch student data: ${error.message}`);
      }
      throw error;
    }
  }

  async getAuthoriseUserData(UserEmail: any, secreatKeys: any, userRole: any) {
    try {
      const loginData = new FormData();
      loginData.append('Email', UserEmail);
      loginData.append('PasswordText', secreatKeys);
      loginData.append('UserRole', userRole);
      
      // Note: Do NOT set 'Content-Type' manually when sending FormData
      // Axios will set it automatically with the correct boundary
      const response = await this.apiClient.post('api/LpuCIF/GetUserDataIdWise', loginData);

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
      console.log(JSON.stringify(response))
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
      const token = storageService.getUser();
      const response = await this.apiClient.get('api/LpuCIF/CIFGetAllAssignedTesttoStaff', {
         headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
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
  // get
 
  async GetAllUserLists() {
    try {
      const response = await this.apiClient.get('api/LpuCIF/GetCIFAssignTestProperties', {
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
  // Added on 3-feb -26

    async CIFInstrumentUpdateDetails(dataSoft: any) {
       try {
      const token = storageService.getUser();
      const response = await this.apiClient.post('api/LpuCIF/UpdateInstrumentImage', dataSoft, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Authorization': `Bearer ${token}`,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error due to Authorized user data:', error);
      throw error;
    }
  }


  async CIFUpdatePrice(PriceDataLoad: any) {
    try {
      const token = storageService.getUser();
      const response = await this.apiClient.post('api/LpuCIF/CIFUpdatePrice', PriceDataLoad, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
          // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error due to Authorized user data:', error);
      throw error;
    }

  }


    async ReplaceExcelSheetSample(dataSoft: any) {
       try {
      const response = await this.apiClient.post('api/LpuCIF/ReplaceExcelSheetSample', dataSoft, {
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

  async UpdateInstrumentImageFile(dataSoft: any) {
     try {
      const response = await this.apiClient.post('api/LpuCIF/UpdateInstrumentImage', dataSoft, {
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
// added on 2-FEb-26
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

  //post

  async CIFLockUser(dataSoft: any){
    try {
      const response = await this.apiClient.post('api/LpuCIF/CIFLockUserLogin', dataSoft,
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


  async ReAssignTestToStaff(dataSoft: any) {
    try {
      const response = await this.apiClient.post('api/LpuCIF/ReAssignTesttoCIFStaff', dataSoft,
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
        params: {
          AnalysisId: Id,
          TypeId: TypeId
        }
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
  async GetUploadedResultDetails(UserEmailId: any) {
    try {
      const response =  await this.apiClient.get('api/LpuCIF/GetUploadedResultDetails', {
        params: { UserId: UserEmailId}
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

