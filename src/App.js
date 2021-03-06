import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Switch, Route, useLocation } from "react-router-dom";
import { CssBaseline, AppBar, Toolbar, Button } from "@material-ui/core";
import BoxplotPage from "./pages/BoxplotPage";
import ClusteringPage from "./pages/ClusteringPage";
import PatientsPage from "./pages/PatientsPage";
import AppBarMenu from "./components/AppBarMenu";
import PatientInfoPage from "./pages/PatientInfoPage";
import SplomPage from "./pages/SplomPage";
import CorrelationPage from "./pages/CorrelationPage";
import Typography from "@material-ui/core/Typography";
import HistogramPage from "./pages/HistogramPage";
import DataImportPage from "./pages/DataImportPage";
import MainPage from "./pages/MainPage";
import SamplesResultsTablePage from "./pages/SamplesResultsTablePage";

const useStyles = makeStyles((theme) => ({
    appRoot: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function App() {
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === "/") {
            setCurrentRoute(null);
        }
    }, [location]);
    const routes = [
        {
            path: '/instruments',
            label: 'Инструменты',
            subRoutes: [
                {
                    path: '/boxplot',
                    component: <BoxplotPage />,
                    label: 'Визуализация распределения значений БП по возрастам'
                },
                {
                    path: '/splom',
                    component: <SplomPage />,
                    label: 'Визуализация распределения значений БП по диагнозам'
                },
                {
                    path: '/correlation',
                    component: <CorrelationPage />,
                    label: 'Визуализация характера взаимовлияния значений БП'
                },
                {
                    path: '/histogram',
                    component: <HistogramPage />,
                    label: 'Визуализация закона распределения значений БП'
                },
                {
                    path: '/tables/samples-results',
                    component: <SamplesResultsTablePage />,
                    label: 'Статистика по биохимическим показателям'
                }
            ]
        },

        {
        path: '/data',
        label: 'Данные',
        subRoutes: [
            {
                path: '/import',
                component: <DataImportPage />,
                label: 'Загрузка данных'
            },
            {
                path: '/patients',
                component: <PatientsPage />,
                label: 'Информация по пациентам'
            }
        ]
    },
        //     {
        //     path: '/cluster',
        //     component: <ClusteringPage/>,
        //     label: 'Кластерный анализ',
        //     subRoutes: []
        // }
    ];

    const classes = useStyles();
    const history = useHistory();
    const [currentRoute, setCurrentRoute] = useState(null);


    const changeTab = (label, route) => {
        history.push(route);
        setCurrentRoute(label);
    }

    const routeClick = (label, routePath) => {
        changeTab(label, routePath);
    };

    return (
        <div className={classes.appRoot}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        {currentRoute ?? "Главная страница"}
                    </Typography>
                    {routes.map(route => {
                        if (route.subRoutes.length === 0) {
                            return <Button key={route.label} color='inherit'
                                onClick={() => changeTab(route.label, route.path)}
                            >{route.label}</Button>
                        } else {
                            return <AppBarMenu key={route.label} route={route}
                                onItemClick={routeClick} />
                        }
                    })}
                </Toolbar>
            </AppBar>
            <Switch>
                {routes.map(route => {
                    if (route.subRoutes.length === 0) {
                        return <Route key={route.path} exact path={route.path}>{route.component}</Route>
                    } else {
                        return route.subRoutes.map(subRoute => {
                            const path = route.path + subRoute.path;
                            return <Route key={path} exact
                                path={path}>{subRoute.component}</Route>
                        });
                    }
                }
                )}
                <Route exact path='/data/patients/:id'>{<PatientInfoPage />}</Route>
                {/* <Route exact path='/'>{<MainPage />}</Route> */}
            </Switch>
        </div>);
}