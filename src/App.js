import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

const __DEV__ = document.domain === 'localhost'

function App() {
  const [name] = useState('Snehangshu')

  const [data, setData] = useState({
    response: {
      id: 'order_HwcQ9LngYDs3NC',
      entity: 'order',
      amount: 100000,
      amount_paid: 0,
      amount_due: 100000,
      currency: 'INR',
      receipt: 'x-PYo9OnP',
      offer_id: null,
      status: 'created',
      attempts: 0,
      notes: {
        desc: 'Request of employe details from 6 for employee 9891',
      },
      created_at: 1631463904,
    },
    verifier_zynk_id: '6',
    employer_zynk_id: '4',
    employee_full_name: 'Kylo Apps',
    employee_id: '9891',
    aadhar_number: '123456',
    pan_number: '123456',
    employee_email_id: 'testing@gmail.com',
    employee_phone: '9891000000',
    internal_reference: 'Testing',
    request_type: 'I',
    salary_range: 1,
    verification_reason: 'Loan',
    verifying_employer: 'XYZ',
  })

  async function displayRazorpay() {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?')
      return
    }

    const data = await fetch(
      'https://c5e3-2402-3a80-1b0f-6efc-26f4-60e9-3075-552c.ngrok.io/api/v1/orders/613f4098eebf7247736893a6/pay',
      {
        method: 'POST',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzliZDQxOGI2ODkzMGZhMDNlOGIyNCIsImlhdCI6MTYzMTUzNDkwNywiZXhwIjoxNjMyMTM5NzA3fQ.dHXi7JtsHH8QidBSQtMYpG28G5gp5cPlGjR9uxyn-_w',
        },
      }
    ).then((t) => t.json())

    console.log('Data', data)

    console.log(data)

    const options = {
      key: 'rzp_test_k2yCzup0pdGZjg',
      currency: data.data.currency,
      amount: data.data.amount.toString(),
      order_id: data.data.id,
      name: 'Donation',
      description: 'Thank you for nothing. Please give us some money',
      handler: async function (response) {
        console.log('response of razorPay ', response)
        const datatoserver = {
          orderCreationId: data.response.id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          verifier_zynk_id: data.verifier_zynk_id,
          employer_zynk_id: data.employee_full_name,
          employee_full_name: data.employee_full_name,
          employee_id: data.employee_id,
          aadhar_number: data.aadhar_number,
          pan_number: data.pan_number,
          employee_email_id: data.employee_email_id,
          employee_phone: data.employee_phone,
          internal_reference: data.internal_reference,
          request_type: data.request_type,
          salary_range: data.salary_range,
          verification_reason: data.verification_reason,
          verifying_employer: data.verifying_employer,
        }

        const result = await fetch(
          'http://localhost:2811/purchase-new-verification',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datatoserver),
          }
        )
          .then((resp) => {
            return resp.json()
          })
          .catch((err) => console.log(err))
        console.log(result)
      },
      prefill: {
        name,
        email: 'text@example.com',
        phone_number: '9899999999',
      },
    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button className="App-link" onClick={displayRazorpay}>
          PAY NOW
        </button>
      </header>
    </div>
  )
}

export default App
