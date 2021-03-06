import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PageContent from "./PageContent";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: 300
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default function MainPage() {
    const classes = useStyles();

    const mainContent =
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        Определение распределения значений биохимических показателей по возрастам</Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>Определение распределения значений биохимических показателей по диагнозам</Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>Визуализация характера взаимосвязи биохимических показателей</Paper>
                </Grid>                <Grid item xs={6}>
                    <Paper className={classes.paper}>Визуализация закона распределения значений биохимических показателей</Paper>
                </Grid>
            </Grid>
        </div>;
    return <PageContent pageName='Навигация' sidebarContent={null} mainContent={mainContent} />
}