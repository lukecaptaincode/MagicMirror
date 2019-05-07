import firebase_admin
from firebase_admin import credentials, db
from ConfigAccessManager import ConfigAccessManager
"""
All firebase logic
"""
class FirebaseController:
    reference = ""
    cm = ConfigAccessManager()
    """
    Init firebase
    """
    def __init__(self):
        # Create credentials object from the firebase certificate file
        firebase_cred = credentials.Certificate(
            self.cm.get_cred_file())
        # Initialize the firebase application using the credentials object and the database url
        firebase_admin.initialize_app(firebase_cred, {
            'databaseURL': self.cm.get_mirror_database()
        })
        self.reference = db.reference('/')

    """
    Post data to firebase
    @param reference - where to post
    @param data - what to post
    """
    def firebase_post(self, reference, data):
        self.reference.update({reference: data})

    """
    Gets and returns data from firebase based on passed reference
    @param reference - where to source the data
    @return - the pulled data
    """
    def firebase_get(self, reference):
        dbReference = db.reference('/' + reference)
        return dbReference.get(reference)
