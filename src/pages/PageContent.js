import React from 'react'
import {Drawer, Toolbar, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import SimpleBreadcrumbs from "../components/Breadcrumbs";

const drawerWidth = 550;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    sidebar: {
        width: drawerWidth,
        flexShrink: 0,
        zIndex: 999
    },
    sidebarPaper: {
        width: drawerWidth,
    },
    sidebarContent: {
        overflow: 'hidden',
        padding: theme.spacing(2),
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        width: `calc(100vw - ${drawerWidth}px)`,
        height: `100vh`,
        padding: theme.spacing(3),
    },
}));

export default function PageContent({pageName, sidebarContent, mainContent}) {
    const classes = useStyles();
    return <div className={classes.root}>
        {sidebarContent && <Drawer
            className={classes.sidebar}
            variant="permanent"
            classes={{
                paper: classes.sidebarPaper,
            }}>
            <Toolbar/>
            <div className={classes.sidebarContent}>
                {pageName &&
                <Typography variant="h5" gutterBottom>{pageName}</Typography>
                }
                {sidebarContent}
            </div>
        </Drawer>}
        <main className={classes.content}>
            <Toolbar/>
            {!sidebarContent &&
            <Typography variant="h5" gutterBottom>{pageName}</Typography>}
            {mainContent}
        </main>
    </div>;
}