const Hub = require('../models/Hub');

const getAllHubs = async (req, res) => {
  try {
    const hubs = await Hub.find().sort({ hubId: 1 });
    res.json({
      success: true,
      data: hubs,
      count: hubs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch hubs',
      details: error.message
    });
  }
};



const getHubById = async (req, res) => {
  try {
    const { hubId } = req.params;
    const hub = await Hub.findOne({ hubId: hubId.toUpperCase() });
    
    if (!hub) {
      return res.status(404).json({
        success: false,
        error: 'Hub not found'
      });
    }
    
    res.json({
      success: true,
      data: hub
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch hub',
      details: error.message
    });
  }
};



const createHub = async (req, res) => {
  try {
    const { hubId, name } = req.body;
    
   
    
    if (!hubId || !name) {
      return res.status(400).json({
        success: false,
        error: 'Hub ID and name are required'
      });
    }
    
    
    
    const existingHub = await Hub.findOne({ hubId: hubId.toUpperCase() });
    if (existingHub) {
      return res.status(409).json({
        success: false,
        error: 'Hub with this ID already exists'
      });
    }
    
    const hub = new Hub({
      hubId: hubId.toUpperCase(),
      name: name.trim(),
      connections: []
    });
    
    await hub.save();
    
    res.status(201).json({
      success: true,
      message: 'Hub created successfully',
      data: hub
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create hub',
      details: error.message
    });
  }
};



const updateHub = async (req, res) => {
  try {
    const { hubId } = req.params;
    const { name } = req.body;
    
    const hub = await Hub.findOne({ hubId: hubId.toUpperCase() });
    if (!hub) {
      return res.status(404).json({
        success: false,
        error: 'Hub not found'
      });
    }
    
    if (name) {
      hub.name = name.trim();
    }
    
    await hub.save();
    
    res.json({
      success: true,
      message: 'Hub updated successfully',
      data: hub
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update hub',
      details: error.message
    });
  }
};



const deleteHub = async (req, res) => {
  try {
    const { hubId } = req.params;
    const hubIdUpper = hubId.toUpperCase();
    
    const hub = await Hub.findOne({ hubId: hubIdUpper });
    if (!hub) {
      return res.status(404).json({
        success: false,
        error: 'Hub not found'
      });
    }
    
    
    
    await Hub.updateMany(
      { connections: hubIdUpper },
      { $pull: { connections: hubIdUpper } }
    );
    

    
    await Hub.deleteOne({ hubId: hubIdUpper });
    
    res.json({
      success: true,
      message: 'Hub deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete hub',
      details: error.message
    });
  }
};



const connectHubs = async (req, res) => {
  try {
    const { hubId1, hubId2 } = req.body;
    
    if (!hubId1 || !hubId2) {
      return res.status(400).json({
        success: false,
        error: 'Both hub IDs are required'
      });
    }
    
    const hubId1Upper = hubId1.toUpperCase();
    const hubId2Upper = hubId2.toUpperCase();
    
    if (hubId1Upper === hubId2Upper) {
      return res.status(400).json({
        success: false,
        error: 'Cannot connect hub to itself'
      });
    }
    
   
    
    const [hub1, hub2] = await Promise.all([
      Hub.findOne({ hubId: hubId1Upper }),
      Hub.findOne({ hubId: hubId2Upper })
    ]);
    
    if (!hub1) {
      return res.status(404).json({
        success: false,
        error: `Hub ${hubId1Upper} not found`
      });
    }
    
    if (!hub2) {
      return res.status(404).json({
        success: false,
        error: `Hub ${hubId2Upper} not found`
      });
    }
    
    
    
    if (hub1.connections.includes(hubId2Upper)) {
      return res.status(400).json({
        success: false,
        error: 'Hubs are already connected'
      });
    }
    
   
    
    hub1.addConnection(hubId2Upper);
    hub2.addConnection(hubId1Upper);
    
    await Promise.all([hub1.save(), hub2.save()]);
    
    res.json({
      success: true,
      message: 'Hubs connected successfully',
      data: {
        hub1: hub1,
        hub2: hub2
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to connect hubs',
      details: error.message
    });
  }
};



const disconnectHubs = async (req, res) => {
  try {
    const { hubId1, hubId2 } = req.body;
    
    const hubId1Upper = hubId1.toUpperCase();
    const hubId2Upper = hubId2.toUpperCase();
    
    
    const [hub1, hub2] = await Promise.all([
      Hub.findOne({ hubId: hubId1Upper }),
      Hub.findOne({ hubId: hubId2Upper })
    ]);
    
    if (!hub1 || !hub2) {
      return res.status(404).json({
        success: false,
        error: 'One or both hubs not found'
      });
    }
    
    
    hub1.removeConnection(hubId2Upper);
    hub2.removeConnection(hubId1Upper);
    
    await Promise.all([hub1.save(), hub2.save()]);
    
    res.json({
      success: true,
      message: 'Hubs disconnected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to disconnect hubs',
      details: error.message
    });
  }
};

module.exports = {
  getAllHubs,
  getHubById,
  createHub,
  updateHub,
  deleteHub,
  connectHubs,
  disconnectHubs
};