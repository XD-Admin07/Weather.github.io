const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const error=document.querySelector(".not_found");
const error_cor =document.querySelector(".not_found_cor");

//initially variables nee??

let currentTab=userTab;
const API_KEY ="94eb8fc06f656df3dedfa8011b2de035";
currentTab.classList.add("current-tab");
getfromSessionStorage();
//ek kaam or pending hai??

function switchTab(clickedTab){
    if(clickedTab!=currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        { // kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");

        }
        else{
            // main phle search wale tab pr tha, ab  your weather tab visible karna hai

            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab main your weather tab me aagya hu, toh wather bhi display karna pdega, so let's check local storage first 
            // for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>
{
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage 
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        // agar local coordinates nhi mile
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);

    }
}



async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}=coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    

    // API CALL
    try{
         
        const response=await fetch(
           `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
         if (!response.ok) {
        throw new Error('coordinates not found');
      }
       
       const data=await response.json();
      // grantAccessContainer.classList.remove("active")
       loadingScreen.classList.remove("active");
       
       userInfoContainer.classList.add("active");
       renderWeatherInfo(data);
    }
    catch(err){
       loadingScreen.classList.remove("active");
        error_cor.classList.add("not_found_cor");
       //HW
    }
}

function renderWeatherInfo(weatherInfo)
{
    //firstly, we have to fetch the elements

    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    //fetch values from weatherInfo object and put it UI elements
      
    cityName.innerText=weatherInfo?.name;
    countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}°C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    else
    {
       //Hw - show an alert fo no gelolocation support available
    }
}

function showPosition(position){
    const userCoordinates={
        
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

/*searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searInput.value==="") return;

    fetchSearchWeatherInfo(searchInput.value);
});*/

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName==="")
    return;
    
    else
    fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{

      const response = await fetch(
         `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
         
      );
        if (!response.ok) {
        throw new Error('City not found');
      }

      const data= await response.json();
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    }catch(err)
    {
        //hW
         loadingScreen.classList.remove("active");
        error.classList.add("active");
        console.error(err);
        console.log("nhi aa rha bhay city");
       
    }
}

