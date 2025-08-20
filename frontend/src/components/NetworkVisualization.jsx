import React from 'react';
import { MapPin, Trash2, Users, Network } from 'lucide-react';

const NetworkVisualization = ({ hubs, shortestPath, networkStats, onDeleteHub, loading }) => {
  const isHubInPath = (hubId) => {
    return shortestPath?.path?.includes(hubId) || false;
  };

  const getConnectionBadgeColor = (hubId) => {
    if (shortestPath?.path?.includes(hubId)) {
      return 'bg-purple-100 text-purple-700 border-purple-200';
    }
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const handleDeleteHub = (hubId) => {
    if (window.confirm(`Are you sure you want to delete hub ${hubId}? This will remove all its connections.`)) {
      onDeleteHub(hubId);
    }
  };

  if (hubs.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Network Overview
        </h2>
        <div className="text-center py-12 text-gray-500">
          <Network className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No hubs in the network yet</p>
          <p className="text-sm">Add your first hub to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <MapPin className="w-5 h-5 mr-2" />
        Network Overview
      </h2>

      {/* Network Statistics */}
      {networkStats && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Users className="w-4 h-4 mr-1" />
            Network Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {networkStats.totalHubs}
              </div>
              <div className="text-sm text-blue-800">Total Hubs</div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {networkStats.totalConnections}
              </div>
              <div className="text-sm text-green-800">Connections</div>
            </div>
          </div>
          {networkStats.averageConnections !== undefined && (
            <div className="mt-2 text-center text-xs text-gray-600">
              Average: {networkStats.averageConnections.toFixed(1)} connections per hub
            </div>
          )}
        </div>
      )}

      {/* Hubs List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {hubs.map((hub) => {
          const isInPath = isHubInPath(hub.hubId);
          
          return (
            <div
              key={hub.hubId}
              className={`hub-card ${isInPath ? 'hub-card-highlighted' : 'hub-card-normal'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold text-lg ${
                      isInPath ? 'text-purple-700' : 'text-gray-800'
                    }`}>
                      Hub {hub.hubId}
                    </h3>
                    <button
                      onClick={() => handleDeleteHub(hub.hubId)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 p-1 rounded transition-colors duration-200"
                      title="Delete Hub"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className={`text-sm ${
                    isInPath ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    {hub.name}
                  </p>
                  {isInPath && (
                    <span className="inline-block mt-1 bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full">
                      In Current Path
                    </span>
                  )}
                </div>
              </div>
              
              {/* Connections */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Connected to:
                  </h4>
                  <span className="text-xs text-gray-500">
                    {hub.connections?.length || 0} connection{(hub.connections?.length || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {hub.connections && hub.connections.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {hub.connections.map((connectedId) => (
                      <span
                        key={connectedId}
                        className={`text-xs px-2 py-1 rounded-full border ${getConnectionBadgeColor(connectedId)}`}
                      >
                        {connectedId}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500 italic">
                    No connections
                  </span>
                )}
              </div>

              {/* Hub metadata */}
              <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Created: {new Date(hub.createdAt).toLocaleDateString()}</span>
                  {hub.updatedAt && hub.updatedAt !== hub.createdAt && (
                    <span>Updated: {new Date(hub.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Path Highlight Legend */}
      {shortestPath?.path?.length > 0 && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center text-sm text-purple-700">
            <div className="w-3 h-3 bg-purple-200 rounded-full mr-2"></div>
            <span>Hubs highlighted in purple are part of the current shortest path</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkVisualization;