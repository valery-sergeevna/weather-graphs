export interface CityData {
    city: string,
    country: string,
}

export enum AgreeEnums {
    false =  0,
    true =  1,
}

export interface WeatherData {
    city: string;
    country: string;
    loading: boolean;
    temperature: number;
    clouds: number;
    windSpeed: number;
    lastUpdated: number;
}