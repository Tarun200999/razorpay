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

	async function displayRazorpay() {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}

		const data = await fetch(
			'https://modcrew-dev.herokuapp.com/api/v1/orders/612e2edce39ff100162ee54e/pay',
			{
				method: 'POST',
				headers: {
					Authorization:
						'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMGQ3MGE3YWFhZDY1NWU4YzhiMzk1ZSIsImlhdCI6MTYzMDI2MDU0NywiZXhwIjoxNjMwODY1MzQ3fQ.AJXIqg4OgZJQ5P56VAslbmrjQZ4cm-AjY_ZSR1Ex6L8'
				}
			}
		).then((t) => t.json())

		console.log(data)

		const options = {
			key: __DEV__ ? 'rzp_test_5bt00IcxhJIvJ3' : 'PRODUCTION_KEY',
			currency: data.data.currency,
			amount: data.data.amount.toString(),
			order_id: data.data.id,
			name: 'Donation',
			description: 'Thank you for nothing. Please give us some money',
			prefill: {
				name,
				email: 'text@example.com',
				phone_number: '9899999999'
			}
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
	}

	return (
		<div className='App'>
			<header className='App-header'>
				<img src={logo} className='App-logo' alt='logo' />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<button className='App-link' onClick={displayRazorpay}>
					PAY NOW
				</button>
			</header>
		</div>
	)
}

export default App
