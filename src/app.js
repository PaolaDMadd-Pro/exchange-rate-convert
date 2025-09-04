document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('converter-form');
	const resultDiv = document.getElementById('result');

	// Coin denominations and names for each currency
	const coins = {
		USD: [25, 10, 5, 1],
		GBP: [200, 100, 50, 20, 10, 5, 2, 1],
		EUR: [200, 100, 50, 20, 10, 5, 2, 1]
	};
	const coinNames = {
		USD: ['Quarter (25¢)', 'Dime (10¢)', 'Nickel (5¢)', 'Penny (1¢)'],
		GBP: ['£2', '£1', '50p', '20p', '10p', '5p', '2p', '1p'],
		EUR: ['€2', '€1', '50c', '20c', '10c', '5c', '2c', '1c']
	};

	form.addEventListener('submit', async function (e) {
		e.preventDefault();
		const fromCurrency = document.getElementById('currency').value;
		const toCurrency = document.getElementById('convert-to').value;
		const amount = parseFloat(document.getElementById('amount').value);
		if (isNaN(amount) || amount < 0) {
			resultDiv.textContent = 'Please enter a valid amount.';
			return;
		}

			// Fetch conversion rate using Frankfurter API
			let rate = 1;
			let date = new Date().toISOString().slice(0, 10);
			let converted = amount;
			if (fromCurrency !== toCurrency) {
				try {
					const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
					const data = await res.json();
					rate = data.rates[toCurrency] / amount;
					converted = data.rates[toCurrency];
					date = data.date;
				} catch {
					resultDiv.textContent = 'Error fetching exchange rate.';
					return;
				}
			}

			// Output
			let output = `<strong>Converted Amount:</strong> ${converted.toFixed(2)} ${toCurrency}<br>`;
			output += `<strong>Exchange Rate (${fromCurrency} → ${toCurrency}):</strong> ${rate.toFixed(4)}<br>`;
			output += `<strong>Date:</strong> ${date}<br>`;
			resultDiv.innerHTML = output;
	});
});
