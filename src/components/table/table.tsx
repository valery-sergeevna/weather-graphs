import React, {memo} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {TableHeads, WeatherData} from "../../core/common-entities";


const arrayofTitles = [
    TableHeads.city,
    TableHeads.country,
    TableHeads.temperature,
    TableHeads.windSpeed,
    TableHeads.cloud,
    TableHeads.lastUpdated,
];

export interface TableProps {
    weatherDataDetailed: WeatherData[],
}

const TableWeather: React.FC<TableProps> = ({
    weatherDataDetailed = [],
}) => {
    return (
        <TableContainer component={Paper}>
            {weatherDataDetailed && (
                <Table
                    sx={{ maxWidth: 750, margin: 'auto' }}
                    aria-label="caption table"
                >
                    <TableHead>
                        <TableRow>
                            {arrayofTitles.map((title) => (
                                <TableCell
                                    key={title}
                                    align="center"
                                    sx={{ backgroundColor: 'lightgrey', textTransform: 'uppercase' }}
                                >{title}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {weatherDataDetailed.map((row) => (
                            <TableRow key={row.city}>
                                <TableCell align="center">{row.city}</TableCell>
                                <TableCell align="center">{row.country}</TableCell>
                                <TableCell align="center">{row.temperature}</TableCell>
                                <TableCell align="center">{row.windSpeed}</TableCell>
                                <TableCell align="center">{row.clouds}</TableCell>
                                <TableCell align="center">{row.lastUpdated}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </TableContainer>
    );
};

const _TableWeather = memo(TableWeather);

export { _TableWeather as TableWeather };