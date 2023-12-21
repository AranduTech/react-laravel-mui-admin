import React from 'react';

import Grid, { Grid2Props } from '@mui/material/Unstable_Grid2';

import useDashboard from '../useDashboard';
import Widget from './Widgets/Widget';

export type DashboardProps = {
    name: string;
    debug?: boolean;
} & Grid2Props;

const Dashboard = ({ name, debug = false, ...props }: DashboardProps) => {

    const { dashboard, widgets } = useDashboard(name, { debug });

    return (
        <Grid container spacing={2} {...props}>
            <Grid xs={12}>
                {dashboard?.name}
            </Grid>
            {widgets.map((widget) => (
                <Widget 
                    key={widget.uri}
                    debug={debug}
                    {...widget}
                />
            ))}
        </Grid>
    );
    
};


export default Dashboard;

