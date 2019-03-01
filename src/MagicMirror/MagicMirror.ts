import {CronJob} from "cron";
import {PythonShell} from "python-shell";
import {NewsWidget} from "./NewsWidget";
import {WeatherWidget} from "./WeatherWidget";

/**
 * contains all the main function for the magic mirror
 * interfaces with the other class functions
 * @class MagicMirror
 */
class MagicMirror {
    /**
     * Connects to the Python server
     */
    public connectToPythonServer() {
        // Call the script that starts the python server
        PythonShell.run("python/server.py", null, (err: any, results: any) => {
            if (err) {
                global.console.log(err);
                return false;
            } else {
                global.console.log("Connected");
                return true;
            }
        });
    }

    /**
     * Takes in clock element and updates the time every second
     * @param clockElement
     */
    public displayClock(clockElement: HTMLElement) {
        setInterval(() => {
            const today = new Date();
            const hours = today.getHours();
            const minutes = today.getMinutes();
            const seconds = today.getSeconds();
            clockElement.innerHTML =
                (hours < 10 ? "0" + hours : hours)
                + ":"
                + (minutes < 10 ? "0" + minutes : minutes)
                + ":"
                + (seconds < 10 ? "0" + seconds : seconds);
        }, 1000);
    }

    /*
     *Gets the weather data from local storage and starts the weather
     * update cron job
     */
    public getWeather(weatherWidgetElement: HTMLElement) {
        const weatherWidget = new WeatherWidget();
        this.displayWeatherData(weatherWidget.getWeatherDataFromStorage(), weatherWidgetElement);
        this.updateWeather(weatherWidget, weatherWidgetElement);
    }

    public getNews(newsWidgetElement: HTMLElement) {
        const newsapi = new NewsWidget();
        this.displayNewsData(newsapi.getNews(), newsWidgetElement);
    }

    /**
     * Create a cron job fire every 10 minutes. The cron job updates
     * the weather widget and pulls new data if the weather data is
     * older than a half an hour. If it hasn't been longer than a half
     * an hour, pull the data from storage -
     * OBSERVE HOW I CAST A DATE TO NUMBER FORMAT AND THAT NUMBER TO A STRING
     * TRULY WE HAVE ENTERED THE REALM OF MADNESS
     */
    private updateWeather(weatherWidget: WeatherWidget, widget: HTMLElement) {
        global.console.log("Starting weather cron job");
        const now = new Date();
        const job = new CronJob("0 */10 * * * *", () => {
            const isStale = WeatherWidget.isLastWeatherPullStale();
            if (isStale) {
                // Get from Accuweather
                global.console.log("Pulling from Accuweather");
                this.displayWeatherData(weatherWidget.getWeatherDataFromApi(), widget);
                localStorage.setItem("LastWeatherUpdate", Number(now).toString());
            } else {
                if (localStorage.getItem("LastWeatherUpdate") === "0") {
                    // Get from Accuweather
                    global.console.log("First ever weather pull");
                    this.displayWeatherData(weatherWidget.getWeatherDataFromApi(), widget);
                    localStorage.setItem("LastWeatherUpdate", Number(now).toString());
                }
                // Get from storage
                this.displayWeatherData(weatherWidget.getWeatherDataFromStorage(), widget);
                global.console.log("Pulling weather info from storage");
            }
        });
        job.start();
    }

    /**
     * Handles the displaying of data to passed HtmlElement by
     * setting html from the passed weather data
     * @param data
     * @param widget
     */
    private displayWeatherData(data: any, widget: HTMLElement) {
        widget.innerHTML = "<h1>Weather - Dublin</h1>" +
            "<p>" + data.weatherText + "</p>" +
            "<p>Temperature: " + data.temperature + "c</p>" +
            "<p>Raining: " + data.pecipitation + "</p>" +
            "<img src='" + data.iconURl + "'/>";
    }

    /**
     * Handles the displaying of news data the passed HTMLElement
     * by setting the html using the passed news data
     * @param data
     * @param widget
     */
    private displayNewsData(data: any, widget: HTMLElement) {
        global.console.log(data);
        for (let i = 0; i < data.articles.length; i++) {
            widget.innerHTML += "<hr><h4>" + data.articles[i].title + "</h4>";
            widget.innerHTML += "<p>" + data.articles[i].description + "</p>";
            widget.innerHTML += "<p>" + data.articles[i].author + "</p>";
        }
    }
}

export {MagicMirror};
