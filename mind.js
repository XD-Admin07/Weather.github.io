const town=document.querySelector("[city]");
const tempe=document.querySelector("[tem]");
const place=document.querySelector("input")
const sub=document.querySelector("#but");

const API_KEY="94eb8fc06f656df3dedfa8011b2de035";


async function API(){
    console.log(place.value);
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place.value}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        
        renderWeather(data);
    }
    
    catch(err){
        console.log("Not a valid city name");
        town.innerText="Not a valid city name";
    }
    
}


function renderWeather(info){
    town.innerText=info.name;
    tempe.innerText=info.main.temp;
}

sub.addEventListener("click",API);