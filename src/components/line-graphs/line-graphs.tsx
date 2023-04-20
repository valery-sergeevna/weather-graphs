import React, {memo, useEffect, useState} from 'react';
import { Line } from 'react-chartjs-2';
import {HOURS} from "../../core/constants";
import {TypeStore} from "../../store";
import {
    getWeatherHistory,
    selectWeatherHistory,
    selectWeatherHistoryErrors,
    selectWeatherInitialLoadedHistory
} from "../../core/slices";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {connect} from "react-redux";
import { CityData, TableHeads } from "../../core/common-entities";


export interface ForecastChartProps {
    weatherHistoryData: any,
    errorsWeather: any,
    initialLoaded: boolean,
    selectedLabel: CityData;
    choosedGraph: string;
    getWeatherHistory: (city: CityData) => void;
}

const ForecastChart: React.FC<ForecastChartProps> = ({
    weatherHistoryData,
    errorsWeather,
    initialLoaded,
    selectedLabel,
    choosedGraph,
    getWeatherHistory,
}) => {
    const { city } = selectedLabel || {};
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: '',
                data: [],
                fill: false,
                tension: 0.1,
            },
        ],
    });

    useEffect(() => {
        getWeatherHistory(selectedLabel);
    }, [selectedLabel, getWeatherHistory]);

    useEffect(()=>{
        const forecastData = weatherHistoryData
            .slice(0, HOURS)
            .map((item) => ({
                time: item.dt_txt,
                parameter: choosedGraph === TableHeads.temperature
                    ? item.main.temp_min
                    : item.wind.speed}));

        //define labels and temps for chart data
        const labels = forecastData.map((item) => item.time);
        const temps = forecastData.map((item) => item.parameter);

        const chartDatas = {
            labels,
            datasets: [
                {
                    label: choosedGraph,
                    data: temps,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                },
            ],
        };
        setChartData(chartDatas);
    }, [weatherHistoryData, choosedGraph]);


    //options for chart data
    const options = {
        plugins: {
            datalabels: {
                display: true,
            },
        },
    };

    return (
        <>
            {initialLoaded && errorsWeather && (
                <h3>An invalid request was made, correct it and try again.</h3>
            )}
            {!initialLoaded && !errorsWeather && (
                <h3>Please wait while the weather forecast data is loading.</h3>
            )}
            <Line
                data={chartData}
                options={options}
                plugins={[ChartDataLabels]}
            />
            <p>Forecast data of {choosedGraph} for {city}</p>
        </>
    );
};

const mapStateToProps = (state: TypeStore) => ({
    weatherHistoryData: selectWeatherHistory(state),
    errorsWeather: selectWeatherHistoryErrors(state),
    initialLoaded: selectWeatherInitialLoadedHistory(state),
});

const mapDispatchToProps = (dispatch: any) => ({
    getWeatherHistory: (city: CityData) => {
        dispatch(getWeatherHistory(city));
    },
});

const _ForecastChart = connect(
    mapStateToProps,
    mapDispatchToProps,
)(memo(ForecastChart));

export {_ForecastChart as ForecastChart};