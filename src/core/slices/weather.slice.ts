import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { ofType } from "redux-observable";
import { catchError, map, switchMap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { CityData, WeatherData } from "../common-entities";
import { WeatherClient } from "../../api/clients";

export const WEATHER_FEATURE_KEY = 'weather';

export const allCities = [
    { city: "Bordo", country: "France" },
    { city: "Paris", country: "France" },
    { city: "New York", country: "US" },
    { city: "Chicago", country: "US" },
    { city: "Oslo", country: "NO" },
    { city: "Ålesund", country: "NO" },
    { city: "Kyiv", country: "UA" },
    { city: "Lviv", country: "UA" },
    { city: "Riga", country: "LV" },
    { city: "Ventspils", country: "LV" },
];

export type WeatherError = any;

export interface WeatherState {
    weatherData: WeatherData[];
    errorWeather: WeatherError;
}

const initialState: WeatherState = {
    weatherData: [],
    errorWeather: null,
};

export const weatherSlice = createSlice({
    name: WEATHER_FEATURE_KEY,
    initialState: initialState as WeatherState,
    reducers: {
        getWeatherStart: () => {},
        getWeatherCitySuccess: (state, action: PayloadAction<any>) => {
            const { response } = action.payload;
            state.weatherData = response.data;
        },
        getWeatherError: (state, action: PayloadAction<WeatherError>) => {
            state.errorWeather = action.payload;
        },
    },
});

export const weatherReducer = weatherSlice.reducer;

export const {
    getWeatherStart,
    getWeatherCitySuccess,
    getWeatherError,
} = weatherSlice.actions;

export const getWeatherState = (rootState: any): WeatherState => rootState[WEATHER_FEATURE_KEY];

export const getWeatherCities = (cityData: CityData) => ({
    type: getWeatherStart.type,
    payload: cityData,
});

export const selectWeatherCitiesData = createSelector(
    getWeatherState,
    (s) => s.weatherData,
);

export const selectWeatherErrors= createSelector(
    getWeatherState,
    (s) => s.errorWeather,
);

export const fetchWeatherCitiesEpic = (action$, state$, {Api}: {Api: {weather: WeatherClient}}) => action$.pipe(
    ofType(getWeatherStart.type),
    switchMap((action: {payload: CityData}) => (Api.weather.getWeathersCity(action.payload) as Observable<any>).pipe(
        map((convertedData) => getWeatherCitySuccess(convertedData)),
        catchError((err) => of(getWeatherError(err))),
    )),
);