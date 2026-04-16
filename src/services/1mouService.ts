import axios from 'axios';

// services/myAppWebService.js
import { storageService } from './storageService';



export interface EventModel {
  eventId: number;
  eventName: string;
  eventDate: string;
  eventCategory: 'Upcoming' | 'Happenings'; 
  eventDetails: string;
  imageUrl: string;
  Action?: 'Insert' | 'Update' | 'Delete' | 'View';
  eventFileData?: any;
  disapprovalReason?: string;
  LoginName?: string;
}


class MymouService {
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

    this.apiClient.interceptors.response.use(
      (response: any) => {
        const data = response.data;

        if (data && typeof data === 'object') {
          if (data.success === false || data.isError === true || data.error === true) {
            const errorMessage = data.message || data.errorMessage || 'An error occurred';
            return Promise.reject(new Error(errorMessage));
          }
        }

        return response;
      },
      (error: any) => {
        let errorMessage = 'An error occurred';

        if (error.response) {
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

  // --- CRUD Operations ---

  /**
 * Helper function to prepare the FormData payload for the API.
 * Your backend is expecting a [FromForm] CIFEventsDetailsModel.
 */
  private prepareFormData(event: EventModel, action: 'Insert' | 'Update' | 'Delete' | 'View'): FormData {
    const formData = new FormData();

    formData.append('Action', action);

    if (event.eventId !== null) {
      formData.append('EventId', event.eventId.toString());
    }

    if (action !== 'Delete' && action !== 'View') {
      formData.append('EventName', event.eventName);
      formData.append('EventDate', event.eventDate);
      formData.append('EventCategory', event.eventCategory);
      formData.append('EventDetails', event.eventDetails);
      formData.append('ImageUrl', event.imageUrl);
      formData.append('EventFileData', event.eventFileData || '');
      formData.append('DisapprovalReason', event.disapprovalReason || '');
      formData.append('LoginName', event.LoginName || 'DefaultUser');
    }

    return formData;
  }


  /**
   * The unified function to handle all CRUD operations for Events.
   * * @param data The FormData containing all event fields and the 'Action' parameter.
   * @param action The specific action ('Insert', 'Update', 'Delete', 'View')
   * @returns An Observable that resolves to the API response (e.g., success message or list of events).
   */
  async EventsCrudOperation(data: FormData, action: 'Insert' | 'Update' | 'Delete' | 'View') {
    var authToken = storageService.getUser();
    const Token = storageService.getUser();
    try {
      const response = await this.apiClient.get('api/LpuCIF/EventsCrudOperation', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching authorized user data:', error);
      throw error;
    }


  }



  


}

const mouService = new MymouService();
export default mouService;



// const BASE_URL =  process.env.NEXT_PUBLIC_AUTH_API_LOCAL;//'https://localhost:7125/api/LpuCIF';
// const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN;

// const getHeaders = () => ({
//   'Content-Type': 'application/json',
//   'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
// });


 

// export const mouService = {

 
//   async viewMyMous(userId: string) {
//     const fd = new FormData();
//     fd.append('Action', 'View');
//     fd.append('UserId', userId);
//     const res = await axios.post(`${BASE_URL}/CIFMOUCrudOperation`, fd, { headers: getHeaders() });
//     return res.data.item1 || [];
//   },

//   async insertMou(payload: any) {
//     const fd = new FormData();
//     fd.append('Action', 'Insert');
//     fd.append('MOUTitle', payload.mouTitle);
//     fd.append('MouStartDate', payload.mouStartDate);
//     fd.append('MouEndDate', payload.mouEndDate);
//     fd.append('MOURemarks', payload.mouRemarks || '');
//     fd.append('UserId', payload.userId);
//     if (payload.file) fd.append('File', payload.file);
    
//     return axios.post(`${BASE_URL}/CIFMOUCrudOperation`, fd, { headers: getHeaders() });
//   }
// };