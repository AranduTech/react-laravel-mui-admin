
import route from './route';
import axios from 'axios';
import React from 'react';

import { Dashboard, Widget, WidgetData } from './types/dashboard';
import { FormState } from './types/form';
import bi from './bi';
import dialogService from './internals/singletons/Dialog';
import { useTranslation } from 'react-i18next';

export type UseDashboardOptions = {
    filter?: FormState,
    debug?: boolean,
}

export default (dashboard: string, opts: UseDashboardOptions = {}) => {

    const { t } = useTranslation();

    const { filter, debug = false } = opts;

    const [data, setData] = React.useState<Dashboard|null>(null);
    const [widgets, setWidgets] = React.useState<WidgetData[]>([]);

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<unknown>(null);

    const download = React.useCallback(async () => {
        dialogService.create({
            type: 'confirm',
            title: t('dashboard.export.title') as string,
            message: t('dashboard.export.message'),
            confirmText: t('yes') as string,
            cancelText: t('no') as string,
        }).then(async (result) => {
            if (result) {
                bi().download(dashboard, filter);
            }
        });
    }, []);

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
        download,
        loading, 
        error 
    };
};





