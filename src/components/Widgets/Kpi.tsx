import React from 'react';

import { WidgetProps } from './Widget';
import { Typography } from '@mui/material';


const Kpi = (props: WidgetProps) => {
    if (props.debug) {
        console.log(props);
    }
    return (
        <>
            <Typography>
                {props.title}
            </Typography>
            
            {props.values.map(({ key, alias = key }, index) => (
                <h1 key={alias}>{props.data[index][alias]}</h1>
            ))}
            
        </>
    );
};


export default Kpi;