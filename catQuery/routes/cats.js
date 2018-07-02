const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../models/index');

router.post('/', (req, res) => {
  const token = req.headers['auth-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided' });
  };

  jwt.verify(token, config.secret, (err, authToken) => {
    if (err) {
      return res.status(500).send({ message: 'Invalid auth-token' });
    } else {
      let optionalField = 'SELECT birthdate, breed, username, id, imageUrl, name FROM cats'
      let variableArr = [];

      if (req.body.id || req.body.name || req.body.username) {
        optionalField += ' WHERE';
      }

      if (req.body.id) {
        optionalField = optionalField + ' AND id = ?';
        variableArr.push(req.body.id);
      }

      if (req.body.name) {
        optionalField = optionalField + ' AND name = ?';
        variableArr.push(req.body.name);
      }

      if (req.body.username) {
        optionalField = optionalField + ' AND username = ?';
        variableArr.push(req.body.username);
      }

      if (req.body.id || req.body.name || req.body.username) {
        optionalField = optionalField.replace('WHERE AND', 'WHERE');
      }

      optionalField += ' ORDER BY lastSeenAt DESC;';

      db.query(optionalField, variableArr, (err, rows) => {
        if (err) throw (err);

        if (!rows.length) {
          return res.json({ message: 'Invalid Search Criteria' });
        }

        return res.json(rows);
      });
    }
  });
});

router.get('/random', (req, res) => {
  db.query('SELECT imageUrl, name, breed FROM cats ORDER BY RAND() LIMIT 1', (err, randomCat) => {
    if (err) throw (err);

    return res.json(randomCat);
  });
});

module.exports = router;