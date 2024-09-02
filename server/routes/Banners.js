const express = require('express');
const banner = express.Router()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser')
const Banner = require('../models/Banner');

banner.use(cors());
process.env.SECRET_KEY = 'secret';

banner.post('/banners', (req, res) => {
    Banner.findAll({
    })
    .then(banners => {
        res.json({ banners: banners });
    })
    .catch(err => {
        res.send('error: '+ err);
    })
});

banner.post('/editbanner', (req, res) => {
    Banner.update(
        { 
            status: req.body.status,
            alt: req.body.alt,
            src: req.body.src,
            href: req.body.href
        },
        { where: { id: req.body.id }}
      )
      .then(function() {
        res.status(200).json({status:"Banner updated successfully!"}); 
      })
      .catch(err => {
        res.send('error: '+ err);
      })
});
  
module.exports = banner