import axios from 'axios';

const BASE_URL = 'https://localhost:7125/api/LpuCIF';
const AUTH_TOKEN = '123Asdad3314fsdfI';

const getHeaders = () => ({
  'Authorization': `Bearer ${AUTH_TOKEN}`
});

export const mouService = {
  async viewMyMous(userId: string) {
    const fd = new FormData();
    fd.append('Action', 'View');
    fd.append('UserId', userId);
    const res = await axios.post(`${BASE_URL}/CIFMOUCrudOperation`, fd, { headers: getHeaders() });
    return res.data.item1 || [];
  },

  async insertMou(payload: any) {
    const fd = new FormData();
    fd.append('Action', 'Insert');
    fd.append('MOUTitle', payload.mouTitle);
    fd.append('MouStartDate', payload.mouStartDate);
    fd.append('MouEndDate', payload.mouEndDate);
    fd.append('MOURemarks', payload.mouRemarks || '');
    fd.append('UserId', payload.userId);
    if (payload.file) fd.append('File', payload.file);
    
    return axios.post(`${BASE_URL}/CIFMOUCrudOperation`, fd, { headers: getHeaders() });
  }
};