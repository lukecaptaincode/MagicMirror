import {CronJob} from "cron";
import * as $ from "jquery";
import {PythonShell} from "python-shell";
import {NewsWidget} from "./NewsWidget";
import {NotesWidget} from "./NotesWidget";
import {QuotesWidget} from "./QuotesWidget";
import {WeatherWidget} from "./WeatherWidget";


/**
 * contains all the main function for the magic mirror
 * interfaces with the other class functions
 * @class MagicMirror
 */
class MagicMirror {
    /**
     * Loads a random quote into the passed quote element
     * @param quotesElement
     */
    public getQuotes(quotesElement: HTMLElement) {
        const quotesWidget = new QuotesWidget();
        quotesElement.innerText = quotesWidget.getQuote();
    }

    /**
     * Gets the notes from the notes widget
     * @param notesElement - the element to populate the notes to
     */
    public getNotes(notesElement: HTMLElement) {
        // Declare Object keys , not literal string access
        const contentKey: any = "content";
        const titleKey: any = "title";
        const screenNameKey: any = "screenName";
        // Init notes widget and get the notes to an array
        const noteWidget = new NotesWidget();
        notesElement.innerHTML = "";
        // Every 10 seconds pull from the server and poplaute the notes widget
        setInterval(() => {
            // Set the title
            notesElement.innerHTML = "<h1>Notes</h1>";
            // Get the notes
            const notesArray = noteWidget.getNotes() as any;
            // Init the htmpstring
            let htmlString = "";
            htmlString += "<h1> Notes: </h1>";
            /** If the number of returned notes is less that 6 use the length
             * of the returned notes to populate the widget, else use limit it to 6
             */
            let numberOfNotes = 0;
            if (notesArray.length < 6) {
                numberOfNotes = notesArray.length;
            } else {
                numberOfNotes = 6;
            }
            /**
             * Create the notes
             */
            for (let i = 0; i < numberOfNotes; i++) {
                htmlString += "<div class='note-container'>";
                htmlString += "<h5>Note From:" + notesArray[i][screenNameKey] + "</h5>";
                htmlString += "<h1>" + notesArray[i][titleKey] + "</h1>";
                htmlString += "<h2>" + notesArray[i][contentKey] + "</h2><hr>";
                htmlString += "</div>";
            }
            // Populate the container
            notesElement.innerHTML = htmlString;
        }, 10000);

    }

    /**
     * Returns the mirrors unique key
     * @param idElement - the element to display the key on
     */
    public getMirrorId(idElement: HTMLElement) {
        let key = "Error getting key, please restart";
        $.ajax({
            async: false,
            success: (data) => {
                key = data;
            },
            type: "get",
            url: "http://0.0.0.0:5000/mirrorkey",
        });
        idElement.innerText = "Mirror id: " + key;
    }

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

    /**
     * Pulls the newsapi into the news widget
     * @param newsWidgetElement
     */
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
        // Create the cron job for every 10 mins
        const job = new CronJob("0 */10 * * * *", () => {
            const isStale = WeatherWidget.isLastWeatherPullStale();
            // If the pull is stale use accuweather, else use the stored weather data
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
        job.start(); // start cron job
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
        // data.articles.length
        for (let i = 0; i < 3; i++) {
            widget.innerHTML += "<h4>" + data.articles[i].title + "</h4>";
            widget.innerHTML += "<p>" + data.articles[i].description + "</p>";
            widget.innerHTML += "<p>" + data.articles[i].author + "</p>";
        }
    }
}

export {MagicMirror};
