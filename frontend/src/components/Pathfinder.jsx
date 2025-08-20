import React, { useState } from 'react';
import { Search, ArrowRight, Navigation } from 'lucide-react';

const Pathfinder = ({ hubs, onFindPath, shortestPath, loading }) => {
  const [sourceHub, setSourceHub] = useState('');
  const [destinationHub, setDestinationHub] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!sourceHub || !destinationHub) {
      alert('Please select both source and destination hubs');
      return;
    }

    if (sourceHub === destinationHub) {
      alert('Source and destination cannot be the same');
      return;
    }

    onFindPath(sourceHub, destinationHub);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Search className="w-5 h-5 mr-2" />
        Find Shortest Path
      </h2>
      
      {hubs.length < 2 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Add at least 2 connected hubs to find paths</p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source Hub *
              </label>
              <select
                value={sourceHub}
                onChange={(e) => setSourceHub(e.target.value)}
                className="select-field"
                disabled={loading}
              >
                <option value="">Select source hub...</option>
                {hubs.map((hub) => (
                  <option key={hub.hubId} value={hub.hubId}>
                    {hub.hubId} - {hub.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination Hub *
              </label>
              <select
                value={destinationHub}
                onChange={(e) => setDestinationHub(e.target.value)}
                className="select-field"
                disabled={loading}
              >
                <option value="">Select destination hub...</option>
                {hubs
                  .filter((hub) => hub.hubId !== sourceHub)
                  .map((hub) => (
                    <option key={hub.hubId} value={hub.hubId}>
                      {hub.hubId} - {hub.name}
                    </option>
                  ))}
              </select>
            </div>
            
            <button
              type="submit"
              disabled={loading || !sourceHub || !destinationHub}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Finding Path...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Navigation className="w-4 h-4 mr-2" />
                  Find Shortest Path
                </div>
              )}
            </button>
          </form>

          {/* Path Result Display */}
          {shortestPath && shortestPath.path && shortestPath.path.length > 0 && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                <Navigation className="w-4 h-4 mr-2" />
                Shortest Path Found
              </h3>
              
              {/* Visual Path */}
              <div className="flex items-center justify-center flex-wrap gap-2 mb-4">
                {shortestPath.path.map((hubId, index) => (
                  <React.Fragment key={hubId}>
                    <div className="flex items-center">
                      <span className="bg-purple-200 text-purple-800 font-semibold px-3 py-2 rounded-full text-sm">
                        {hubId}
                      </span>
                    </div>
                    {index < shortestPath.path.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-purple-600" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Path Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-purple-700 font-medium">Distance:</span>
                  <span className="text-purple-800 font-semibold">
                    {shortestPath.distance} hop{shortestPath.distance !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {shortestPath.pathDetails && (
                  <div className="mt-3">
                    <span className="text-purple-700 font-medium block mb-2">Route Details:</span>
                    {shortestPath.pathDetails.map((hub, index) => (
                      <div key={hub.hubId} className="text-purple-600">
                        {index + 1}. {hub.name} ({hub.hubId})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Pathfinder;