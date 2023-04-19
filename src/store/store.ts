import {createEpicMiddleware} from "redux-observable";
import {
    configureStore,
} from "@reduxjs/toolkit";
import {RootClient} from "../api";
import {rootReducer} from "./reducers";
import {rootEpic} from "../core/epics";

const Root = new RootClient();

const epicMiddleware = createEpicMiddleware({
    dependencies: {Api: Root},
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: [epicMiddleware],
});

epicMiddleware.run(rootEpic);