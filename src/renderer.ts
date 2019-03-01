// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import {MagicMirror} from "./MagicMirror/MagicMirror";

// Declare all widgets here
const clockWidget: HTMLElement = document.getElementById("clockWidget");
const weatherWidget: HTMLElement = document.getElementById("weatherWidget");
const newsWidget: HTMLElement = document.getElementById("newsWidget");

const magicMirror = new MagicMirror();
magicMirror.connectToPythonServer();
// Small loading time
// TODO add loading icon
setTimeout(() => {
    magicMirror.getWeather(weatherWidget);
    magicMirror.displayClock(clockWidget);
    magicMirror.getNews(newsWidget);
}, 5000);




