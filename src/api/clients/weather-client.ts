import {Observable} from "rxjs";
import {ajax} from "rxjs/ajax";
import {API_KEY, BASE_API_URL} from "../../core/constants";
import {CityData} from "../../core/common-entities";

export interface WeatherDataApi {
    getWeathersCity(params: CityData): Observable<any> | Promise<any>;
}

export class WeatherClient implements WeatherDataApi {
    getWeathersCity(cityData: CityData): Observable<any> | Promise<any>{
        const { city, country } = cityData;
        return ajax.get(`${BASE_API_URL}weather?q=${city},${country}&units=metric&appid=${API_KEY}`);
    };
}
