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
    const kpFromOption = await fetch(`https://api.auroras.live/v1/?type=all${menu.value}&forecast=false&threeday=true`)
    if(!kpFromOption.ok){
        throw new Error("could not fetch resource")
    }
    const response = kpFromOption.json()
    return response;
    } catch (error) {
        throw Error(error)
    } 
}
const kpFromOptionData = await fetchKpFromOption();



console.log(kpFromOptionData);
const kp = document.getElementById("kp-verdier-24")

function createKpList(){
    for (let i = 0; i < Object.keys(kpFromOptionData).length; i++) {
        const kpVerdi24 = document.createElement("li")
        kpVerdi24.textContent = `${new Date().toLocaleDateString() + " Kp value is: " +kpFromOptionData.threeday.values[0][i].value}`
        kp.appendChild(kpVerdi24)
        console.log(kpVerdi24);
      
    }
}



btn.addEventListener("click", ()=>{
    createKpList();
})


menu.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        document.getElementById("test").click()    
    }
})