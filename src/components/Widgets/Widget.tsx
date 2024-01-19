import React from 'react';

import { WidgetData } from '../../types/dashboard';

import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';

import Kpi from './Kpi';
import useApplyFilters from '../../useApplyFilters';
import macros from '../../internals/singletons/MacroService';

export type WidgetProps = {
    args?: string[];
    debug?: boolean;
} & WidgetData;


const fallback = ({ type }: { type: string }) => <p>Cannot find widget type: {type}</p>;

const Widget = ({ 
    data, uri, 
    layout: { 
        type: typeDefinition, 
        grid = { xs: 12, md: 6, lg: 4 }, 
        style = {}, 
        options = {}
    },
    debug = false, ...props
}: WidgetProps) => {

    const [selectedType, setSelectedType] = React.useState(typeof typeDefinition === 'string' 
        ? typeDefinition 
        : typeDefinition[0]);


    const [type, argumentList] = selectedType.split(':');
    const args = argumentList ? argumentList.split(',') : [];

    const WidgetTypeMap: { [type: string]: any } = useApplyFilters(
        'widget_type_component_map', 
        {
            'kpi': Kpi,
        }
    );

    const Component = useApplyFilters(
        'widget_get_component', 
        WidgetTypeMap[type] || fallback,
        { type, uri }
    );


    return (
        <Grid {...grid}>
            <Card sx={{ p: 2 }}>
                {typeof typeDefinition !== 'string' && (
                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                        {typeDefinition.map((type: string) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                )}

                <Component 
                    uri={uri}
                    type={type}
                    data={data}
                    style={style}
                    options={options}
                    args={args}
                    debug={debug}
                    {...props}
                />
            </Card>
        </Grid>

    );
};

export default Widget;

