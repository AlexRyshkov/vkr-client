import React, {useEffect, useState} from 'react';
import PageContent from "./PageContent";
import Plot from "react-plotly.js";
import {downloadSamplesResultsTable, getSamplesResultsTableData, getSplomData, getTests} from "../Api";
import Filter from "../components/Filter";
import {Button, Paper, Typography} from "@material-ui/core";
import Select from "react-select";
import LabelCheckbox from "../components/LabelCheckbox";
import {filters, usedFilters} from "../Constants";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";

const CancelToken = axios.CancelToken;
let cancel;


const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    backdropContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
    }
}));

const defaultLayout = {
    width: 1150,
    height: 350,
    title: 'Основные статистические показатели',
};

export default function SamplesResultsTablePage() {
    const classes = useStyles();
    const [tableStatsData, setTableStatsData] = useState(null);
    const [tableStatsLayout, setTableStatsLayout] = useState(defaultLayout);
    const [tableNormalValuesData, setTableNormalValuesData] = useState(defaultLayout);
    const [tableNormalValuesLayout, setTableNormalValuesLayout] = useState(defaultLayout);
    const [tests, setTests] = useState([]);
    const [selectedTests, setSelectedTests] = useState([]);
    const [filter, setFilter] = useState(filters);
    const [selectedFilters, setSelectedFilters] = useState(usedFilters);
    const [useFilter, setUseFilter] = useState(false);
    const [filterDescription, setFilterDescription] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        console.log(isLoading)
    }, [isLoading]);

    useEffect(() => {
        getTests().then(res => {
            let tests = res.data.tests.map(test => ({
                ...test,
                type: test.type === 'bak' ? 'БАК' : test.type === 'oak' ? 'ОАК' : ''
            }));
            setTests(tests);
        });
    }, []);

    const getTableData = (tableData) => {
        const {columns, values} = tableData;
        const tableValues = [];
        for (let column of columns) {
            tableValues.push(values.map(value => value[column]));
        }
        return [{
            type: 'table',
            header: {
                values: columns,
                align: "center",
                line: {width: 1, color: 'black'},
                fill: {color: "grey"},
                font: {family: "Arial", size: 12, color: "white"}
            },
            cells: {
                values: tableValues,
                align: "center",
                line: {color: "black", width: 1},
                font: {family: "Arial", size: 11, color: ["black"]}
            }
        }];
    }

    const buildTableClick = () => {
        setIsLoading(true);
        let filters = {};
        if (useFilter) {
            for (const [key, value] of Object.entries(filter)) {
                if (selectedFilters[key]) {
                    filters[key] = filter[key];
                }
            }
        }

        getSamplesResultsTableData({
            testIds: selectedTests.map(test => parseInt(test.value)),
            filter: filters,

        }, new CancelToken(function executor(c) {
            cancel = c;
        })).then(res => {
            const tableStatsData = getTableData(res.data.tableStats);
            const tableNormalValues = getTableData(res.data.tableNormalValues);
            setTableStatsData(tableStatsData);
            setTableNormalValuesData(tableNormalValues);
            let filterDescription = res.data["filter_description"] && "<br>Фильтры: <br>" + res.data["filter_description"].replaceAll("\r\n", "<br>");
            filterDescription = filterDescription.split('<br>');
            setFilterDescription(filterDescription);
            setTableStatsLayout({...defaultLayout, title: res.data.tableStats.name})
            setTableNormalValuesLayout({...defaultLayout, title: res.data.tableNormalValues.name})
        });
        setIsLoading(false);
    };

    const exportToDocx = () => {
        setIsLoading(true);
        let filters = {};
        if (useFilter) {
            for (const [key, value] of Object.entries(filter)) {
                if (selectedFilters[key]) {
                    filters[key] = filter[key];
                }
            }
        }

        downloadSamplesResultsTable({
            testIds: selectedTests.map(test => parseInt(test.value)),
            filter: filters
        });
        setIsLoading(false);
    };

    const selectedFiltersChange = (selectedFilters) => {
        setSelectedFilters(selectedFilters);
    }

    const onBuildCancel = () => {
        cancel();
        setIsLoading(false);
    }

    const sidebarContent = <div>
        <Filter filter={filter} useFilter={useFilter} setUseFilter={setUseFilter}
                selectedFilters={selectedFilters}
                filterChange={(newFilter) => setFilter(newFilter)}
                selectedFilterChange={selectedFiltersChange}/>
        <Paper style={{height: 250, marginTop: 10, padding: 10, background: 'rgb(197 223 255)', overflowY: 'scroll'}}>
            <Typography variant='h5' style={{marginTop: 10, marginBottom: 10}}>Настройки
                инструмента</Typography>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10
            }}>
                <Typography>Биохимические показатели:</Typography>
                {tests &&
                <div style={{width: 500}}>
                    <Select
                        placeholder={'Выбрать показатели...'}
                        isMulti
                        options={tests.map(test => ({label: test.name, value: test.id}))}
                        onChange={setSelectedTests}
                    />
                </div>
                }
            </div>
            <Button variant="contained" color="primary"
                    onClick={buildTableClick}>
                Вывести статистику
            </Button>
            <Button style={{marginLeft: 10}} variant="contained" color="primary"
                    onClick={exportToDocx}>
                Экспорт в docx
            </Button>
        </Paper>
    </div>;
    const mainContent = <div>
        <Backdrop className={classes.backdrop} open={isLoading}>
            <div className={classes.backdropContent}>
                <CircularProgress color="inherit"/>
                <div>
                    Формирование статистики...
                </div>
                <Button variant="contained" onClick={onBuildCancel}>
                    Отмена
                </Button>
            </div>
        </Backdrop>
        {filterDescription && <div>{filterDescription.map(filterLine => <div>{filterLine}</div>)}</div>}
        {tableStatsData && <Plot
            data={tableStatsData} layout={tableStatsLayout}/>}
        {tableNormalValuesData && <Plot
            data={tableNormalValuesData} layout={tableNormalValuesLayout}/>}
    </div>;
    return <PageContent pageName='Статистика по биохимическим показателям' sidebarContent={sidebarContent}
                        mainContent={mainContent}/>
}