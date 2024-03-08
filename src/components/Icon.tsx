import React from 'react';

import config from '../config';

import { DefaultComponentProps } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';

export type IconProps = DefaultComponentProps<SvgIconTypeMap> & {
    name: string;
}

/**
 * Componente Icon.
 *
 * Utiliza os ícones do Material UI a partir de um nome.
 *
 * Importe e acrescente os ícones que deseja utilizar no objeto IconsAvailable.
 *
 */
const Icon = ({ name, ...props }: IconProps) => {
    const Icon = React.useMemo(() => config(`icons.${name}`), [name]);

    if (!Icon) {
        return null;
    }

    if (typeof Icon === 'string') {
        return (
            <img 
                src={Icon} 
                alt={name} 
                {...props as React.ImgHTMLAttributes<HTMLImageElement>} 
            />
        );
    }

    return <Icon {...props} />;
};

export default Icon;
