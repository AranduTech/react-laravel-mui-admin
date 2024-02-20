
import { Grid2Props } from '@mui/material';

export interface Dashboard {
    id: string;
    name: string;
    widgets: Widget[];
}

export interface Widget {
    groups: Dimension[];
    values: Dimension[];
    xAxis: Dimension[];
    title: string;
    uri: string;
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
    style: WidgetLayoutStyle;
    options: WidgetLayoutOptions;
}

interface WidgetLayoutStyle {
    [key: string]: any;
}

interface WidgetLayoutOptions {
    [key: string]: any;
}
