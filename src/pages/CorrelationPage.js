import * as localeDictionary from 'plotly.js/lib/locales/ru.js'
import React, {useState, useEffect} from 'react'
import {
    Button, Paper, TextField
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {getBoxplotData, getCorrelationData, getDiagnoses, getTests} from "../Api";
import axios from 'axios';
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import PageContent from "./PageContent";
import {filters, usedFilters} from "../Constants";
import Plot from "react-plotly.js";
import Filter from "../components/Filter";
import Typography from "@material-ui/core/Typography";
import LabelCheckbox from "../components/LabelCheckbox";
import SingleSelect from "../components/SingleSelect";
import ShowPatientInfo from "../components/ShowPatientInfo";
import * as Plotly from 'plotly.js';
import Select from "react-select";

const CancelToken = axios.CancelToken;
let cancel;

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 120,
        width: '90%'
    },
    sidebarItem: {
        margin: theme.spacing(2),
    },
    ageIntervalSelect: {
        width: 100,
        marginTop: 15,
    },
    buildChartButton: {
        marginTop: 15
    },
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
    title: {
        font: {
            size: 14
        },
    },
    margin: {
        l: 40,
        r: 30,
        b: 80,
        t: 300,
        pad: 4
    },
    annotations: [],
    width: 1200,
    height: 850,
    xaxis: {
        ticks: '',
        side: 'bottom',
        tickangle: 45
    },
    yaxis: {
        ticks: '',
    },
    margin: {
        l: 300,
        r: 150,
        b: 300,
        t: 300,
        // pad: 4
    }
};

export default function CorrelationPage() {
    const classes = useStyles();
    const [useFilter, setUseFilter] = useState(true);
    const [tests, setTests] = useState([]);
    const [ageInterval, setAgeInterval] = useState(10)
    const [correlationData, setCorrelationData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [groupByDiagnose, setGroupByDiagnose] = useState(false);
    const [diagnose, setDiagnose] = useState(null);
    const [allDiagnoses, setAllDiagnoses] = useState([]);
    const [layout, setLayout] = useState(defaultLayout);
    const [selectedTests, setSelectedTests] = useState([]);

    const [filter, setFilter] = useState(filters);
    const [selectedFilters, setSelectedFilters] = useState(usedFilters);
    const [patientId, setPatientId] = useState(null);

    useEffect(() => {
        getTests().then(res => {
            let tests = res.data.tests;
            tests.sort((a, b) => a['results_count'] < b['results_count'] ? 1 : -1);
            setTests(tests);
        });
        getDiagnoses().then(res => {
            let diagnoses = res.data.diagnoses;
            // tests.sort((a, b) => a['results_count'] < b['results_count'] ? 1 : -1);
            setAllDiagnoses(diagnoses);
        });
    }, []);

    const onBuildChartClick = async () => {
        setIsLoading(true);
        let filters = {};
        if (useFilter) {
            for (const [key, value] of Object.entries(filter)) {
                if (selectedFilters[key]) {
                    filters[key] = filter[key];
                }
            }
        }
        getCorrelationData({
            testIds: selectedTests,
            filter: filters
        }, new CancelToken(function executor(c) {
            cancel = c;
        })).then(res => {
            const {tests, values} = res.data;
            const xValues = tests;
            const yValues = tests;
            const zValues = values;
            const data = [{
                x: xValues,
                y: yValues,
                z: zValues,
                type: 'heatmap',
                showscale: false
            }];
            const annotations = [];
            for (var i = 0; i < yValues.length; i++) {
                for (var j = 0; j < xValues.length; j++) {
                    var result = {
                        xref: 'x1',
                        yref: 'y1',
                        x: xValues[j],
                        y: yValues[i],
                        text: zValues[i][j],
                        showarrow: false,
                        font: {
                            color: 'white'
                        }
                    };
                    annotations.push(result);
                }
            }
            const filterDescription = res.data["filter_description"] && "<br>Фильтры: <br>" + res.data["filter_description"].replaceAll("\r\n", "<br>");
            setLayout({
                ...layout,
                annotations: annotations,
                title: {
                    ...layout.title,
                    text: `Тепловая карта корреляции<br>Выбранные показатели: ${tests.join(', ')}${filterDescription}`
                },
            });
            setCorrelationData(data);
            setIsLoading(false);
        });
    }

    const onBuildChartCancel = () => {
        cancel();
        setIsLoading(false);
    }

    const selectedFiltersChange = (selectedFilters) => {
        setSelectedFilters(selectedFilters);
    }

    const sidebarContent = <div>
        <Filter filter={filter} useFilter={useFilter} setUseFilter={setUseFilter}
                selectedFilters={selectedFilters}
                filterChange={(newFilter) => setFilter(newFilter)}
                selectedFilterChange={selectedFiltersChange}/>
        <Paper style={{marginTop: 10, padding: 10, background: 'rgb(197 223 255)', height: 300 , overflowY: 'scroll'}}>
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
                        onChange={selectedOptions => setSelectedTests(selectedOptions)}
                    />
                </div>}
            </div>
            <div>
                <Button className={classes.buildChartButton} variant="contained" color="primary"
                        onClick={onBuildChartClick}>
                    Построить карту корреляции
                </Button>
            </div>
        </Paper>
    </div>;

    const pointClick = (data) => {
        const point_label = data.points[0].text
        const {groups: {id}} = /(?<id>[0-9]+)/.exec(point_label);
        setPatientId(id);
    }

    const mainContent = <>
        {correlationData &&
        <Plot config={{
            locales: {'ru': localeDictionary},
            locale: 'ru'
        }} data={correlationData} layout={layout} onClick={pointClick}/>}
        {patientId &&
        <ShowPatientInfo patient_id={patientId} onDialogClose={() => setPatientId(null)}/>}
        <Backdrop className={classes.backdrop} open={isLoading}>
            <div className={classes.backdropContent}>
                <CircularProgress color="inherit"/>
                <div>
                    Построение графика
                </div>
                <Button variant="contained" onClick={onBuildChartCancel}>
                    Отмена
                </Button>
            </div>
        </Backdrop>
    </>;

    return <PageContent sidebarContent={sidebarContent} mainContent={mainContent}/>
}