const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const key = process.env.PAYU_MERCHANT_KEY || 'gtKFFx';
const salt = process.env.PAYU_MERCHANT_SALT || 'eCwWELxi';

router.post('/payu-hash', (req, res) => {
  const { amount, productinfo, firstname, email, phone, txnid } = req.body;

  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  res.json({ hash });
});

module.exports = router;
