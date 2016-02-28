'use strict';

var mongoose = require('mongoose');

class Mongo {
  constructor() {
    mongoose.connect('mongodb://localhost/flatScrapper');

    mongoose.connection.on('connected', function() {
      console.log('Mongo connected');
    });

    var FlatSchema = new mongoose.Schema({
      name: String,
      price: Number,
      rooms: Number,
      size: Number,
      photos: [String],
      url: String,
      website: String,
      visited: Boolean,
      district: String,
      comment: String,
    }, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

    mongoose.model('Flat', FlatSchema);

    this.mongoose = mongoose;
  }
}
module.exports = new Mongo();