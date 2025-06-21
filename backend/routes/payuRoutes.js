const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || 'gtKFFx';
const SALT = process.env.PAYU_MERCHANT_SALT || '4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW';

router.post('/payu-hash', (req, res) => {
  const {
    amount,
    productinfo,
    firstname,
    email,
    txnid
  } = req.body;

  // ✅ Correct format with udf1 to udf10 explicitly added
  const hashString = `${MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|` +
                     `|||||||||||${SALT}`;

  // ✅ Now generate the SHA512 hash correctly
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  res.json({ hash });
});

module.exports = router;
