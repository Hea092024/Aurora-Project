
async function fetchLocationData() {
    try {
        const fetchLocationURL = await fetch("https://api.auroras.live/v1/?type=locations");
        if(!fetchLocationURL.ok){
            throw new Error("could not fetch resource")
        }
        const resLocation = await fetchLocationURL.json()
        console.log(resLocation);
        return resLocation

    } catch (error) {
        throw error(error)
    }   
};
const locationData = await fetchLocationData();









function getLength(obj) {   
    var i = 0;
    for (var x in obj){
        if(obj.hasOwnProperty(x)){
            i++;

        }
    }
    return i;
}
getLength(locationData);

const selectLocationList = document.getElementById("location-list");

function createLocationList() {
    let iLength = getLength(locationData)
      for (let i = 0; i < iLength-1; i++) {
            let locationCountry = document.createElement("option")
            let _id = locationData[i].name;
            let _country = locationData[i].country;

            //denne koden fjerner "spaces", vet den ser litt rar ut :)
            _id = _id.replace(/\s/g, '');
            _country = _country.replace(/\s/g, '');

            locationCountry.text = _id + ", " + _country
            selectLocationList.appendChild(locationCountry);

            console.log(locationCountry);
    }   
}
createLocationList();


