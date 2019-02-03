import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherProvider {
  // apiKey: string = "362a425ff7e7c587c4029ca3a6fb46e2";
  apiKey: string = "2205486a0df7a89e2b52fbff7fa31cb6";
  weatherURL: string = "http://api.openweathermap.org/data/2.5/weather";
  forecastURL: string = "http://api.openweathermap.org/data/2.5/forecast";
  weatherParams = { lat:null, lon:null, units:"metric", lang:"id", appid:this.apiKey };
  forecastParams = { lat:null, lon:null, units:"metric", lang:"id", appid:this.apiKey };
  request: Observable<any>;
  weatherIcons = {
    "200": {
      "label": "thunderstorm with light rain",
      "icon": "storm-showers"
    },
    "201": {
      "label": "thunderstorm with rain",
      "icon": "storm-showers"
    },
    "202": {
      "label": "thunderstorm with heavy rain",
      "icon": "storm-showers"
    },
    "210": {
      "label": "light thunderstorm",
      "icon": "storm-showers"
    },
    "211": {
      "label": "thunderstorm",
      "icon": "thunderstorm"
    },
    "212": {
      "label": "heavy thunderstorm",
      "icon": "thunderstorm"
    },
    "221": {
      "label": "ragged thunderstorm",
      "icon": "thunderstorm"
    },
    "230": {
      "label": "thunderstorm with light drizzle",
      "icon": "storm-showers"
    },
    "231": {
      "label": "thunderstorm with drizzle",
      "icon": "storm-showers"
    },
    "232": {
      "label": "thunderstorm with heavy drizzle",
      "icon": "storm-showers"
    },
    "300": {
      "label": "light intensity drizzle",
      "icon": "sprinkle"
    },
    "301": {
      "label": "drizzle",
      "icon": "sprinkle"
    },
    "302": {
      "label": "heavy intensity drizzle",
      "icon": "sprinkle"
    },
    "310": {
      "label": "light intensity drizzle rain",
      "icon": "sprinkle"
    },
    "311": {
      "label": "drizzle rain",
      "icon": "sprinkle"
    },
    "312": {
      "label": "heavy intensity drizzle rain",
      "icon": "sprinkle"
    },
    "313": {
      "label": "shower rain and drizzle",
      "icon": "sprinkle"
    },
    "314": {
      "label": "heavy shower rain and drizzle",
      "icon": "sprinkle"
    },
    "321": {
      "label": "shower drizzle",
      "icon": "sprinkle"
    },
    "500": {
      "label": "light rain",
      "icon": "rain"
    },
    "501": {
      "label": "moderate rain",
      "icon": "rain"
    },
    "502": {
      "label": "heavy intensity rain",
      "icon": "rain"
    },
    "503": {
      "label": "very heavy rain",
      "icon": "rain"
    },
    "504": {
      "label": "extreme rain",
      "icon": "rain"
    },
    "511": {
      "label": "freezing rain",
      "icon": "rain-mix"
    },
    "520": {
      "label": "light intensity shower rain",
      "icon": "showers"
    },
    "521": {
      "label": "shower rain",
      "icon": "showers"
    },
    "522": {
      "label": "heavy intensity shower rain",
      "icon": "showers"
    },
    "531": {
      "label": "ragged shower rain",
      "icon": "showers"
    },
    "600": {
      "label": "light snow",
      "icon": "snow"
    },
    "601": {
      "label": "snow",
      "icon": "snow"
    },
    "602": {
      "label": "heavy snow",
      "icon": "snow"
    },
    "611": {
      "label": "sleet",
      "icon": "sleet"
    },
    "612": {
      "label": "shower sleet",
      "icon": "sleet"
    },
    "615": {
      "label": "light rain and snow",
      "icon": "rain-mix"
    },
    "616": {
      "label": "rain and snow",
      "icon": "rain-mix"
    },
    "620": {
      "label": "light shower snow",
      "icon": "rain-mix"
    },
    "621": {
      "label": "shower snow",
      "icon": "rain-mix"
    },
    "622": {
      "label": "heavy shower snow",
      "icon": "rain-mix"
    },
    "701": {
      "label": "mist",
      "icon": "sprinkle"
    },
    "711": {
      "label": "smoke",
      "icon": "smoke"
    },
    "721": {
      "label": "haze",
      "icon": "day-haze"
    },
    "731": {
      "label": "sand, dust whirls",
      "icon": "cloudy-gusts"
    },
    "741": {
      "label": "fog",
      "icon": "fog"
    },
    "751": {
      "label": "sand",
      "icon": "cloudy-gusts"
    },
    "761": {
      "label": "dust",
      "icon": "dust"
    },
    "762": {
      "label": "volcanic ash",
      "icon": "smog"
    },
    "771": {
      "label": "squalls",
      "icon": "day-windy"
    },
    "781": {
      "label": "tornado",
      "icon": "tornado"
    },
    "800": {
      "label": "clear sky",
      "icon": "sunny"
    },
    "801": {
      "label": "few clouds",
      "icon": "cloudy"
    },
    "802": {
      "label": "scattered clouds",
      "icon": "cloudy"
    },
    "803": {
      "label": "broken clouds",
      "icon": "cloudy"
    },
    "804": {
      "label": "overcast clouds",
      "icon": "cloudy"
    },
    "900": {
      "label": "tornado",
      "icon": "tornado"
    },
    "901": {
      "label": "tropical storm",
      "icon": "hurricane"
    },
    "902": {
      "label": "hurricane",
      "icon": "hurricane"
    },
    "903": {
      "label": "cold",
      "icon": "snowflake-cold"
    },
    "904": {
      "label": "hot",
      "icon": "hot"
    },
    "905": {
      "label": "windy",
      "icon": "windy"
    },
    "906": {
      "label": "hail",
      "icon": "hail"
    },
    "951": {
      "label": "calm",
      "icon": "sunny"
    },
    "952": {
      "label": "light breeze",
      "icon": "cloudy-gusts"
    },
    "953": {
      "label": "gentle breeze",
      "icon": "cloudy-gusts"
    },
    "954": {
      "label": "moderate breeze",
      "icon": "cloudy-gusts"
    },
    "955": {
      "label": "fresh breeze",
      "icon": "cloudy-gusts"
    },
    "956": {
      "label": "strong breeze",
      "icon": "cloudy-gusts"
    },
    "957": {
      "label": "high wind, near gale",
      "icon": "cloudy-gusts"
    },
    "958": {
      "label": "gale",
      "icon": "cloudy-gusts"
    },
    "959": {
      "label": "severe gale",
      "icon": "cloudy-gusts"
    },
    "960": {
      "label": "storm",
      "icon": "thunderstorm"
    },
    "961": {
      "label": "violent storm",
      "icon": "thunderstorm"
    },
    "962": {
      "label": "hurricane",
      "icon": "cloudy-gusts"
    }
  };

  constructor(public httpClient: HttpClient, public http: Http) {
  }

  getWeatherByCity(city: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.weatherURL, { params:{ q:city, units:"metric", lang:"id", appid:this.apiKey} })
      .subscribe((res) => {
        resolve(res.json());
      }, (err) => {
        reject(err);
      });
    });
  }

  getWeather(latitude: number, longitude: number) {
    this.weatherParams.lat = latitude;
    this.weatherParams.lon = longitude;
    return this.request = this.httpClient.get(this.weatherURL, { params: this.weatherParams });
  }

  getForecast(latitude: number, longitude: number) {
    this.forecastParams.lat = latitude;
    this.forecastParams.lon = longitude;
    return this.request = this.httpClient.get(this.forecastURL, { params: this.forecastParams });
  }

}
