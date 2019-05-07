import configparser
from MirrorUtilities import MirrorUtilities

'''
This class controls access to the config file that holds all the apikeys
'''


class ConfigAccessManager:
    # Init class objects
    config = configparser.ConfigParser()
    utils = MirrorUtilities()
    '''
    Init - class constructor
    '''
    def __init__(self):
        self.config.read("config.ini")  # Read the file into memory

    '''
    Gets and returns the accuweather key from the file
    :return accuweather api key
    '''
    def get_weather_api_key(self):
        return self.config.get("ApiKeys", "accuweather")

    '''
    Gets and returns the newsapi key
    :return newsapi key
    '''
    def get_news_api_key(self):
        return self.config.get("ApiKeys", "newsapi")

    '''
    Checks to see if the mirror has a generated key and if it doesn't it generates a key and stores it in the config
    file and then returns the key value. It also pushes the key value to firebase as ref with the isLive value set
    to true
    :return mirrorKey - the mirrors unique key
    '''
    def get_mirror_key(self):
        if not self.config.get("mirror", "mirrorKey"):  # check the config file
            self.config['mirror']['mirrorKey'] = self.utils.mirror_id_generator(12)  # generate a key
            with open('config.ini', 'w') as configfile:  # Open the config file
                self.config.write(configfile)  # write the contents of the config file object to the file
            return {'key': self.config.get("mirror", "mirrorKey"), 'setKey': True}
        return self.config.get("mirror", "mirrorKey")  # return the value

    '''
    Gets and returns the mirrors database url
    '''
    def get_mirror_database(self):
        return self.config.get("mirror", "databaseUrl")

    '''
    Gets and retunrs the firebase credentials file path
    '''
    def get_cred_file(self):
        return self.config.get("mirror", "firebaseCredFile")
