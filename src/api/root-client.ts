import {WeatherClient} from "./clients/weather-client";

export interface RootClientApi {
    weather: WeatherClient;
}

export class RootClient implements RootClientApi {
    weather: WeatherClient;

    constructor() {
        this.weather = new WeatherClient();
    }
}