import addAction from './addAction';
import addFilter from './addFilter';
import app from './app';
import applyFilters from './applyFilters';
import auth from './auth';
import bi from './bi';
import config from './config';
import dialog from './dialog';
import doAction from './doAction';
import error from './error';
import modelRepository from './modelRepository';
import removeAction from './removeAction';
import removeFilter from './removeFilter';
import route from './route';
import t from './t';
import toast from './toast';
import useAddAction from './useAddAction';
import useApiRequest from './useApiRequest';
import useApplyFilters from './useApplyFilters';
import useClearErrorsOnExit from './useClearErrorsOnExit';
import useDashboard from './useDashboard';
import useFetchItem from './useFetchItem';
import useFetchList from './useFetchList';
import useForm from './useForm';
import useModel from './useModel';
import useModels from './useModels';
import useRepositoryIndex from './useRepositoryIndex';
import usePaginatedTable from './usePaginatedTable';

import * as plugins from './plugins';
import * as components from './components';

import actions from './macros/repositoryIndex/actions';
import filters from './macros/repositoryIndex/filters';

export {
    addAction,
    addFilter,
    applyFilters,
    app,
    auth,
    bi,
    config,
    dialog,
    doAction,
    error,
    modelRepository,
    removeAction,
    removeFilter,
    route,
    plugins,
    t,
    toast,
    useAddAction,
    useApiRequest,
    useApplyFilters,
    useClearErrorsOnExit,
    useDashboard,
    useFetchItem,
    useFetchList,
    useForm,
    useModel,
    useModels,
    useRepositoryIndex,
    usePaginatedTable,
}

export const CsrfToken = components.CsrfToken;
export const Dashboard = components.Dashboard;
export const DialogProvider = components.DialogProvider;
export const Icon = components.Icon;
export const Link = components.Link;
export const Loading = components.Loading;
export const RecursiveList = components.RecursiveList;
export const RecursiveMenu = components.RecursiveMenu;
export const SideMenuLayout = components.SideMenuLayout;
export const Suspense = components.Suspense;
export const AsyncModelForm = components.AsyncModelForm;
export const ModelForm = components.ModelForm;
export const Form = components.Form;
export const FormField = components.FormField;
export const RepositoryIndex = components.RepositoryIndex;
export const ToastProvider = components.ToastProvider;
export const Widget = components.Widget;

export const macros = {
    actions,
    filters,
};
