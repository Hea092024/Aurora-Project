const locationURL = "https://api.auroras.live/v1/?type=locations";
// // let locationList = document.getElementById("location-list");
// // console.log(locationURL);

// async function fetchLocationList() {
//   try {
//     const resLocation = await fetch(locationURL);
//     if (!resLocation.ok) {
//       throw new Error("Could not fetch resource");
//     }
//     const locationList = await resLocation.json();
//     console.log(locationList);
//     console.log(locationList[0].country);
//     return locationList;
//   } catch (error) {
//     console.error(error);
//   }
// }

// const testlist = await fetchLocationList();

// console.log(testlist);

// for (let i = 0; i < testlist.length; i++) {
//   console.log(i);
//   console.log(testlist[i].country);
// }

// const locationURL = await fetch("https://api.auroras.live/v1/?type=locations");
// const resLocation = await locationURL.json();
// console.log(resLocation);

// const locationList = document.getElementById("location-list");

// async function createLocationList() {
//   let countryList = document.createElement("option");
// }

// for (let i = 0; i < resLocation.length; i++) {
//   console.log(i);
//   console.log(resLocation[i].country);
// }

// createLocationList();


async function fetchLocationURL() {
  try {
    const resLocationURL = await fetch(locationURL);
    if (!resLocationURL.ok) {
      throw new Error("Could not fetch resource");
    }
    const locationList = await resLocationURL.json();
    return locationList;
  } catch (error) {
    console.error(error);
  }
}
const testlist = await fetchLocationURL();

console.log(testlist);

for (let i = 0; i < testlist.length; i++) {
   console.log(testlist[i].country);
   
    
}
