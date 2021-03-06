import * as localeDictionary from 'plotly.js/lib/locales/ru.js'
import React, {useState, useEffect} from 'react'
import {
    Button, Paper, TextField
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {getBoxplotData, getDiagnoses, getHistogramData, getTests} from "../Api";
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
        text: 'Гистограмма распределения биохимических показателей',
        font: {
            size: 14
        },
    },
    width: 1300,
    height: 800,
    margin: {
        l: 40,
        r: 30,
        b: 80,
        t: 300,
        pad: 4
    },
    legend: {
        title: {
            text: 'Биохимичесие показатели'
        }
    },
    xaxis: {
        range: [-3, 5]
    }
    // paper_bgcolor: 'rgb(243, 243, 243)',
    // plot_bgcolor: 'rgb(243, 243, 243)',
}

export default function HistogramPage() {
    const classes = useStyles();
    const [useFilter, setUseFilter] = useState(true);
    const [tests, setTests] = useState([]);
    const [ageInterval, setAgeInterval] = useState(10)
    const [histogramData, setHistogramData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [groupByDiagnose, setGroupByDiagnose] = useState(false);
    const [diagnose, setDiagnose] = useState(null);
    const [allDiagnoses, setAllDiagnoses] = useState([]);
    const [layout, setLayout] = useState(defaultLayout);
    const [selectedTests, setSelectedTests] = useState([]);
    const [standardize, setStandardize] = useState(true);

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
        const chartOptions = {
            testIds: selectedTests,
            standardize: standardize,
            filter: filters
        };
        const res = await getHistogramData(chartOptions, new CancelToken(function executor(c) {
            cancel = c;
        }));
        let data = [];
        console.log(res);
        const tests = res.data.tests;
        Object.entries(res.data.values).forEach(([test_name, values]) => {
            data.push({
                x: values,
                type: 'histogram',
                name: test_name,
            });
        });
        setHistogramData(data);
        const filterDescription = res.data["filter_description"] && "<br>Фильтры: <br>" + res.data["filter_description"].replaceAll("\r\n", "<br>");
        setLayout({
            ...layout,
            title: {
                ...layout.title,
                text: `Гистограмма распределения биохимических показателей<br> Выбранные показатели: ${tests.join(', ')}<br>${res.data.standardize ? 'Стандартизация значений: да' : 'Стандартизация значений: нет'}${filterDescription}`
            },
        });
        setIsLoading(false);
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
        <Paper style={{marginTop: 10, padding: 10, background: 'rgb(197 223 255)', overflowY: 'scroll'}}>
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
                <LabelCheckbox label='Стандартизация значений' checked={standardize}
                               onChange={e => setStandardize(e.target.checked)}/>
            </div>
            <div>
                <Button className={classes.buildChartButton} variant="contained" color="primary"
                        onClick={onBuildChartClick}>
                    Построить график
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
        {histogramData &&
        <Plot config={{
            locales: {'ru': localeDictionary},
            locale: 'ru'
        }} data={histogramData} layout={layout} onClick={pointClick}/>}
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