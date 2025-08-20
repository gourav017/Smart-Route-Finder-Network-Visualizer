import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const HubForm = ({ onAddHub, loading }) => {
  const [hubId, setHubId] = useState('');
  const [hubName, setHubName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!hubId.trim() || !hubName.trim()) {
      alert('Please fill in both Hub ID and Name');
      return;
    }

    onAddHub({
      hubId: hubId.trim().toUpperCase(),
      name: hubName.trim()
    });

 
    setHubId('');
    setHubName('');
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Plus className="w-5 h-5 mr-2" />
        Add New Hub
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hub ID *
          </label>
          <input
            type="text"
            value={hubId}
            onChange={(e) => setHubId(e.target.value)}
            placeholder="e.g., E"
            className="input-field"
            disabled={loading}
            maxLength={10}
          />
          <p className="text-xs text-gray-500 mt-1">
            Unique identifier for the hub (will be converted to uppercase)
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hub Name *
          </label>
          <input
            type="text"
            value={hubName}
            onChange={(e) => setHubName(e.target.value)}
            placeholder="e.g., Hub Echo"
            className="input-field"
            disabled={loading}
            maxLength={100}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !hubId.trim() || !hubName.trim()}
          className="btn-primary w-full"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="loading-spinner mr-2"></div>
              Adding...
            </div>
          ) : (
            'Add Hub'
          )}
        </button>
      </form>
    </div>
  );
};

export default HubForm;