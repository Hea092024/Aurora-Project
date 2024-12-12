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

btn.addEventListener("click", ()=>{
    console.log(menu.value)
})



console.log(`http://api.auroras.live/v1/?type=all${menu.value}&forecast=false&threeday=false`);



async function createUrlFromOption() {
    

}