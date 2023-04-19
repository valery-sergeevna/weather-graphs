import React, {memo, useEffect, useMemo, useState} from 'react';
import {ChartTitle, TableHeads, WeatherData, WeatherTimer} from "../../core/common-entities";
import {connect} from "react-redux";
import {TypeStore} from "../../store";
import {
    getWeatherCities,
    selectWeatherCitiesData,
    selectWeatherCitiesDataDetailed,
    selectWeatherErrors, selectWeatherInitialLoaded
} from "../../core/slices";
import { Subscription, timer } from 'rxjs';
import {Graphs} from "../";
import {TableWeather} from "../table/table";
import s from './main.module.scss';
import {useDefineDataChart} from "../../core/hooks";


export interface MainComponentProps {
    weatherData: any,
    weatherDataDetailed: WeatherData[],
    errorsWeather: any,
    initialLoaded: boolean,
    getWeatherDataOfCities: () => void;
}

const MainComponent: React.FC<MainComponentProps> = ({
   weatherData,
   weatherDataDetailed = [],
   errorsWeather,
   initialLoaded,
   getWeatherDataOfCities,
}) => {
    useEffect(() => {
        const subscription = new Subscription();
        subscription.add(
            timer(0, WeatherTimer).subscribe(() => getWeatherDataOfCities()),
        );
        return () => subscription.unsubscribe();
    }, [getWeatherDataOfCities]);

    const { chartData: tempData } = useDefineDataChart({
        weatherDataDetailed,
        parameter: ChartTitle.temperature,
        color: 'aqua'
    });

    const { chartData: windData } = useDefineDataChart({
        weatherDataDetailed,
        parameter: ChartTitle.windSpeed,
    });

    return (
        <div className={s.main}>
            {!initialLoaded && !errorsWeather && (
                <h3>Please wait while the weather data is loading.</h3>
            )}
            {initialLoaded && !!weatherData?.length && (
                <>
                    <TableWeather
                        weatherDataDetailed = {weatherDataDetailed}
                    />
                    <div className={s.bars}>
                        {Object.keys(tempData).length && (
                            <Graphs chartData = {tempData} />
                        )}
                        {Object.keys(windData).length && (
                            <Graphs chartData = {windData} />
                        )}
                    </div>
                </>
            )}
            {initialLoaded && errorsWeather && (
                <h3>An invalid request was made, correct it and try again.</h3>
            )}
        </div>
    )
};

const mapStateToProps = (state: TypeStore) => {
    const weatherData = selectWeatherCitiesData(state);
    return {
        weatherData,
        weatherDataDetailed: selectWeatherCitiesDataDetailed(weatherData),
        errorsWeather: selectWeatherErrors(state),
        initialLoaded: selectWeatherInitialLoaded(state),
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    getWeatherDataOfCities: () => {
        dispatch(getWeatherCities());
    },
});

const _MainComponent = connect(
    mapStateToProps,
    mapDispatchToProps,
)(memo(MainComponent));

export {_MainComponent as MainComponent};