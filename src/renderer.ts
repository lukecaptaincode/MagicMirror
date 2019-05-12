// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import {MagicMirror} from "./MagicMirror/MagicMirror";
// Declare UI Elements
const loadingSplash: HTMLElement = document.getElementById("loadingScreen");
const quoteText: HTMLElement = document.getElementById("quote");
// Declare all widgets here
const clockWidget: HTMLElement = document.getElementById("clockWidget");
const weatherWidget: HTMLElement = document.getElementById("weatherWidget");
const newsWidget: HTMLElement = document.getElementById("newsWidget");
const mirrorId: HTMLElement = document.getElementById("mirrorId");
const notesWidget: HTMLElement = document.getElementById("notesWidget");

const magicMirror = new MagicMirror();
magicMirror.connectToPythonServer();
// Small loading time
setTimeout(() => {
    // Fade out the loading screen
    fade(loadingSplash);
    // init all the widgets
    magicMirror.getMirrorId(mirrorId);
    magicMirror.getWeather(weatherWidget);
    magicMirror.displayClock(clockWidget);
    magicMirror.getNews(newsWidget);
    magicMirror.getNotes(notesWidget);
    magicMirror.getQuotes(quoteText);
}, 5000);

/**
 * Fades out the passed element
 * @param element - element to fade
 */
function fade(element: HTMLElement) {
    let opacity = 1; // Inital opcacity
    const timer = setInterval(() => {
        if (opacity <= 0.05) {  // If the opacity is below 0.05 stop the interval and hide element
            clearInterval(timer);
            element.style.display = "none";
        }
        // On each tick set the opacity and opacity filter to the opacity var and then reduce the opacity
        element.style.opacity = opacity.toString();
        element.style.filter = "alpha(opacity=" + opacity * 100 + ")";
        opacity -= opacity * 0.1;
    }, 100);
}


