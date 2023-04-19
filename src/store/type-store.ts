import {WEATHER_FEATURE_KEY, WeatherState} from "../core/slices";

export interface TypeStore {
    [WEATHER_FEATURE_KEY]: WeatherState,
}