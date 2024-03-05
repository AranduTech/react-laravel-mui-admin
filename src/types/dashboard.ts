
import { Grid2Props } from '@mui/material';

export interface Dashboard {
    id: string;
    name: string;
    widgets: Widget[];
}

export interface Widget {
    uri: string;
    groups: Dimension[];
    values: Dimension[];
    xAxis: Dimension[];
    title: string;
    layout: WidgetLayout;
}

export type WidgetData = Widget & {
    data: any[];
};

export interface Dimension {
    key: string;
    name: string;
    alias?: string;
    type: string;
}

export interface WidgetLayout {
    type: string | string[];
    grid?: Grid2Props;
    [key: string]: any;
}
