import { combineEpics } from "redux-observable";
import {fetchWeatherCitiesEpic, fetchWeatherHistoryEpic} from "../slices";

export const rootEpic = combineEpics(
    fetchWeatherCitiesEpic,
    fetchWeatherHistoryEpic
);
