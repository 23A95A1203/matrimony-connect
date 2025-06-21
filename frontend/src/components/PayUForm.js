import React, { useState } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";

const PayUForm = () => {
  const [form, setForm] = useState({
    amount: "1000.00",
    firstname: "Ravi",
    email: "ravi@example.com",
    phone: "9999999999",
    productinfo: "Premium Membership",
  });

  const key = "gtKFFx";
  const salt = "eCwWELxi";
  const txnid = uuid().substring(0, 20);

  const [hash, setHash] = useState("");

  const getHash = async () => {
    const res = await axios.post("http://localhost:5000/api/payment/generate-hash", {
      ...form,
      key,
      salt,
      txnid,
    });
    setHash(res.data.hash);
    document.forms.payuForm.submit(); // auto-submit
  };

  return (
    <form name="payuForm" method="post" action="https://test.payu.in/_payment">
      <input type="hidden" name="key" value={key} />
      <input type="hidden" name="txnid" value={txnid} />
      <input type="hidden" name="amount" value={form.amount} />
      <input type="hidden" name="productinfo" value={form.productinfo} />
      <input type="hidden" name="firstname" value={form.firstname} />
      <input type="hidden" name="email" value={form.email} />
      <input type="hidden" name="phone" value={form.phone} />
      <input type="hidden" name="surl" value="http://localhost:3000/payment-success" />
      <input type="hidden" name="furl" value="http://localhost:3000/payment-fail" />
      <input type="hidden" name="hash" value={hash} />

      <button type="button" onClick={getHash}>
        Pay with PayU
      </button>
    </form>
  );
};

export default PayUForm;
