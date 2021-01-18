import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles(theme => ({
    root: {
        boxShadow: 'none'
    },

    form: {
        maxWidth: '400px',
        margin: '0 auto'
    }
}));

export default function TabPanel(props) {
    const classes = useStyles();
    const { panels } = props;
    const [activePanelIndex, setActivePanelIndex] = useState(0);

    function handleChangeTab(event, newValue) {
        setActivePanelIndex(newValue);
    }

    return <>
        <AppBar position='static' color='default' className={classes.root}>
            <Tabs
                value={activePanelIndex}
                onChange={handleChangeTab}
                indicatorColor='primary'
                textColor='primary'
                variant='scrollable'
                scrollButtons='auto'
            >
                {panels.map((config, index) => (
                    <Tab key={index} label={config.title} />
                ))}
            </Tabs>
        </AppBar>

        {
            panels.map((config, index) => (
                index === activePanelIndex && (
                    <div key={index}>
                        <config.component {...config.componentConfig} />
                    </div>
                )
            ))
        }
    </>;
}