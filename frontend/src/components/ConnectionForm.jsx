import React, { useState } from 'react';
import { Link } from 'lucide-react';

const ConnectionForm = ({ hubs, onConnectHubs, loading }) => {
  const [hubId1, setHubId1] = useState('');
  const [hubId2, setHubId2] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!hubId1 || !hubId2) {
      alert('Please select both hubs to connect');
      return;
    }

    if (hubId1 === hubId2) {
      alert('Cannot connect a hub to itself');
      return;
    }

    onConnectHubs(hubId1, hubId2);

    
    setHubId1('');
    setHubId2('');
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Link className="w-5 h-5 mr-2" />
        Connect Hubs
      </h2>
      
      {hubs.length < 2 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Add at least 2 hubs to create connections</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Hub *
            </label>
            <select
              value={hubId1}
              onChange={(e) => setHubId1(e.target.value)}
              className="select-field"
              disabled={loading}
            >
              <option value="">Select first hub...</option>
              {hubs.map((hub) => (
                <option key={hub.hubId} value={hub.hubId}>
                  {hub.hubId} - {hub.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Second Hub *
            </label>
            <select
              value={hubId2}
              onChange={(e) => setHubId2(e.target.value)}
              className="select-field"
              disabled={loading}
            >
              <option value="">Select second hub...</option>
              {hubs
                .filter((hub) => hub.hubId !== hubId1)
                .map((hub) => (
                  <option key={hub.hubId} value={hub.hubId}>
                    {hub.hubId} - {hub.name}
                  </option>
                ))}
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading || !hubId1 || !hubId2}
            className="btn-success w-full"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner mr-2"></div>
                Connecting...
              </div>
            ) : (
              'Connect Hubs'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ConnectionForm;