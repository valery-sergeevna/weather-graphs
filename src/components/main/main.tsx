import React, {memo, useEffect, useMemo, useState} from 'react';
import {ChartTitle, CityData, TableHeads, WeatherData, WeatherTimer} from "../../core/common-entities";
import {connect} from "react-redux";
import {TypeStore} from "../../store";
import {
    getWeatherCities,
    selectWeatherCitiesData,
    selectWeatherCitiesDataDetailed,
    selectWeatherErrors, selectWeatherInitialLoaded
} from "../../core/slices";
import { Subscription, timer } from 'rxjs';
import {ForecastChart, Graphs} from "../";
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
        //get weather data for all cities
        subscription.add(
            timer(0, WeatherTimer).subscribe(() => getWeatherDataOfCities()),
        );
        return () => subscription.unsubscribe();
    }, [getWeatherDataOfCities]);

    //chart for min temperature by using custom hook
    const { chartData: tempData } = useDefineDataChart({
        weatherDataDetailed,
        parameter: ChartTitle.temperature,
        color: 'aqua'
    });

    //chart for speed wind by using custom hook
    const { chartData: windData } = useDefineDataChart({
        weatherDataDetailed,
        parameter: ChartTitle.windSpeed,
    });

    //save selected city, when click on the chart bar
    const [selectedLabel, setSelectedLabel] = useState<CityData>({
        city: '',
        country: '',
    });

    //save wind or temperature title bar
    const [choosedGraph, setChoosedGraph] = useState<string>('');

    //check if selected city object is empty
    const isSelectedEmpty = useMemo(()=>{
        return Object.values(selectedLabel).every(val => val === '');
    }, [selectedLabel]);

    return (
        <div className={s.main}>
            /*loading*/
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
                            <Graphs
                                chartData = {tempData}
                                setSelectedLabel={(label) => setSelectedLabel(label)}
                                setChoosedGraph={() => setChoosedGraph(TableHeads.temperature)}
                            />
                        )}
                        {Object.keys(windData).length && (
                            <Graphs
                                chartData = {windData}
                                setSelectedLabel={(label) => setSelectedLabel(label)}
                                setChoosedGraph={() => setChoosedGraph(TableHeads.windSpeed)}
                            />
                        )}
                    </div>
                </>
            )}
            {!isSelectedEmpty && (
                <div className={s.forecast}>
                    <ForecastChart
                        selectedLabel={selectedLabel}
                        choosedGraph={choosedGraph}
                    />
                </div>
            )}
            /*errors*/
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