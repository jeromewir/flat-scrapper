var express = require('express');
var request = require('request');
var _ = require('lodash');
var iconv = require('iconv-lite');
var mongo = require('./mongo');
var async = require('async');
var bodyParser = require('body-parser');
var moment = require('moment');

var handlers = {
  seloger: require('./handlers/seloger'),
  pap: require('./handlers/pap'),
  leboncoin: require('./handlers/leboncoin'),
  'logic-immo': require('./handlers/logicImmo'),
  century: require('./handlers/century'),
  'guy-hoquet': require('./handlers/guyhoquet'),
  foncia: require('./handlers/foncia'),
};

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//var url = 'http://www.seloger.com/annonces/achat/appartement/paris-3eme-75/sainte-avoie/106557281.htm?ci=750102,750103,750111,750112,750115&etagemin=1&idtt=2&org=advanced_search&pxmax=350000&pxmin=300000&bd=Li_LienAnn_1';
//var url = 'http://www.pap.fr/annonce/vente-appartement-maison-paris-12e-g37779g37781g37782-a-partir-du-2-pieces-entre-330000-et-350000-euros-r409801539';
//var url = 'https://www.leboncoin.fr/ventes_immobilieres/929907062.htm?ca=12_s';
//var url = 'http://www.logic-immo.com/detail-vente-ac5c8147-f7c8-2172-f8b1-1528147a7864.htm';

function handleFlat(url, body, next) {
  var keys = _.keys(handlers);

  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    if (url.match(key)) {
      return handlers[key].parseFlat(body, url, next);
    }
  }

  return next('Site non reconnu');
}

app.post('/api/flat', (req, res) => {
  if (!req.body.url) return res.status(400).send({ message: 'URL not found' });
  var url = req.body.url;
  async.waterfall([
    (next) => {
      getBody(url, next);
    },

    (body, next) => {
      handleFlat(url, body, next);
    },

    (flat, next) => {
      addFlat(flat, next);
    },

  ], (err, flat) => {
    if (err) return res.status(400).send({ message: err });
    res.status(200).send({ flat: flat });
  });
});

app.get('/api/flat/:id', (req, res) => {
  var Flat = mongo.mongoose.model('Flat');

  Flat.findOne({ _id: req.params.id }, (err, flat) => {
    if (err) return res.status(500).send({ message: err });
    if (!flat) return res.status(404).send({ message: 'Flat not found' });
    return res.send({ flat: flat });
  });
});

app.post('/api/flat/:id', (req, res) => {
  var Flat = mongo.mongoose.model('Flat');

  Flat.update({ _id: req.body.flat._id }, { $set: req.body.flat }, (err, flat) => {
    if (err) return res.status(500).send({ message: err });
    if (!flat) return res.status(404).send({ message: 'Flat not found' });
    return res.send({ flat: flat });
  });
});

app.delete('/api/flat/:id', (req, res) => {
  var Flat = mongo.mongoose.model('Flat');

  Flat.remove({ _id: req.params.id }, (err) => {
    if (err) return res.status(500).send({ message: err });
    res.status(204).send();
  });
});

function addFlat(flat, next) {
  var Flat = mongo.mongoose.model('Flat');
  Flat.create(flat, next);
}

function getBody(url, next) {
  request.get({
    url: url,
    encoding: null,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
    },
  }, (err, response, body) => {
    if (err) {
      console.error(err);
      return next('Mauvaise URL');
    }

    return next(null, url.match('seloger') ||
      url.match('century') ||
      url.match('guy-hoquet') ||
      url.match('foncia') ?
      body : iconv.decode(new Buffer(body), 'ISO-8859-1'));
  });
}

app.get('/api/flat', (req, res) => {
  var Flat = mongo.mongoose.model('Flat');

  Flat.find((err, flats) => {
    if (err) return res.status(500).send({ message: err });
    return res.status(200).send({ flats: flats });
  });
});

app.use(express.static('app'));

app.listen(3001, function () {
  console.log('App is listening');
});
