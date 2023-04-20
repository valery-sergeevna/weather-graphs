import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { ofType } from "redux-observable";
import {catchError, map, mergeMap, switchMap, tap} from "rxjs/operators";
import {forkJoin, Observable, of } from "rxjs";
import {CityData, WeatherData} from "../common-entities";
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
    historyData: any;
    initialLoaded: boolean;
    initialLoadedHistory: boolean;
    errorWeather: WeatherError;
    errorHistoryWeather: WeatherError;
}

const initialState: WeatherState = {
    weatherData: [],
    historyData: [],
    initialLoaded: false,
    initialLoadedHistory: false,
    errorWeather: null,
    errorHistoryWeather: null,
};

export const weatherSlice = createSlice({
    name: WEATHER_FEATURE_KEY,
    initialState: initialState as WeatherState,
    reducers: {
        getWeatherStart: () => {},
        getWeatherCitySuccess: (state, action: PayloadAction<any>) => {
            state.initialLoaded = true;
            state.weatherData = action.payload;
        },
        getWeatherError: (state, action: PayloadAction<WeatherError>) => {
            state.initialLoaded = true;
            state.errorWeather = action.payload;
        },
        getWeatherHistoryStart: () => {},
        getWeatherHistorySuccess: (state, action: PayloadAction<any>) => {
            const { response } = action.payload;
            state.initialLoadedHistory = true;
            state.historyData = response.list;
        },
        getWeatherHistoryError: (state, action: PayloadAction<WeatherError>) => {
            state.initialLoadedHistory = true;
            state.errorHistoryWeather = action.payload;
        },
    },
});

export const weatherReducer = weatherSlice.reducer;

export const {
    getWeatherStart,
    getWeatherCitySuccess,
    getWeatherError,
    getWeatherHistoryStart,
    getWeatherHistorySuccess,
    getWeatherHistoryError,
} = weatherSlice.actions;

export const getWeatherState = (rootState: any): WeatherState => rootState[WEATHER_FEATURE_KEY];

export const getWeatherCities = () => ({
    type: getWeatherStart.type,
});

export const getWeatherHistory = (params: CityData) => ({
    type: getWeatherHistoryStart.type,
    payload: params
});


export const selectWeatherCitiesData = createSelector(
    getWeatherState,
    (s) => s.weatherData,
);

export const selectWeatherInitialLoaded = createSelector(
    getWeatherState,
    (s) => s.initialLoaded,
);

//define main weather parameters for chart bars
export const selectWeatherCitiesDataDetailed = (cities) => {
    return (cities || []).map(city => {
        const { name, main, wind, clouds, sys } = city;
        return {
            city: name,
            country: sys.country,
            temperature: main.temp_min,
            windSpeed: wind.speed,
            clouds: clouds.all,
            lastUpdated: new Date().toLocaleTimeString(),
        }
    });
};

export const selectWeatherErrors= createSelector(
    getWeatherState,
    (s) => s.errorWeather,
);

export const selectWeatherInitialLoadedHistory = createSelector(
    getWeatherState,
    (s) => s.initialLoadedHistory,
);

export const selectWeatherHistory= createSelector(
    getWeatherState,
    (s) => s.historyData,
);

export const selectWeatherHistoryErrors = createSelector(
    getWeatherState,
    (s) => s.errorHistoryWeather,
);

//get weather data for all cities
export const fetchWeatherCitiesEpic = (action$, state$, { Api }: { Api: { weather: WeatherClient } }) => action$.pipe(
    ofType(getWeatherStart.type),
    mergeMap(() =>
        forkJoin(allCities.map(city => Api.weather.getWeathersCity(city) as Observable<any>))
        .pipe(
            map((convertedData) => {
                const result = convertedData.map(item => item.response);
                return getWeatherCitySuccess(result);
            }),
            catchError((err) => of(getWeatherError(err))),
        )),
);

//get forecast weather
export const fetchWeatherHistoryEpic = (action$, state$, { Api }: { Api: { weather: WeatherClient } }) => action$.pipe(
    ofType(getWeatherHistoryStart.type),
    switchMap((action: {payload: CityData}) => (Api.weather.getForecastCity(action.payload) as Observable<any>)
        .pipe(
            map((convertedData) => getWeatherHistorySuccess(convertedData)),
            catchError((err) => of(getWeatherHistoryError(err))),
        )
    )
);