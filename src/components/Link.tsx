import React from 'react';
import MuiLink, { LinkTypeMap } from '@mui/material/Link';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';

import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

export type LinkProps = DefaultComponentProps<LinkTypeMap> & RouterLinkProps;

const Link = React.forwardRef(({ to, children, ...props }: LinkProps, ref: any) => (
    <MuiLink
        component={RouterLink}
        to={to}
        ref={ref}
        sx={{ textDecoration: 'none' }}
        {...props}
    >
        {children}
    </MuiLink>
));

Link.displayName = 'Link';

export default Link;

