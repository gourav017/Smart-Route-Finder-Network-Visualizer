import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw } from 'lucide-react';


import HubForm from './components/HubForm.jsx';
import ConnectionForm from './components/ConnectionForm.jsx';
import Pathfinder from './components/Pathfinder.jsx';
import NetworkVisualization from './components/NetworkVisualization.jsx';
import Notification from './components/Notification.jsx';


import { hubAPI, networkAPI, healthCheck } from './services/api.js';


import './index.css';

function App() {

  const [hubs, setHubs] = useState([]);
  const [shortestPath, setShortestPath] = useState(null);
  const [networkStats, setNetworkStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [serverStatus, setServerStatus] = useState('unknown');

  
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  
  const clearNotification = () => {
    setNotification(null);
  };

 
  const checkServerHealth = async () => {
    try {
      await healthCheck();
      setServerStatus('connected');
    } catch (error) {
      setServerStatus('disconnected');
      showNotification('Server is not responding. Please check if the backend is running.', 'error');
    }
  };

 
  const fetchHubs = async () => {
    try {
      setLoading(true);
      const response = await hubAPI.getAllHubs();
      setHubs(response.data || []);
      
    
      await fetchNetworkStats();
    } catch (error) {
      showNotification(error.message, 'error');
      setHubs([]);
    } finally {
      setLoading(false);
    }
  };

  
  const fetchNetworkStats = async () => {
    try {
      const response = await networkAPI.getNetworkStats();
      setNetworkStats(response.data);
    } catch (error) {
      console.error('Failed to fetch network stats:', error);
      setNetworkStats(null);
    }
  };

 
  const handleAddHub = async (hubData) => {
    try {
      setLoading(true);
      const response = await hubAPI.createHub(hubData);
      showNotification(response.message, 'success');
      await fetchHubs(); // Refresh the list
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };


  const handleConnectHubs = async (hubId1, hubId2) => {
    try {
      setLoading(true);
      const response = await hubAPI.connectHubs(hubId1, hubId2);
      showNotification(response.message, 'success');
      await fetchHubs(); // Refresh the list
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteHub = async (hubId) => {
    try {
      setLoading(true);
      const response = await hubAPI.deleteHub(hubId);
      showNotification(response.message, 'success');
      
      // Clear shortest path if it involved the deleted hub
      if (shortestPath?.path?.includes(hubId)) {
        setShortestPath(null);
      }
      
      await fetchHubs(); 
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };


  const handleFindPath = async (sourceId, destinationId) => {
    try {
      setLoading(true);
      const response = await networkAPI.findShortestPath(sourceId, destinationId);
      setShortestPath(response.data);
      showNotification(`Shortest path found: ${response.data.path.join(' → ')}`, 'success');
    } catch (error) {
      showNotification(error.message, 'error');
      setShortestPath(null);
    } finally {
      setLoading(false);
    }
  };

  
  const loadSampleData = async () => {
    try {
      setLoading(true);
      showNotification('Loading sample data...', 'info');

      // Sample hubs
      const sampleHubs = [
        { hubId: 'A', name: 'Hub Alpha' },
        { hubId: 'B', name: 'Hub Beta' },
        { hubId: 'C', name: 'Hub Gamma' },
        { hubId: 'D', name: 'Hub Delta' }
      ];

      // Create hubs
      for (const hub of sampleHubs) {
        try {
          await hubAPI.createHub(hub);
        } catch (error) {
          // Hub might already exist, continue
          console.log(`Hub ${hub.hubId} might already exist`);
        }
      }

     
      const connections = [
        ['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D']
      ];

      for (const [hubId1, hubId2] of connections) {
        try {
          await hubAPI.connectHubs(hubId1, hubId2);
        } catch (error) {
          // Connection might already exist
          console.log(`Connection ${hubId1}-${hubId2} might already exist`);
        }
      }

      await fetchHubs();
      showNotification('Sample data loaded successfully!', 'success');
    } catch (error) {
      showNotification('Failed to load sample data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Initialize app
  useEffect(() => {
    checkServerHealth();
    fetchHubs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Activity className="w-10 h-10 mr-3 text-blue-600" />
            Smart Route Finder & Network Visualizer
          </h1>
          <p className="text-gray-600 mb-4">
            MERN Stack with Vite - Manage delivery hubs and find optimal routes
          </p>
          
          {/* Server Status & Controls */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                serverStatus === 'connected' ? 'bg-green-500' : 
                serverStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                Server: {serverStatus === 'connected' ? 'Connected' : 
                        serverStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
              </span>
            </div>
            
            <button
              onClick={fetchHubs}
              disabled={loading}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={loadSampleData}
              disabled={loading}
              className="text-sm bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
            >
              Load Sample Data
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="xl:col-span-1 space-y-6">
            <HubForm onAddHub={handleAddHub} loading={loading} />
            <ConnectionForm 
              hubs={hubs} 
              onConnectHubs={handleConnectHubs} 
              loading={loading} 
            />
          </div>

          {/* Middle Column - Pathfinder */}
          <div className="xl:col-span-1">
            <Pathfinder
              hubs={hubs}
              onFindPath={handleFindPath}
              shortestPath={shortestPath}
              loading={loading}
            />
          </div>

          {/* Right Column - Network Visualization */}
          <div className="lg:col-span-2 xl:col-span-1">
            <NetworkVisualization
              hubs={hubs}
              shortestPath={shortestPath}
              networkStats={networkStats}
              onDeleteHub={handleDeleteHub}
              loading={loading}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Built with MongoDB, Express.js, React.js & Node.js + Vite</p>
          <p className="mt-1">Dijkstra's Algorithm Implementation for Shortest Path Finding</p>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
    </div>
  );
}

export default App;