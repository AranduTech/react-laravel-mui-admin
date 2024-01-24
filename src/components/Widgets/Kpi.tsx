import React from 'react';

import { WidgetProps } from './Widget';
import { Typography } from '@mui/material';


const Kpi = (props: WidgetProps) => {
    if (props.debug) {
        console.log(props);
    }

    const { 
        format: { 
            locale = undefined, 
            options = {} 
        }
    } = props.layout.options;

    return (
        <>
            <Typography>
                {props.title}
            </Typography>
            
            {props.values.map(({ key, alias = key }, index) => {
                const value = props.data[index][alias].toLocaleString(
                    locale, 
                    options
                );

                return (
                    <h1 key={alias}>
                        {value}
                    </h1>
                );
            })}
        </>
    );
};


export default Kpi;