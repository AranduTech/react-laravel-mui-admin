
import React from 'react';

import { WidgetProps } from './Widget';
import { Typography } from '@mui/material';
import config from '../../config';


const Kpi = (props: WidgetProps) => {
    if (props.debug) {
        console.log(props);
    }

    const { 
        format: { 
            locale = document.documentElement.lang || config('lang.fallbackLng', 'en'),
            options = { maximumSignificantDigits: 3 }
        } = {},
    } = props.layout;

    return (
        <>
            <Typography>
                {props.title}
            </Typography>
            
            {(props.values || []).map(({ key, alias = key }, index) => {
                if (
                    props.data[index]
                    && alias in props.data[index]
                    && typeof props.data[index][alias] === 'number'
                ) {
                    const value = props.data[index][alias].toLocaleString(
                        locale, 
                        options
                    );

                    return (
                        <h1 key={alias}>{value}</h1>
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