
import route from './route';
import axios from 'axios';
import React from 'react';
import { Dashboard, Widget, WidgetData } from './types/dashboard';

export type UseDashboardOptions = {
    debug?: boolean,
}

export default (dashboard: string, opts: UseDashboardOptions = {}) => {

    const { debug = false } = opts;

    const [data, setData] = React.useState<Dashboard|null>(null);
    const [widgets, setWidgets] = React.useState<WidgetData[]>([]);

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<unknown>(null);
 

    React.useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data: response } = await axios(route('admin.bi', { dashboard }));
                setData(response);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [dashboard]);

    React.useEffect(() => {
        if (data) {
            if (debug) {
                console.log('dashboard data changed', data);
            }

            const widgetUris = data.widgets.map(widget => widget.uri);

            widgetUris.forEach((uri) => {
                axios(route('admin.bi.data', { dashboard, widget: uri })).then(({ data: response }) => {
                    if (debug) {
                        console.log('got widget data', uri, response);
                    }
                    setWidgets((widgets) => [
                        ...widgets.filter((widget) => widget.uri !== uri),
                        {
                            ...(data.widgets.find((widget) => widget.uri === uri) as Widget),
                            data: response as any[], 
                        },
                    ].sort((a, b) => widgetUris.indexOf(a.uri) - widgetUris.indexOf(b.uri)));
                });
            });
        }
    }, [data]);


    return { 
        dashboard: data,
        widgets,
        loading, 
        error 
    };

};





