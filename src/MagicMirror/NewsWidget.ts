import * as $ from "jquery";

class NewsWidget {
    /**
     * Calls the news api node module to get top headlines using api
     * key from server
     */
    public getNews() {
        const newsUrlBase = "https://newsapi.org/v2/top-headlines?country=ie&apiKey=" + this.getNewsApiKey();
        let news = "errNews";
        $.ajax({
            async: false,
            success: (data) => {
                news = data;
            },
            type: "get",
            url: newsUrlBase,
        });
        return news;
    }
    /**
     * Gets api from python server
     */
    private getNewsApiKey(): string {
        let key = "errKey"; // just in case of opps
        $.ajax({
            async: false,
            success: (data) => {
                key = data;
            },
            type: "get",
            url: "http://0.0.0.0:5000/newsapikey",
        });
        return key;
    }
}
export {NewsWidget};
