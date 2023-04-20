export interface CityData {
    city: string,
    country: string,
}

export interface WeatherData {
    city: string;
    country: string;
    temperature: number;
    clouds: number;
    windSpeed: number;
    lastUpdated: string;
}

export enum TableHeads {
    city = 'city',
    country = 'country',
    temperature = 'temperature',
    windSpeed = 'wind Speed',
    cloud = 'clouds',
    lastUpdated = 'last Updated'
}

//ChartTitle for variable 'windSpeed', not 'wind Speed' as in TableHeads

export enum ChartTitle {
    temperature = 'temperature',
    windSpeed = 'windSpeed',
}

export const WeatherTimer: number = 60000;