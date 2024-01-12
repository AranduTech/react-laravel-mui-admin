import React from 'react';

import Grid, { Grid2Props } from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';

import useDashboard from '../useDashboard';
import Widget from './Widgets/Widget';
import { FormState } from '../types/form';

export type DashboardProps = {
    name: string;
    exportable?: boolean;
    filter?: FormState;
    debug?: boolean;
} & Grid2Props;

const Dashboard = ({ name, filter, exportable, debug = false, ...props }: DashboardProps) => {

    const { dashboard, widgets, download, error } = useDashboard(name, { debug, filter });
    
    if (error) {
        console.error(error);
        return (
            <Grid container spacing={2} {...props}>
                <Grid xs={12}>
                    {`error: ${error}`}
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container spacing={2} {...props}>
            <Grid xs={12}>
                {dashboard?.name}
            </Grid>

            {exportable && (
                <Grid xs={12}>
                    <Button 
                        variant="contained"
                        onClick={download}
                    >
                        {`Exportar ${dashboard?.name}`}
                    </Button>
                </Grid>
            )}

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