const locationURL = "https://api.auroras.live/v1/?type=locations";
let locationList = document.getElementById("location-list");
// console.log(locationURL);


async function fetchLocationList(){
    try {
        const resLocation = await fetch(locationURL);
        if(!resLocation.ok){
            throw new Error("Could not fetch resource")
        }
        const locationList = await resLocation.json();
        console.log(locationList);


        
    } catch (error) {
        console.error(error);
        
    }
}
fetchLocationList()

