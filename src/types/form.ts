// Imports
import { AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteRenderInputParams, Grid2Props, TextFieldProps as MuiTextFieldProps, SelectChangeEvent } from '@mui/material';
import { ReactNode } from 'react';
import { Method } from 'axios';


export interface FormFieldDefinition {
    name: string,
    type?: 'label' | 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'checkbox' | 'radio' | 'select' | 'file' | 'textarea' | 'autocomplete',
    label?: string,
    initialValue?: any,
    required?: boolean,
    disabled?: boolean,
    options?: Array<any>,
    list?: string | {},
    multiline?: boolean,
    multiple?: boolean,
    rows?: number,
    labeledBy?: string,
    valuedBy?: string,
    cached?: boolean,
    debounce?: number,
    _meta?: {
        model: string,
        schema: string,
    },
    gridItem?: Grid2Props,
    reducedColumns?: boolean,
    accept?: string,
    inputProps?: any,
    usesData?: string[],
    refreshWhileTyping?: boolean,

}


// Primitive Value
type PrimitiveValue = string | number | boolean | null;

// Valid Key Value
type ValidKeyValue = PrimitiveValue | Date | File | FileList;

// Form Value
export type FormValue = ValidKeyValue | Array<ValidKeyValue | FormState> | FormState;

// Sanitize Input Callback
type SanitizeInputCallback<T = React.ChangeEvent<HTMLInputElement>> = (event: T) => FormValue;

type InputChangeEventHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void;
type SelectChangeEventHandler = (event: SelectChangeEvent<string | number | Date | null>, child: React.ReactNode) => void;

// Input Props
export interface InputProps {
    name: string;
    value: string | number | Date | null;
    onChange: InputChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}
// Input Props Callback
export type InputPropsCallback<T = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>> = (key: string, sanitizeFn?: SanitizeInputCallback<T>) => InputProps;

// TextField Props
export interface TextFieldProps<T = React.ChangeEvent<HTMLInputElement>, U = string | number | Date | null> {
    name: string;
    value: U;
    onChange: (event: T) => void;
    error?: boolean;
    helperText?: string;
}

export interface FileFieldProps {
    name: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    helperText?: string;
}

// TextField Props Callback
export type TextFieldPropsCallback<T = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, U = string | number | Date | null> = (key: string, sanitizeFn?: SanitizeInputCallback<T>) => TextFieldProps<T, U>;

export type FileFieldPropsCallback = (key: string, sanitizeFn?: SanitizeInputCallback<React.ChangeEvent<HTMLInputElement>>) => FileFieldProps;

// Check Props
export interface CheckProps {
    name: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Check Props Callback
export type CheckPropsCallback = (key: string, sanitizeFn?: SanitizeInputCallback) => CheckProps;

// Autocomplete Props
export interface AutocompleteProps<T> {
    name: string;
    value: T | T[];
    onChange: ((event: React.SyntheticEvent<Element, Event>, value: T | T[] | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<T> | undefined) => void);
    isOptionEqualToValue?: (option: object, value: object) => boolean;
    renderInput: (params: AutocompleteRenderInputParams) => ReactNode;
}

// Autocomplete Props Options
export interface AutocompletePropsOptions {
    textFieldProps?: MuiTextFieldProps;
}

export interface FormProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | false | Promise<void | false>;
}

export type FormPropsCallback = () => FormProps;

// Autocomplete Props Callback
export type AutocompletePropsCallback<T> = (key: string, options: AutocompletePropsOptions) => AutocompleteProps<T>;

// Form State
export interface FormState {
    [key: string]: FormValue;
}

// Set Prop Callback
export type SetPropCallback = (key: string, value: FormValue) => void;

// Use Form Tools
export interface UseFormTools {
    formProps: Function;
    // inputProps: InputPropsCallback;
    inputProps<T = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>>(key: string, sanitizeFn?: SanitizeInputCallback<T>): InputProps
    checkProps: CheckPropsCallback;
    textFieldProps: TextFieldPropsCallback;
    fileFieldProps: FileFieldPropsCallback;
    selectFieldProps: TextFieldPropsCallback<SelectChangeEvent, string>;
    autocompleteProps: AutocompletePropsCallback<any>;
    setProp: SetPropCallback;
    errors: FormError[];
    state: [FormState, React.Dispatch<React.SetStateAction<FormState>>];
    isSubmitting: boolean;
    submit: (e: any) => Promise<void>;
}

export interface FormError {
    key: string;
    message: string;
}

export interface UseFormOptions {
    initialValues?: FormState;
    onSubmit?: (data: FormState, setErrors: (errors: FormError[]) => void) => boolean | void | Promise<boolean | void>;
    validate?: (data: FormState) => FormError[];
    validateOnInputChange?: boolean;
    preventDefault?: boolean;
    onChange?: (newData: FormState) => void;
    debug?: boolean;
    onError?: (error: any) => void;
    action?: string;
    method?: Method;
    onSuccess?: (response: any) => void;
    transformPayload?: (payload: FormState) => any;
    preventStructureChange?: boolean;
    formId?: string;
}

export interface FormFieldProps {
    form: UseFormTools;
    field: FormFieldDefinition;
}