const API_BASE = "https://api.auroras.live/v1/";

// DOM Elements
const locationSelect = document.getElementById("location-list");
const fetchBtn = document.getElementById("fetch-btn");
const resultsSection = document.getElementById("results-section");
const coordinatesEl = document.getElementById("coordinates");
const kpValueEl = document.getElementById("kp-value");
const kpStatusEl = document.getElementById("kp-status");
const kpFillEl = document.getElementById("kp-fill");
const forecastList = document.getElementById("forecast-list");
const infoToggle = document.getElementById("info-toggle");
const infoSection = document.getElementById("info-section");

// Kp to latitude mapping for aurora likelihood
const kpLatitudeThresholds = [
  66, 64.5, 62.4, 60.4, 58.3, 56.3, 54.2, 52.2, 50.1, 48,
];

// Fetch utility
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response failed");
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// Populate location dropdown
async function initializeLocations() {
  const locations = await fetchData(`${API_BASE}?type=locations`);

  if (!locations) {
    locationSelect.innerHTML =
      '<option value="" disabled>Failed to load locations</option>';
    return;
  }

  Object.values(locations).forEach((location) => {
    const option = document.createElement("option");
    option.textContent = location.description;
    option.value = `${location.lat},${location.long}`;
    locationSelect.appendChild(option);
  });
}

// Determine aurora likelihood
function getAuroraLikelihood(kpValue, latitude) {
  const roundedKp = Math.round(kpValue);
  const maxLatitude = kpLatitudeThresholds[Math.min(roundedKp, 9)];
  return latitude >= maxLatitude;
}

// Get Kp level classification
function getKpLevel(kp) {
  if (kp <= 2) return { class: "quiet", text: "Quiet" };
  if (kp <= 4) return { class: "active", text: "Active" };
  if (kp <= 6) return { class: "storm", text: "Storm" };
  return { class: "severe", text: "Severe Storm" };
}

// Get status text based on Kp and latitude
function getStatusText(kp, latitude) {
  const isLikely = getAuroraLikelihood(kp, latitude);
  const level = getKpLevel(kp);

  if (isLikely) {
    return `${level.text} — Aurora likely at your location`;
  }
  return `${level.text} — Aurora unlikely at this latitude`;
}

// Update Kp meter visualization
function updateKpMeter(kp) {
  const percentage = Math.min((kp / 9) * 100, 100);
  kpFillEl.style.width = `${percentage}%`;
}

// Render forecast list
function renderForecast(forecastData, latitude) {
  forecastList.innerHTML = "";

  if (!forecastData || !forecastData.length) {
    forecastList.innerHTML = "<li>No forecast data available</li>";
    return;
  }

  forecastData.forEach((item, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const dateStr = date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    const kp = parseFloat(item.value);
    const level = getKpLevel(kp);
    const isLikely = getAuroraLikelihood(kp, latitude);

    const li = document.createElement("li");
    li.innerHTML = `
      <span class="date">${dateStr}</span>
      <span class="kp ${level.class}">Kp ${kp.toFixed(1)}</span>
      <span class="likelihood">${isLikely ? "Aurora likely" : "Unlikely"}</span>
    `;
    forecastList.appendChild(li);
  });
}

// Main fetch function
async function fetchAuroraData() {
  const selectedValue = locationSelect.value;

  if (!selectedValue) {
    alert("Please select a location first");
    return;
  }

  const [lat, long] = selectedValue.split(",").map(Number);

  // Set loading state
  fetchBtn.disabled = true;
  fetchBtn.classList.add("loading");

  try {
    // Fetch current and 3-day forecast
    const [currentData, forecastData] = await Promise.all([
      fetchData(
        `${API_BASE}?type=all&lat=${lat}&long=${long}&forecast=false&threeday=false`
      ),
      fetchData(
        `${API_BASE}?type=all&lat=${lat}&long=${long}&forecast=false&threeday=true`
      ),
    ]);

    // Update coordinates
    coordinatesEl.textContent = `Latitude ${lat.toFixed(
      2
    )}°, Longitude ${long.toFixed(2)}°`;

    // Update Kp display
    const currentKp = currentData?.ace?.kp;

    if (currentKp !== undefined) {
      const kpNum = parseFloat(currentKp);
      kpValueEl.textContent = kpNum.toFixed(1);
      kpStatusEl.textContent = getStatusText(kpNum, lat);
      updateKpMeter(kpNum);
    } else {
      kpValueEl.textContent = "—";
      kpStatusEl.textContent = "Data unavailable";
      updateKpMeter(0);
    }

    // Update forecast
    const forecastValues = forecastData?.threeday?.values?.[0];
    renderForecast(forecastValues, lat);

    // Show results
    resultsSection.classList.add("visible");

    // Update button text
    fetchBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M23 4v6h-6M1 20v-6h6"></path>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
      </svg>
      <span>Refresh Data</span>
    `;
  } catch (error) {
    console.error("Error fetching aurora data:", error);
    kpStatusEl.textContent = "Failed to fetch data";
  } finally {
    fetchBtn.disabled = false;
    fetchBtn.classList.remove("loading");
  }
}

// Toggle info section
function toggleInfo() {
  const isVisible = infoSection.classList.contains("visible");
  infoSection.classList.toggle("visible");

  infoToggle.querySelector("span").textContent = isVisible
    ? "Kp Index Guide"
    : "Hide Guide";
}

// Event listeners
fetchBtn.addEventListener("click", fetchAuroraData);
infoToggle.addEventListener("click", toggleInfo);

locationSelect.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    fetchAuroraData();
  }
});

// Initialize
initializeLocations();
