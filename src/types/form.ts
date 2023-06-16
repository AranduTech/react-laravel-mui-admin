// Imports
import { AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteRenderInputParams, TextFieldProps as MuiTextFieldProps, SelectChangeEvent } from '@mui/material';
import { ModelField } from './model';
import { ReactNode } from 'react';
import { Method } from 'axios';


// Primitive Value
type PrimitiveValue = string | number | boolean | null;

// Valid Key Value
type ValidKeyValue = PrimitiveValue | Date | File | FileList;

// Form Value
export type FormValue = ValidKeyValue | Array<ValidKeyValue | FormState> | FormState;

// Sanitize Input Callback
type SanitizeInputCallback<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => FormValue;

type InputChangeEventHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void;
type SelectChangeEventHandler = (event: SelectChangeEvent<string | number | Date | null>, child: React.ReactNode) => void;

// Input Props
export interface InputProps {
    name: string;
    value: string | number | Date | null;
    onChange: InputChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}
// Input Props Callback
export type InputPropsCallback = (key: string, sanitizeFn?: SanitizeInputCallback<HTMLInputElement | HTMLSelectElement>) => InputProps;

// TextField Props
export interface TextFieldProps {
    name: string;
    value: string | number | Date | null;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    error?: boolean;
    helperText?: string;
}

// TextField Props Callback
export type TextFieldPropsCallback = (key: string, sanitizeFn?: SanitizeInputCallback<HTMLInputElement | HTMLTextAreaElement>) => TextFieldProps;

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
    isOptionEqualToValue: (option: object, value: object) => boolean;
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
    inputProps: InputPropsCallback;
    checkProps: CheckPropsCallback;
    textFieldProps: Function;
    autocompleteProps: AutocompletePropsCallback<any>;
    errors: FormError[];
    state: [FormState, React.Dispatch<React.SetStateAction<FormState>>];
    isSubmitting: boolean;
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
}

export interface FormFieldProps {
    form: UseFormTools;
    field: ModelField;
}