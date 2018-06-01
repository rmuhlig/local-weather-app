import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ICurrentWeather } from '../interfaces';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface ICurrentWeatherData {
  weather: [
    {
      description: string,
      icon: string
    }
    ];
  main: {
    temp: number
  };
  sys: {
    country: string,
  };
  dt: number;
  name: string;
}

export interface IWeatherService {
  getCurrentWeather(city: string, country: string): Observable<ICurrentWeather>;
}

@Injectable()
export class WeatherService implements IWeatherService {

  constructor(private httpClient: HttpClient) {
  }

  private transformToICurrentWeather(data: ICurrentWeatherData): ICurrentWeather {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      temperature: this.convertKelvinToFahrenheit(data.main.temp),
      description: data.weather[0].description
    };
  }

  private convertKelvinToFahrenheit(kelvin: number): number {
    return kelvin * 9 / 5 - 459.67;
  }

  getCurrentWeather(city: string, country: string) {
    return this.httpClient
      .get<ICurrentWeatherData>
      (`${environment.baseUrl}api.openweathermap.org/data/2.5/weather?` + `q=${city},${country}&appid=${environment.appId}`)
      .pipe(
        map(d => this.transformToICurrentWeather(d))
      );
  }

}
