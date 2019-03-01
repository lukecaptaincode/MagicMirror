import configparser


class ConfigManager:
    config = configparser.ConfigParser()

    def __init__(self):
        self.config.read("config.ini")

    def get_weather_api_key(self):
        return self.config.get("ApiKeys", "accuweather")

    def get_news_api_key(self):
        return self.config.get("ApiKeys", "newsapi")
