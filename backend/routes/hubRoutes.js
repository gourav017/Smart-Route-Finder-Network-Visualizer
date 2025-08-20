const express = require('express');
const router = express.Router();
const {
  getAllHubs,
  getHubById,
  createHub,
  updateHub,
  deleteHub,
  connectHubs,
  disconnectHubs
} = require('../controllers/hubController');


router.get('/', getAllHubs);                    
router.get('/:hubId', getHubById);             
router.post('/', createHub);                 
router.put('/:hubId', updateHub);             
router.delete('/:hubId', deleteHub);           


router.post('/connect', connectHubs);          
router.post('/disconnect', disconnectHubs);    

module.exports = router;