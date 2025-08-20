const express = require('express');
const router = express.Router();
const {
  findShortestPath,
  findAllPaths,
  getNetworkStats,
  checkConnectivity
} = require('../controllers/networkController');


router.get('/path/:sourceId/:destinationId', findShortestPath);     
router.get('/paths/:sourceId/:destinationId', findAllPaths);       
router.get('/stats', getNetworkStats);                              
router.get('/connectivity', checkConnectivity);                     

module.exports = router;