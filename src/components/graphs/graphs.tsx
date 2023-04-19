import React, { memo } from 'react';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import {CategoryScale} from 'chart.js';
import s from './graphs.module.scss';


ChartJS.register(CategoryScale);

export interface GraphsProps {
    chartData: any;
}

const Graphs: React.FC<GraphsProps> = ({
    chartData
}) => {

    console.log(chartData, 'temperatureData')
    return (
        <div className={s.chart}>
            <Bar
                data={chartData}
            />
        </div>
    )
};

const _Graphs = memo(Graphs);

export {_Graphs as Graphs};