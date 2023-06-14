// Imports
import { TextFieldProps as MuiTextFieldProps } from '@mui/material';


// Primitive Value
type PrimitiveValue = string | number | boolean | null;

// Valid Key Value
type ValidKeyValue = PrimitiveValue | Date | File | FileList;

// Form Value
export type FormValue = ValidKeyValue | Array<ValidKeyValue | FormState> | FormState;

// Sanitize Input Callback
type SanitizeInputCallback<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => FormValue;

// Input Props
export interface InputProps {
    name: string;
    value: string | number | Date | null;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
export interface AutocompleteProps {
    // name: string;
    value: object | object[];
    onChange: Function;
    isOptionEqualToValue: Function;
    renderInput: Function;
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
export type AutocompletePropsCallback = (key: string, options: AutocompletePropsOptions) => AutocompleteProps;

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
    autocompleteProps: AutocompletePropsCallback;
    errors: object;
    state: [FormState, SetPropCallback];
    isSubmitting: boolean;
}

export interface FormError {
    key: string;
    message: string;
}

export interface UseFormOptions {
    initialValues?: FormState;
    onSubmit?: (data: FormState, setErrors: (errors: FormError[]) => void) => Promise<any>;
    validate?: (data: FormState) => FormError[];
    validateOnInputChange?: boolean;
    preventDefault?: boolean;
    onChange?: (newData: FormState) => void;
    debug?: boolean;
    onError?: (error: any) => void;
    action?: string;
    method?: string;
    onSuccess?: (response: any) => void;
    transformPayload?: (payload: FormState) => any;
    preventStructureChange?: boolean;
}