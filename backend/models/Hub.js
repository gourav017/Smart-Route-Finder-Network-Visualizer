const mongoose = require('mongoose');

const hubSchema = new mongoose.Schema({
  hubId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: 10
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  connections: [{
    type: String,
    uppercase: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


hubSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});


hubSchema.methods.addConnection = function(hubId) {
  if (!this.connections.includes(hubId) && hubId !== this.hubId) {
    this.connections.push(hubId);
  }
  return this;
};

hubSchema.methods.removeConnection = function(hubId) {
  this.connections = this.connections.filter(id => id !== hubId);
  return this;
};


hubSchema.index({ hubId: 1 });
hubSchema.index({ connections: 1 });

module.exports = mongoose.model('Hub', hubSchema);