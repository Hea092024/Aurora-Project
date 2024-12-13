async function fetchLocationData() {
    try {
        const fetchLocationURL = await fetch("https://api.auroras.live/v1/?type=locations");
        if(!fetchLocationURL.ok){
            throw new Error("could not fetch resource")
        }
        const res = await fetchLocationURL.json()
        console.log(res);
        return res
    } catch (error) {
        throw Error(error)
    }   
};
const locationData = await fetchLocationData();



const selectLocationList = document.getElementById("location-list");

function createLocationList() {
      for (let i = 0; i < Object.keys(locationData).length -1; i++) {
            const option = document.createElement("option")
            option.textContent = `${locationData[i].description}`

            option.value = `&lat=${locationData[i].lat}&long=${locationData[i].long}`;
            selectLocationList.appendChild(option);
            
}}
createLocationList();



const menu = document.getElementById("location-list")
const btn = document.getElementById("test")



async function fetchKpFromOption() {
    try { 
    console.log(menu.value)
    // const kpFromOption = await fetch(`https://api.auroras.live/v1/?type=ace&data=kp${menu.value}&threeday=true`)
    const kpFromOption = await fetch(`https://api.auroras.live/v1/?type=ace&data=threeday&${menu.value}`)
    if(!kpFromOption.ok){
        throw new Error("could not fetch resource")
    }
    const response = kpFromOption.json()
    return response;
    } catch (error) {
        throw Error(error)
    } 
}



const kp = document.getElementById("kp-verdier-24")

function createKpList(kpFromOptionData, latValue){
    for (let i = 0; i < 8; i++) {
        const kpVerdi24 = document.createElement("li")
        const likelyAurora = IsAuroraLikely(kpFromOptionData.values[0][i].value, latValue);
        kpVerdi24.textContent = `${new Date().toLocaleDateString() + " Kp value is: " +kpFromOptionData.values[0][i].value}: ${likelyAurora}`
        kp.appendChild(kpVerdi24);
         
    }
}

const kpValueToMaxLatGradeArray = [
  66, 64.5, 62.4, 60.4, 58.3, 56.3, 54.2, 52.2, 50.1, 48,
];

function IsAuroraLikely(kpValue, latitude) {
  const roundedkpValue = Math.round(kpValue);
  const maxLatitudeForKpValue = kpValueToMaxLatGradeArray[roundedkpValue];
  if (latitude > maxLatitudeForKpValue) {
    return "Likely aurora";
  } else return "Aurora unlikely";
}




btn.addEventListener("click", async()=>{
    const kpFromOptionData = await fetchKpFromOption();
    const latValue = Number.parseFloat(menu.value.split("&")[1].split("=")[1]);
    console.log(latValue);
    kp.replaceChildren()
    createKpList(kpFromOptionData, latValue);
})


// menu.addEventListener("keydown", (e) => {
//     if(e.key === "Enter"){
//         document.getElementById("test").click()    
//     }
// })