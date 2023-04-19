import {WEATHER_FEATURE_KEY, weatherReducer} from "../core/slices";

export const rootReducer = {
    [WEATHER_FEATURE_KEY]: weatherReducer,
};