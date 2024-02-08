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
            
            {(props.values || []).map(({ key, alias = key }, index) => {
                if (
                    props.data[index]
                    && alias in props.data[index]
                    && props.data[index][alias]
                ) {
                    return (
                        <h1 key={alias}>{props.data[index][alias]}</h1>
                    );
                }
                return (
                    <h1 key={alias}>-</h1>
                )
            })}
            
        </>
    );
};


export default Kpi;