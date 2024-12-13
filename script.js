const selectLocationList = document.getElementById("location-list");
const btn = document.getElementById("test");
const locationInfo = document.getElementById("location-info");
const coordinates = document.getElementById("coordinates");
const auroraStatus = document.getElementById("aurora-status");
const kpList = document.getElementById("kp-verdier-24");
const kpVerdier = document.getElementById("kp-verdier");

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
};

const fetchLocationData = async () => {
  try {
    const response = await fetch("https://api.auroras.live/v1/?type=locations");
    if (!response.ok) {
      throw new Error("Could not fetch location data");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const createLocationList = async () => {
  const locationData = await fetchLocationData();
  if (locationData) {
    Object.values(locationData).forEach((location) => {
      const option = document.createElement("option");
      option.textContent = location.description;
      option.value = `${location.lat},${location.long}`;
      selectLocationList.appendChild(option);
    });
  }
};

const fetchKpFromOption = async (lat, long) => {
  try {
    const response = await fetch(
      `https://api.auroras.live/v1/?type=all&lat=${lat}&long=${long}&forecast=false&threeday=true`
    );
    if (!response.ok) {
      throw new Error("Could not fetch Kp data");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const kpValueToMaxLatGradeArray = [
  66, 64.5, 62.4, 60.4, 58.3, 56.3, 54.2, 52.2, 50.1, 48,
];

function IsAuroraLikely(kpValue, latitude) {
  const roundedkpValue = Math.round(kpValue);
  const maxLatitudeForKpValue = kpValueToMaxLatGradeArray[roundedkpValue];
  return latitude > maxLatitudeForKpValue ? "Likely aurora" : "Aurora unlikely";
}

const createKpList = (kpData, latitude) => {
  
  kpList.textContent = "";

  kpData.forEach((data) => {
    const li = document.createElement("li");
    const likelyAurora = IsAuroraLikely(data.value, latitude);
    li.textContent = `${new Date().toLocaleDateString()} Kp value is: ${
      data.value
    }: ${likelyAurora}`;
    kpList.appendChild(li);
  });
};

btn.addEventListener("click", async () => {
  const [lat, long] = selectLocationList.value.split(",");
  if (lat && long) {
    const auroraData = await fetchData(
      `https://api.auroras.live/v1/?type=all&lat=${lat}&long=${long}&forecast=false&threeday=false`
    );
    coordinates.textContent = `Coordinates: Latitude ${lat}, Longitude ${long}`;
    auroraStatus.textContent = `Aurora Activity (KP Index): ${
      auroraData?.ace?.kp || "Data unavailable"
    }`;

    const kpData = await fetchKpFromOption(lat, long);
    if (kpData) {
      createKpList(kpData.threeday.values[0], lat);
    }

  
    locationInfo.style.display =
      locationInfo.style.display === "block" ? "none" : "block";
    kpVerdier.style.display =
      kpVerdier.style.display === "block" ? "none" : "block";
    kpList.style.display = kpList.style.display === "block" ? "none" : "block";

    
    btn.textContent =
      locationInfo.style.display === "block"
        ? "Hide Aurora Data"
        : "Fetch Aurora Data";
  }
});

document.getElementById("toggle-button").addEventListener("click", function () {
  const auroraInfo = document.getElementById("aurora-info");
  const button = document.getElementById("toggle-button");

  if (auroraInfo.style.display === "none" || auroraInfo.style.display === "") {
    auroraInfo.style.display = "block";
    button.textContent = "Hide Aurora Info";
  } else {
    auroraInfo.style.display = "none";
    button.textContent = "Show Aurora Info";
  }
});

createLocationList();
