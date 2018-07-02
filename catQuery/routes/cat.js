const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../models/index');

const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/register');

router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  const registerDate = new Date();

  if (!isValid) {
    return res.status(400).json(errors);
  }

  db.query('SELECT * FROM cats WHERE username = ?', [req.body.username], (err, rows) => {
    if (err) throw (err);

    if (rows.length) {
      errors.username = 'Username already exists';
      return res.status(400).json(errors);
    } else {
      const newUser = {
        addedAt: registerDate,
        breed: req.body.breed,
        birthdate: req.body.birthdate,
        imageUrl: req.body.imageUrl,
        lastSeenAt: registerDate,
        name: req.body.name,
        password: req.body.password,
        username: req.body.username,
        weight: req.body.weight
      }

      db.query('INSERT INTO cats SET ?', newUser, (err, result) => {
        if (err) throw (err);
        res.json();
      });
    }
  });
});

router.post('/login', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  const loginDate = new Date();

  if (!isValid) {
    return res.status(400).json(errors);
  }

  db.query('SELECT * FROM cats WHERE username = ? AND password = ?', [req.body.username, req.body.password], (err, rows) => {
    if (err) throw (err);

    if (!rows.length) {
      db.query('SELECT * FROM cats WHERE username = ?', [req.body.username], (err, username) => {
        if (err) thow(err);

        if (!username.length) {
          errors.username = 'Username does not exit'
        } else {
          errors.password = 'Password is incorrect'
        }

        return res.status(400).json(errors);
      });
    } else {
      db.query('UPDATE cats SET lastSeenAt = ?', [loginDate], (err) => {
        if (err) throw (err);
      });

      jwt.sign(
        { id: rows[0].id },
        config.secret,
        { expiresIn: 3600 },
        (err, authToken) => {
          res.status(200).send({ authToken: authToken })
        }
      );
    }
  });
});

module.exports = router;