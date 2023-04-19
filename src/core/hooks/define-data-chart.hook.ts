import React, {useMemo} from 'react';
import {WeatherData} from "../common-entities";


export interface useDefineDataChartProps {
    weatherDataDetailed: WeatherData[],
    parameter: string;
    color?: string;
}

export const useDefineDataChart = ({
       weatherDataDetailed,
       parameter,
       color = 'blue'
}:useDefineDataChartProps) => {
    const chartData = useMemo(() => {
        return {
            labels: weatherDataDetailed.map(item => item.city),
            datasets: [{
                label: parameter,
                data: weatherDataDetailed.map(item => item[parameter]),
                backgroundColor: color
            }],
        }
    }, [weatherDataDetailed]);

    return {
        chartData
    };
};
