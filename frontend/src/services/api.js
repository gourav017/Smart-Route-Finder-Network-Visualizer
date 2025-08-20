import axios from 'axios';


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


API.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);


API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);


export const hubAPI = {

  getAllHubs: async () => {
    try {
      const response = await API.get('/hubs');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch hubs');
    }
  },

  
  getHubById: async (hubId) => {
    try {
      const response = await API.get(`/hubs/${hubId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch hub');
    }
  },

 
  createHub: async (hubData) => {
    try {
      const response = await API.post('/hubs', hubData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create hub');
    }
  },

  // Update hub
  updateHub: async (hubId, hubData) => {
    try {
      const response = await API.put(`/hubs/${hubId}`, hubData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update hub');
    }
  },

 
  deleteHub: async (hubId) => {
    try {
      const response = await API.delete(`/hubs/${hubId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete hub');
    }
  },


  connectHubs: async (hubId1, hubId2) => {
    try {
      const response = await API.post('/hubs/connect', { hubId1, hubId2 });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to connect hubs');
    }
  },

  
  disconnectHubs: async (hubId1, hubId2) => {
    try {
      const response = await API.post('/hubs/disconnect', { hubId1, hubId2 });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to disconnect hubs');
    }
  },
};


export const networkAPI = {
  
  findShortestPath: async (sourceId, destinationId) => {
    try {
      const response = await API.get(`/network/path/${sourceId}/${destinationId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to find shortest path');
    }
  },

  
  findAllPaths: async (sourceId, destinationId, maxDepth = 5) => {
    try {
      const response = await API.get(`/network/paths/${sourceId}/${destinationId}?maxDepth=${maxDepth}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to find all paths');
    }
  },

  // Get network statistics
  getNetworkStats: async () => {
    try {
      const response = await API.get('/network/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get network statistics');
    }
  },

  
  checkConnectivity: async () => {
    try {
      const response = await API.get('/network/connectivity');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to check connectivity');
    }
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await API.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Server is not responding');
  }
};

export default API;