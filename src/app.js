document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('converter-form');
	const resultDiv = document.getElementById('result');

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
			let rate =1;
			let date = new Date().toISOString().slice(0, 10);
			let converted = amount;
			if (fromCurrency !== toCurrency) {
				try {
					const data = await  convert(fromCurrency, toCurrency, amount);
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
function convert(from, to, amount) {
  fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`)
    .then((resp) => resp.json())
    .then((data) => {
      const convertedAmount = (amount * data.rates[to]).toFixed(2);
      return(`${amount} ${from} = ${convertedAmount} ${to}`);
    });
  }
