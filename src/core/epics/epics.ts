import { combineEpics } from "redux-observable";
import { fetchWeatherCitiesEpic } from "../slices";

export const rootEpic = combineEpics(
    fetchWeatherCitiesEpic
);
