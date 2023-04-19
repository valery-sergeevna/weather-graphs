import React, {memo, useEffect} from 'react';
import {CityData, WeatherData} from "../../core/common-entities";
import {connect} from "react-redux";
import {TypeStore} from "../../store";
import {allCities, getWeatherCities, selectWeatherCitiesData, selectWeatherErrors} from "../../core/slices";


export interface GraphsProps {
    weatherData: WeatherData[],
    errorsWeather: any,
    getWeatherDataOfCities: (cityData: CityData) => void;
}

const Graphs: React.FC<GraphsProps> = ({
  weatherData = [],
  errorsWeather,
  getWeatherDataOfCities,
}) => {

    useEffect(()=>{
        allCities.map((city) => {
            return getWeatherDataOfCities(city);
        });
    }, []);
    return (
        <>
            11111
        </>
    )
}

const mapStateToProps = (state: TypeStore) => ({
    weatherData: selectWeatherCitiesData(state),
    errorsWeather: selectWeatherErrors(state),
});

const mapDispatchToProps = (dispatch: any) => ({
    getWeatherDataOfCities: (cityData: CityData) => {
        dispatch(getWeatherCities(cityData));
    },
});

const _Graphs = connect(
    mapStateToProps,
    mapDispatchToProps,
)(memo(Graphs));

export {_Graphs as Graphs};