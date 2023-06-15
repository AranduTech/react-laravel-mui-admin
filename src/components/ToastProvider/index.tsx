import React from 'react';

// import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';

import Transition from './Transition';

import toastService from '../../internals/singletons/Toast';

import { ToastOptions } from '../../toast';
import Icon from '../Icon';

interface ToastMessage extends ToastOptions {
    key: string;
}

const ToastProvider = () => {
    const [messageInfo, setMessageInfo] = React.useState<ToastMessage | undefined>(undefined);

    React.useEffect(() => {
        toastService.onShow = (message: ToastMessage) => {
            setMessageInfo(message);
        };
        toastService.onClose = () => {
            setMessageInfo(undefined);
        };
        return () => {
            toastService.onShow = null;
            toastService.onClose = null;
        };
    }, []);

    const handleClose = (_event: any, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setMessageInfo(undefined);
    };

    return (
        <Snackbar
            key={messageInfo ? messageInfo.key : undefined}
            open={!!messageInfo}
            autoHideDuration={messageInfo?.timeout || 10000}
            onClose={handleClose}
            TransitionComponent={Transition}
            TransitionProps={{ onExited: handleClose }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            action={
                <IconButton
                    // aria-label="close"
                    color="inherit"
                    sx={{ p: 0.5 }}
                    onClick={handleClose}
                >
                    <Icon name="close" />
                </IconButton>
            }
        >
            <Alert
                onClose={handleClose}
                severity={messageInfo ? messageInfo.type : 'info'}
                sx={{ width: '100%', whiteSpace: 'break-spaces' }}
                variant="filled"
            >
                {messageInfo ? messageInfo.message : undefined}
            </Alert>
        </Snackbar>
    );
};

export default ToastProvider;

