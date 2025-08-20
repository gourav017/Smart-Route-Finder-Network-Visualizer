const Hub = require('../models/Hub');


class NetworkPathfinder {
  constructor(hubs) {
    this.hubs = new Map();
    hubs.forEach(hub => {
      this.hubs.set(hub.hubId, hub);
    });
  }

  findShortestPath(sourceId, destinationId) {
    if (!this.hubs.has(sourceId) || !this.hubs.has(destinationId)) {
      return null;
    }

    if (sourceId === destinationId) {
      return [sourceId];
    }

    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();

  
    for (let hubId of this.hubs.keys()) {
      distances.set(hubId, Infinity);
      unvisited.add(hubId);
    }
    distances.set(sourceId, 0);

    while (unvisited.size > 0) {
      
      let currentNode = null;
      let minDistance = Infinity;
      for (let node of unvisited) {
        if (distances.get(node) < minDistance) {
          minDistance = distances.get(node);
          currentNode = node;
        }
      }

      if (currentNode === null || distances.get(currentNode) === Infinity) {
        break; 
      }

      unvisited.delete(currentNode);

     
      if (currentNode === destinationId) {
        const path = [];
        let current = destinationId;
        while (current !== undefined) {
          path.unshift(current);
          current = previous.get(current);
        }
        return path;
      }

     
      const currentHub = this.hubs.get(currentNode);
      for (let neighbor of currentHub.connections) {
        if (!unvisited.has(neighbor)) continue;

        const altDistance = distances.get(currentNode) + 1;
        if (altDistance < distances.get(neighbor)) {
          distances.set(neighbor, altDistance);
          previous.set(neighbor, currentNode);
        }
      }
    }

    return null; // No path found
  }

  getAllPaths(sourceId, destinationId, maxDepth = 10) {
    const paths = [];
    const visited = new Set();
    
    const dfs = (currentId, targetId, currentPath, depth) => {
      if (depth > maxDepth) return;
      if (currentId === targetId) {
        paths.push([...currentPath]);
        return;
      }
      
      const currentHub = this.hubs.get(currentId);
      if (!currentHub) return;
      
      for (let neighbor of currentHub.connections) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          currentPath.push(neighbor);
          dfs(neighbor, targetId, currentPath, depth + 1);
          currentPath.pop();
          visited.delete(neighbor);
        }
      }
    };
    
    visited.add(sourceId);
    dfs(sourceId, destinationId, [sourceId], 0);
    
    return paths;
  }

  getNetworkStats() {
    const totalHubs = this.hubs.size;
    let totalConnections = 0;
    const hubConnections = new Map();
    
    for (let [hubId, hub] of this.hubs) {
      const connectionCount = hub.connections.length;
      totalConnections += connectionCount;
      hubConnections.set(hubId, connectionCount);
    }
    
    
    totalConnections = totalConnections / 2;
    
    // Find most/least connected hubs
    const sortedHubs = Array.from(hubConnections.entries())
      .sort((a, b) => b[1] - a[1]);
    
    return {
      totalHubs,
      totalConnections,
      averageConnections: totalHubs > 0 ? (totalConnections * 2) / totalHubs : 0,
      mostConnectedHub: sortedHubs[0] || null,
      leastConnectedHub: sortedHubs[sortedHubs.length - 1] || null,
      hubConnections: Object.fromEntries(hubConnections)
    };
  }
}

// Find shortest path between two hubs
const findShortestPath = async (req, res) => {
  try {
    const { sourceId, destinationId } = req.params;
    
    if (!sourceId || !destinationId) {
      return res.status(400).json({
        success: false,
        error: 'Source and destination hub IDs are required'
      });
    }
    
    const sourceIdUpper = sourceId.toUpperCase();
    const destinationIdUpper = destinationId.toUpperCase();
    
    
    const hubs = await Hub.find();
    
    if (hubs.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No hubs found in the network'
      });
    }
    
    
    const pathfinder = new NetworkPathfinder(hubs);
    
    const path = pathfinder.findShortestPath(sourceIdUpper, destinationIdUpper);
    
    if (!path) {
      return res.status(404).json({
        success: false,
        error: 'No path found between the specified hubs'
      });
    }
    
    
    const pathDetails = [];
    for (let hubId of path) {
      const hub = await Hub.findOne({ hubId });
      if (hub) {
        pathDetails.push({
          hubId: hub.hubId,
          name: hub.name
        });
      }
    }
    
    res.json({
      success: true,
      data: {
        path: path,
        pathDetails: pathDetails,
        distance: path.length - 1,
        source: sourceIdUpper,
        destination: destinationIdUpper
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to find shortest path',
      details: error.message
    });
  }
};

// Find all possible paths (with reasonable limit)
const findAllPaths = async (req, res) => {
  try {
    const { sourceId, destinationId } = req.params;
    const { maxDepth = 5 } = req.query;
    
    const sourceIdUpper = sourceId.toUpperCase();
    const destinationIdUpper = destinationId.toUpperCase();
    
    const hubs = await Hub.find();
    const pathfinder = new NetworkPathfinder(hubs);
    
    const paths = pathfinder.getAllPaths(sourceIdUpper, destinationIdUpper, parseInt(maxDepth));
    
    // Sort paths by length
    paths.sort((a, b) => a.length - b.length);
    
    const pathsWithDetails = await Promise.all(
      paths.map(async (path) => {
        const pathDetails = [];
        for (let hubId of path) {
          const hub = await Hub.findOne({ hubId });
          if (hub) {
            pathDetails.push({
              hubId: hub.hubId,
              name: hub.name
            });
          }
        }
        return {
          path: path,
          pathDetails: pathDetails,
          distance: path.length - 1
        };
      })
    );
    
    res.json({
      success: true,
      data: {
        paths: pathsWithDetails,
        totalPaths: pathsWithDetails.length,
        shortestDistance: pathsWithDetails[0]?.distance || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to find all paths',
      details: error.message
    });
  }
};

// Get network statistics
const getNetworkStats = async (req, res) => {
  try {
    const hubs = await Hub.find();
    
    if (hubs.length === 0) {
      return res.json({
        success: true,
        data: {
          totalHubs: 0,
          totalConnections: 0,
          averageConnections: 0,
          mostConnectedHub: null,
          leastConnectedHub: null,
          hubConnections: {}
        }
      });
    }
    
    const pathfinder = new NetworkPathfinder(hubs);
    const stats = pathfinder.getNetworkStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get network statistics',
      details: error.message
    });
  }
};

// Check if network is connected (all hubs reachable from any hub)
const checkConnectivity = async (req, res) => {
  try {
    const hubs = await Hub.find();
    
    if (hubs.length <= 1) {
      return res.json({
        success: true,
        data: {
          isConnected: true,
          components: hubs.length,
          isolatedHubs: []
        }
      });
    }
    
    const pathfinder = new NetworkPathfinder(hubs);
    const firstHubId = hubs[0].hubId;
    const isolatedHubs = [];
    
    
    for (let hub of hubs) {
      if (hub.hubId !== firstHubId) {
        const path = pathfinder.findShortestPath(firstHubId, hub.hubId);
        if (!path) {
          isolatedHubs.push({
            hubId: hub.hubId,
            name: hub.name
          });
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        isConnected: isolatedHubs.length === 0,
        totalHubs: hubs.length,
        connectedHubs: hubs.length - isolatedHubs.length,
        isolatedHubs: isolatedHubs
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check network connectivity',
      details: error.message
    });
  }
};

module.exports = {
  findShortestPath,
  findAllPaths,
  getNetworkStats,
  checkConnectivity
};