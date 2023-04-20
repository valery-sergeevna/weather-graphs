import React, { memo } from 'react';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import {CategoryScale} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import s from './graphs.module.scss';
import {allCities} from "../../core/slices";
import {CityData} from "../../core/common-entities";


ChartJS.register(CategoryScale);

export interface GraphsProps {
    chartData: any;
    setSelectedLabel: (label: CityData) => void;
    setChoosedGraph: () => void;
}

const Graphs: React.FC<GraphsProps> = ({
    chartData,
    setSelectedLabel,
    setChoosedGraph,
}) => {
    //options for BarChart
    const options = {
        onHover: (event, chartElement) => {
            if (chartElement.length > 0) {
                event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
            }
        },
        onClick: (event, chartElement) => {
            if (chartElement.length > 0) {
                setChoosedGraph();
                const indexLabel = chartElement[0].index;
                setSelectedLabel(allCities[indexLabel]);
            }
        },
        plugins: {
            datalabels: {
                display: true,
            },
        },
    };

    return (
        <div className={s.chart}>
            <Bar
                data={chartData}
                options={options}
                plugins={[ChartDataLabels]}
            />
        </div>
    )
};

const _Graphs = memo(Graphs);

export {_Graphs as Graphs};