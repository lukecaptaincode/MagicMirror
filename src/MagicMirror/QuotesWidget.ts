/**
 * @class This class controls the random quote widget
 */
class QuotesWidget {

    public quotes: string [] = ["Looking good!",
        "Mirror mirror on the wall, you're the coolest of them all!",
    "I drink and know things.",
    "Goals transform a random walk into a chase.",
    "Natural selection is anything but random.",
    "Anger is the ultimate destroyer of your own peace of mind.",
    "Don't be afraid. Be focused. Be determined. Be hopeful. Be empowered.",
    "He who keeps silent consents.",
    "I haven't lost an arm, brother. It's right over there.",
    "Drive me closer! I want to hit them with my sword!",
    "Knowledge is power, guard it well."];

    /**
     * Returns a random quote from the quote array;
     */
    public getQuote(): string {
        // Generate a random index using the lenght of the quotes array
        const randomIndex: any = Math.floor(Math.random() * this.quotes.length);
        // return the random quote
        return this.quotes[randomIndex];
    }
}

export {QuotesWidget};
