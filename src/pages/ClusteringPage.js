import React, {useEffect, useState} from 'react';
import PageContent from "./PageContent";
import {makeStyles} from "@material-ui/core/styles";
import {Button, FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {getClusterData, getTests} from "../Api";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import Scatter3D from "../components/Scatter3D";
import Alert from "@material-ui/lab/Alert";
import ShowFilter from "../components/ShowFilter";
import {filters, usedFilters} from "../Constants";

const CancelToken = axios.CancelToken;
let cancel;

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: '90%'
    },
    sidebarItem: {
        margin: theme.spacing(2),
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
    },
    filter: {
        minWidth: 360,
        minHeight: 300
    }
}));

export default function ClusteringPage() {
    const classes = useStyles();
    const [scatterData, setScatterData] = useState();
    const [tests, setTests] = useState();
    const [test1, setTest1] = useState('');
    const [test2, setTest2] = useState('');
    const [test3, setTest3] = useState('');
    const [clustersCount, setClustersCount] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const [useFilter, setUseFilter] = useState(false);
    const [filter, setFilter] = useState(filters);
    const [selectedFilters, setSelectedFilters] = useState(usedFilters);

    useEffect(() => {
        getTests().then(res => {
            let tests = res.data.tests;
            tests.sort((a, b) => a.results_count < b.results_count ? 1 : -1)
            setTests(tests);
        });
    }, []);

    const validateData = () => {
        let errors = [];
        if (test1.length === 0 || test2.length === 0 || test3.length === 0) {
            errors.push('Не указаны тесты');
        } else if (new Set([test1, test2, test3]).size !== 3) {
            errors.push('Нужно указать разные тесты');
        }
        return errors;
    }

    const onTest1Change = (e) => {
        const test = tests.filter(test => test.id === e.target.value)[0];
        setTest1(test);
    }

    const onTest2Change = (e) => {
        const test = tests.filter(test => test.id === e.target.value)[0];
        setTest2(test);
    }

    const onTest3Change = (e) => {
        const test = tests.filter(test => test.id === e.target.value)[0];
        setTest3(test);
    }

    const onBuildScatterClick = async () => {
        let errors = validateData();
        if (errors.length > 0) {
            setErrors(errors);
            return;
        }
        setIsLoading(true);

        let filters = {};
        if (useFilter) {
            for (const [key, value] of Object.entries(filter)) {
                if (selectedFilters[key]) {
                    filters[key] = filter[key];
                }
            }
        }
        let response = await getClusterData({
                testId1: test1.id,
                testId2: test2.id,
                testId3: test3.id,
                clustersCount: clustersCount,
                filter: filters
            },
            new CancelToken(function executor(c) {
                cancel = c;
            })
            )
        ;
        if (axios.isCancel(response)) {
            setIsLoading(false);
            return;
        }

        setScatterData(response.data);
        setIsLoading(false);
    }

    const onClusterCancel = () => {
        cancel();
    }

    const selectedFiltersChange = (selectedFilters) => {
        setSelectedFilters(selectedFilters);
    }

    const sidebarContent = <div>

        <ShowFilter filter={filter} selectedFilters={selectedFilters} useFilter={useFilter}
                    useFilterChange={(e) => setUseFilter(e.target.checked)}
                    onFilterChange={(newFilter) => setFilter(newFilter)}
                    onSelectedFilterChange={selectedFiltersChange}/>
        <div className={classes.sidebarItem}>
            <FormControl className={classes.formControl}>
                <InputLabel>Первый показатель</InputLabel>
                <Select
                    style={{maxWidth: 300}}
                    value={test1 ? test1.id : ''}
                    onChange={onTest1Change}
                >
                    {tests && tests.map(test => <MenuItem key={test.id}
                                                          value={test.id}>{`${test.name} (${test.results_count})`}</MenuItem>)}
                </Select>
            </FormControl>
        </div>
        <div className={classes.sidebarItem}>
            <FormControl className={classes.formControl}>
                <InputLabel>Второй показатель</InputLabel>
                <Select
                    style={{maxWidth: 300}}
                    value={test2 ? test2.id : ''}
                    onChange={onTest2Change}
                >
                    {tests && tests.map(test => <MenuItem key={test.id}
                                                          value={test.id}>{`${test.name} (${test.results_count})`}</MenuItem>)}
                </Select>
            </FormControl>
        </div>
        <div className={classes.sidebarItem}>
            <FormControl className={classes.formControl}>
                <InputLabel>Третий показатель</InputLabel>
                <Select
                    style={{maxWidth: 300}}
                    value={test3 ? test3.id : ''}
                    onChange={onTest3Change}
                >
                    {tests && tests.map(test => <MenuItem key={test.id}
                                                          value={test.id}>{`${test.name} (${test.results_count})`}</MenuItem>)}
                </Select>
            </FormControl>
        </div>
        {/*<div className={classes.sidebarItem}>*/}
        {/*    <TextField*/}
        {/*        label="Количество кластеров"*/}
        {/*        type="number"*/}
        {/*        InputProps={{inputProps: {min: 2, max: 10}}}*/}
        {/*        value={clustersCount}*/}
        {/*        onChange={e => setClustersCount(e.target.value)}*/}
        {/*    />*/}
        {/*</div>*/}
        <div className={classes.sidebarItem}>
            <Button className={classes.buildChartButton} variant="contained" color="primary"
                    onClick={onBuildScatterClick}>
                Кластеризовать
            </Button>
        </div>
        <div className={classes.sidebarItem}>
            {errors.length > 0 && errors.map(error => <Alert
                severity="error">{error}</Alert>)}
        </div>
        <Backdrop className={classes.backdrop} open={isLoading}>
            <div className={classes.backdropContent}>
                <CircularProgress color="inherit"/>
                <div>
                    Кластеризация
                </div>
                <Button variant="contained" onClick={onClusterCancel}>
                    Отмена
                </Button>
            </div>
        </Backdrop>
    </div>;

    const mainContent = <div id='scatter3D' style={{flexGrow: 1}}>
        {scatterData && <Scatter3D data={scatterData}/>}
    </div>;

    return <PageContent pageName='Кластеризация' sidebarContent={sidebarContent} mainContent={mainContent}/>
}