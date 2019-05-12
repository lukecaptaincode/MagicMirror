import * as $ from "jquery";

/**
 * Controls the logic for the weather widget
 * @class WeatherWidget
 */
class WeatherWidget {
    /**
     * Checks whether the last weather update was more than a half an hour ago and
     * returns true if it is;
     * @return boolean
     */
    public static isLastWeatherPullStale(): boolean {
        const now = new Date();
        const lastUpdate = localStorage.getItem("LastWeatherUpdate");
        global.console.log("Has 30 min passed: " + ((Number(now) - Number(lastUpdate)) > (60 * 60 * 1000)));
        return ((Number(now) - Number(lastUpdate)) > (60 * 60 * 1000));
    }

    /**
     * store weather data in local storage
     * @param weatherData
     */
    private static storePulledData(weatherData: any) {
        localStorage.setItem("WeatherData", JSON.stringify(weatherData));
    }

    private dublinRequest: string = "http://dataservice.accuweather.com/currentconditions/v1/207931?apikey=";
    private weatherIconUrlBase: string = "https://developer.accuweather.com/sites/default/files/";

    /**
     * Get weather data from Accuweather
     */
    public getWeatherDataFromApi() {
        global.console.log("Weather api pull");
        let weather = "errWeather"; // just in case of opps
        $.ajax({
            async: false,
            success: (data: any) => {
                global.console.log(data);
                weather = data;
                WeatherWidget.storePulledData(data);
            },
            type: "get",
            url: this.dublinRequest + this.getWeatherApiKey(),
        });
        return this.formatWeatherData(weather);
    }

    /**
     * Gets the weather data from storage if weather data is set
     */
    public getWeatherDataFromStorage() {
        if (localStorage.getItem("WeatherData") != null) {
            global.console.log("Data from storage");
            return this.formatWeatherData(JSON.parse(localStorage.getItem("WeatherData")));
        } else {
            return this.getWeatherDataFromApi();
        }
    }


    /**
     * Gets api from python server
     */
    private getWeatherApiKey(): string {
        let key = "errKey"; // just in case of opps
        $.ajax({
            async: false,
            success: (data: any) => {
                global.console.log(data);
                key = data;
            },
            type: "get",
            url: "http://0.0.0.0:5000/weatherapikey",
        });
        return key;
    }

    /**
     * formats the passed weather data a returns a formatted object
     * @param weatherData
     */
    private formatWeatherData(weatherData: any): object {
        const weatherDataObject: any = {};
        const iconKeyBase = Number(weatherData[0].WeatherIcon);
        const iconKey = iconKeyBase < 10 ? "0" + iconKeyBase : iconKeyBase;
        // Populate object
        weatherDataObject.iconURl = this.weatherIconUrlBase + iconKey + "-s.png";
        weatherDataObject.weatherText = weatherData[0].WeatherText;
        weatherDataObject.temperature = weatherData[0].Temperature.Metric.Value;
        weatherDataObject.pecipitation = weatherData[0].HasPrecipitation;
        return weatherDataObject;
    }
}

export {WeatherWidget};
