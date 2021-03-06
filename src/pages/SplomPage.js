import React, {useEffect, useState} from 'react';
import PageContent from "./PageContent";
import Plot from 'react-plotly.js';
import {getDiagnoses, getSplomData, getTests} from "../Api";
import {filters, usedFilters} from "../Constants";
import {Box, Button, Divider, Paper, Typography} from "@material-ui/core";
import ShowPatientInfo from "../components/ShowPatientInfo";
import Filter from "../components/Filter";
import Select from "react-select";
import LabelCheckbox from "../components/LabelCheckbox";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import {makeStyles} from "@material-ui/core/styles";

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

const colorscale = [
    [0.0, '#A0A0A0'],
    [1, '#F70000']
]

const defaultLayout = {
    title: {
        text: 'Диаграмма матрицы рассеивания',
        font: {
            size: 14
        },
    },
    margin: {
        l: 40,
        r: 30,
        b: 80,
        t: 320,
        pad: 4
    },
    showlegend: true,
    width: 1150,
    height: 1000,
    autosize: false,
    hovermode: 'closest',
    legend: {
        title: {
            text: 'Диагнозы'
        }
    },
};

export default function SplomPage() {
    const classes = useStyles();
    const [scatterplotData, setScatterplotData] = useState(null);
    const [filter, setFilter] = useState(filters);
    const [selectedFilters, setSelectedFilters] = useState(usedFilters);
    const [useFilter, setUseFilter] = useState(false);
    const [scatterplotOptions, setScatterplotOptions] = useState({
        selectedTests: [],
    });
    const [tests, setTests] = useState([]);
    const [patientId, setPatientId] = useState(null);
    const [layout, setLayout] = useState(defaultLayout);
    const [standardize, setStandardize] = useState(true);
    const [diagnoses, setDiagnoses] = useState([]);
    const [selectedDiagnose, setSelectedDiagnose] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getTests().then(res => {
            let tests = res.data.tests.map(test => ({
                ...test,
                type: test.type == 'bak' ? 'БАК' : test.type == 'oak' ? 'ОАК' : ''
            }));
            setTests(tests);
        });
        getDiagnoses().then(res => {
            setDiagnoses(res.data.diagnoses);
        });
    }, []);

    const buildScatterplotClick = () => {
        setIsLoading(true);
        let filters = {};
        if (useFilter) {
            for (const [key, value] of Object.entries(filter)) {
                if (selectedFilters[key]) {
                    filters[key] = filter[key];
                }
            }
        }

        getSplomData({
            ...scatterplotOptions,
            standardize: standardize,
            testIds: scatterplotOptions.selectedTests.map(test => parseInt(test.value)),
            filter: filters,
            diagnose: selectedDiagnose
        }, new CancelToken(function executor(c) {
            cancel = c;
        })).then(res => {
            console.log(res.data);
            const tests = res.data.tests;
            const data = {...res.data, values: {Возраст: res.data.values['Возраст'], ...res.data.values}};
            let hasDiagnose = res.data.diagnose.length !== 0;
            let patient_ids = [];
            let dimensions = [];
            Object.entries(data.values).forEach(([key, values]) => {
                dimensions.push({
                    label: key,
                    values: hasDiagnose ? values.filter((value, index) => !data['has_diagnose'][index]) : values
                });
                patient_ids = hasDiagnose ? data['patient_ids'].filter((patient_id, index) => !data['has_diagnose'][index]) : data['patient_ids'];
            });
            let scatterData = [{
                name: 'Без диагноза',
                type: 'splom',
                dimensions: dimensions,
                text: patient_ids.map(id => `ID пациента: ${id}`),
                marker: {
                    color: 0,
                    colorscale: colorscale,
                    opacity: 0.5
                },
            },];
            if (res.data.diagnose.length > 0) {
                let dimensions_diagnose = [];
                let patient_ids_with_diagnose = [];
                Object.entries(data.values).forEach(([key, values]) => {
                    dimensions_diagnose.push({
                        label: key,
                        values: values.filter((value, index) => data['has_diagnose'][index])
                    });
                    patient_ids_with_diagnose = data['patient_ids'].filter((patient_id, index) => data['has_diagnose'][index]);
                });
                scatterData.push({
                    name: res.data.diagnose,
                    type: 'splom',
                    dimensions: dimensions_diagnose,
                    text: patient_ids_with_diagnose.map(id => `ID пациента: ${id}`),
                    marker: {
                        color: 1,
                        colorscale: colorscale,
                        opacity: 1
                    },
                },);
            }
            setScatterplotData(scatterData);

            const filterDescription = res.data["filter_description"] && "<br>Фильтры: <br>" + res.data["filter_description"].replaceAll("\r\n", "<br>");
            setLayout({
                ...layout,
                title: {
                    ...layout.title,
                    text: `Диаграмма матрицы рассеивания <br>${hasDiagnose ? 'Группировка по диагнозу: ' + res.data.diagnose + '<br>' : ''}Выбранные показатели: ${tests.join(', ')}<br>${res.data.standardize ? 'Стандартизация значений: да' : 'Стандартизация значений: нет'}${filterDescription}`
                },
            });
            setIsLoading(false);
        });
    };

    const onBuildChartCancel = () => {
        cancel();
        setIsLoading(false);
    }

    const pointClick = (data) => {
        const point_label = data.points[0].text
        const {groups: {id}} = /(?<id>[0-9]+)/.exec(point_label);
        setPatientId(id);
    }


    const selectedFiltersChange = (selectedFilters) => {
        setSelectedFilters(selectedFilters);
    }

    console.log(filter.diagnoses);
    let selectDiagnoses = [];
    if (filter.diagnoses.length > 0) {
        selectDiagnoses = filter.diagnoses;
    } else {
        selectDiagnoses = diagnoses.map(diagnose => ({label: diagnose.name, value: diagnose.id}));
    }
    const mainContent =
        <div>
            {scatterplotData && <Plot onClick={pointClick}
                                      data={scatterplotData}
                                      layout={layout}
            />}
            {patientId && <ShowPatientInfo patient_id={patientId} onDialogClose={() => setPatientId(null)}/>}
        </div>;
    const sidebarContent = <div>
        <Filter filter={filter} useFilter={useFilter} setUseFilter={setUseFilter}
                selectedFilters={selectedFilters}
                filterChange={(newFilter) => setFilter(newFilter)}
                selectedFilterChange={selectedFiltersChange}/>
        <Paper style={{height: 300, marginTop: 10, padding: 10, background: 'rgb(197 223 255)', overflowY: 'scroll'}}>
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
                        onChange={selectedOptions => setScatterplotOptions({
                            ...scatterplotOptions,
                            selectedTests: selectedOptions
                        })}
                    />
                </div>
                }
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10
            }}>
                <Typography>Диагноз:</Typography>
                {tests &&
                <div style={{width: 339}}>
                    <Select
                        placeholder={'Выбрать диагноз...'}
                        options={selectDiagnoses}
                        onChange={setSelectedDiagnose}
                    />
                </div>
                }
            </div>
            <div>
                <LabelCheckbox label='Стандартизация значений' checked={standardize}
                               onChange={e => setStandardize(e.target.checked)}/>
            </div>
            <Button variant="contained" color="primary"
                    onClick={buildScatterplotClick}>
                Построить диаграмму
            </Button>
        </Paper>
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
    </div>;
    return <PageContent sidebarContent={sidebarContent}
                        mainContent={mainContent}/>
}