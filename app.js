const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

let getWeatherData = async (query) => {
    const apiKey = process.env.API_KEY;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=metric";
    try {
        const response = await fetch(url);
        const weatherData = await response.json();
        console.log(weatherData);
        return weatherData;
    } catch (err) {
        return undefined;
    }
};
let prevWeatherData;

app.get("/", async (req, res) => {
    try {
        const weatherData = await getWeatherData("Agartala");
        const { description, icon } = weatherData.weather[0];
        const { temp, pressure, humidity } = weatherData.main;
        const { speed } = weatherData.wind;
        res.render("home", {
            city: "Agartala",
            description: description,
            icon: icon,
            temp: temp,
            pressure: pressure,
            humidity: humidity,
            wind: speed,
            err: null,
        });
        prevWeatherData = weatherData;
    } catch (err) {
        res.send(err.message);
    }
});
app.post("/", async (req, res) => {
    try {
        const weatherData = await getWeatherData(req.body.cityName);
        const { description, icon } = weatherData.weather[0];
        const { temp, pressure, humidity } = weatherData.main;
        const { speed } = weatherData.wind;
        res.render("home", {
            city: weatherData.name,
            description: description,
            icon: icon,
            temp: temp,
            pressure: pressure,
            humidity: humidity,
            wind: speed,
            err: null,
        });
        prevWeatherData = weatherData;
    } catch (err) {
        // res.send(err.message);
        const { description, icon } = prevWeatherData.weather[0];
        const { temp, pressure, humidity } = prevWeatherData.main;
        const { speed } = prevWeatherData.wind;
        res.render("home", {
            city: prevWeatherData.name,
            description: description,
            icon: icon,
            temp: temp,
            pressure: pressure,
            humidity: humidity,
            wind: speed,
            err: req.body.cityName,
        });
    }
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at localhost:${port}`);
});
