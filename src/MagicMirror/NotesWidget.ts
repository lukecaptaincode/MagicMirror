import * as $ from "jquery";

/**
 * @class Note - the note class for not objects
 */
class Note {
    public title: string;
    public content: string;
    public screenName: string;
}

/**
 * @class NotesWidget -  controls the data for the notes
 */
class NotesWidget {

    /**
     * Gets notes from the python server
     * @return returnData : Note [] - the array of notes to display
     */
    public getNotes(): Note [] {
        let notes = "errKey"; // just in case of opps
        const returnData: Note [] = [];
        // Get the data using AJAX
        $.ajax({
            async: false,
            success: (data) => {
                notes = data;
            },
            type: "get",
            url: "http://0.0.0.0:5000/notes",
        });
        const tmpObj = notes[0];
        Object.keys(tmpObj).forEach((key: any) => {
            const note = tmpObj[key];
            Object.keys(note).forEach((subKey: any) => {
                // Declare Object keys
                const contentKey: any = "content";
                const titleKey: any = "title";
                const screenNameKey: any = "screenName";
                // Create a temp note object and insert data
                const tempNote = new Note();
                tempNote.screenName = note[subKey][screenNameKey];
                tempNote.title = note[subKey][titleKey];
                tempNote.content = note[subKey][contentKey];
                // Push into return array
                returnData.push(tempNote);
            });
        });

        return returnData;
    }
}

export {NotesWidget};
