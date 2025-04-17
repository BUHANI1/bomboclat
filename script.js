const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const amountInput = document.getElementById("amount");
const resultDisplay = document.getElementById("result");
const convertBtn = document.getElementById("convertBtn");
const themeSelect = document.getElementById("themeSelect");
const contactBtn = document.getElementById("contactBtn");
const contactNumber = document.getElementById("contactNumber");

const showPricesBtn = document.getElementById("showPricesBtn");
const livePricesSection = document.getElementById("livePricesSection");
const pricesList = document.getElementById("pricesList");

// List of cryptocurrencies
const currencies = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "ripple", name: "Ripple", symbol: "XRP" },
  { id: "litecoin", name: "Litecoin", symbol: "LTC" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "tron", name: "TRON", symbol: "TRX" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
  { id: "binancecoin", name: "BNB", symbol: "BNB" }
];

// Load currencies into dropdowns
function loadCurrencies() {
  currencies.forEach((coin) => {
    const option1 = document.createElement("option");
    option1.value = coin.id;
    option1.textContent = `${coin.name} (${coin.symbol})`;
    fromSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = coin.id;
    option2.textContent = `${coin.name} (${coin.symbol})`;
    toSelect.appendChild(option2);
  });

  fromSelect.value = "bitcoin";
  toSelect.value = "ethereum";
}

// Convert currencies
async function convertCurrency() {
  const from = fromSelect.value;
  const to = toSelect.value;
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    resultDisplay.innerText = "Please enter a valid amount.";
    return;
  }

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${from},${to}&vs_currencies=usd`);
    const data = await res.json();

    const fromToUSD = data[from]?.usd;
    const toToUSD = data[to]?.usd;

    if (!fromToUSD || !toToUSD) {
      resultDisplay.innerText = "Conversion rate not available.";
      return;
    }

    const amountInUSD = amount * fromToUSD;
    const result = amountInUSD / toToUSD;

    resultDisplay.innerText = `Converted Amount: ${result.toFixed(6)} ${to.toUpperCase()}`;
  } catch (error) {
    resultDisplay.innerText = "Error during conversion.";
    console.error(error);
  }
}

// Change theme
themeSelect.addEventListener("change", () => {
  const theme = themeSelect.value;
  document.body.className = theme === "dark" ? "dark-mode" : "light-mode";
});

// Show/hide contact number
contactBtn.addEventListener("click", () => {
  contactNumber.classList.toggle("hidden");
});

// Show live prices
showPricesBtn.addEventListener("click", async () => {
  if (livePricesSection.classList.contains("hidden")) {
    livePricesSection.classList.remove("hidden");
    showPricesBtn.innerText = "📉 Hide Prices Now";
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${currencies.map(coin => coin.id).join(",")}&vs_currencies=usd`);
      const data = await res.json();
      pricesList.innerHTML = ""; // Clear previous list

      currencies.forEach((coin) => {
        const price = data[coin.id]?.usd;
        if (price) {
          const item = document.createElement("li");
          item.textContent = `${coin.name}: $${price.toLocaleString()}`;
          pricesList.appendChild(item);
        }
      });
    } catch (error) {
      pricesList.innerHTML = "<li>There was an error loading the prices.</li>";
      console.error(error);
    }
  } else {
    livePricesSection.classList.add("hidden");
    showPricesBtn.innerText = "📊 Show Live Prices";
  }
});

// Load currencies on page load
loadCurrencies();

// Execute conversion on "Convert" button click
convertBtn.addEventListener("click", convertCurrency);
