import { ListItemButtonProps, ListItemProps } from "@mui/material";

export interface MenuItem {
    key: string | number;
    text: string;
    icon?: string;
    ListItemProps?: ListItemProps;
    ListItemButtonProps?: ListItemButtonProps;
    children?: MenuItem[];
    element?: React.ReactNode;
    hidden?: () => boolean;
}

