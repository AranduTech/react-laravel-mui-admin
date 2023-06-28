import React from 'react';

import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MuiDrawer, { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';

import Icon from './Icon';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import RecursiveList from './RecursiveList';
import { MenuItem } from '../types/menu';
import blade from '../blade';
import route from '../route';

const drawerWidth = 280;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(9)} + 1px)`,
    [theme.breakpoints.up('sm')]: { width: `calc(${theme.spacing(10)} + 1px)` },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface DrawerProps extends MuiDrawerProps {
    open?: boolean;
}

const DrawerFooter = styled(
    Box,
    { shouldForwardProp: (prop) => prop !== 'open' },
)<DrawerProps>(({ theme, open }) => ({
    // position: 'absolute',
    // bottom: 0,
    flexShrink: 0,
    ...open && openedMixin(theme),
    ...!open && closedMixin(theme),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(
    MuiAppBar,
    { shouldForwardProp: (prop) => prop !== 'open' },
)<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
}));

const Drawer = styled(
    MuiDrawer,
    { shouldForwardProp: (prop) => prop !== 'open' },
)(({ theme, open }) => ({
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    },
    ...!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    },
}));

export interface SideMenuLayoutProps {
    navMenuItems: MenuItem[];
    bottomMenuItems?: MenuItem[];
    children: React.ReactNode;
}

const SideMenuLayout = ({ navMenuItems, bottomMenuItems, children }: SideMenuLayoutProps) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const { t } = useTranslation();

    const { name: userName } = React.useMemo(() => blade('user'), []);
    const blockUi = React.useMemo(() => blade('block-ui') === '1', []);

    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const AppBarComponent = React.useMemo(() => isTablet
        ? AppBar
        : MuiAppBar, [isTablet]);

    const DrawerComponent = React.useMemo(() => isTablet
        ? Drawer
        : MuiDrawer, [isTablet]);

    return (
        <Box sx={{ display: 'flex' }}>
            {/* <CssBaseline /> */}
            <AppBarComponent
                position="fixed"
                open={open}
            >
                <Toolbar>
                    {(!isTablet || !open) && (
                        <IconButton
                            color="inherit"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ mr: { md: 2 } }}
                        >
                            <Icon name="menu" />
                        </IconButton>
                    )}

                    <Typography
                        width="100%"
                        variant="h6"
                        noWrap
                        component="div"
                    >
                        {document.title}
                    </Typography>
                </Toolbar>
            </AppBarComponent>
            <DrawerComponent
                variant={isTablet ? 'permanent' : 'temporary'}
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{ sx: { width: drawerWidth } }}
                sx={{
                    display: 'flex',
                    direction: 'flex-column',
                    flexWrap: 'nowrap',
                    height: '100%',
                }}
            >
                <DrawerHeader sx={{ flexShrink: 0 }}>
                    <Button
                        component={Link}
                        to={route('profile')}
                        sx={{ pr: 2 }}
                        onClick={() => !isTablet && setOpen(false)}
                    >
                        <Avatar
                            alt={userName}
                            src=""
                            sx={{ margin: '0 10px 0 0' }}
                        >
                            {userName?.charAt(0)}
                        </Avatar>
                        <Typography
                            variant="body2"
                            sx={{ margin: 'auto' }}
                        >
                            {userName.split(' ')[0]}
                        </Typography>

                    </Button>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl'
                            ? <Icon name="chevronRight" />
                            : <Icon name="chevronLeft" />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                    {!blockUi && (
                        <RecursiveList
                            collapsed={!open && isTablet}
                            items={navMenuItems}
                            onClick={() => !isTablet && setOpen(false)}
                        />
                    )}
                </Box>

                {bottomMenuItems && (
                    <DrawerFooter open={open}>
                        <RecursiveList
                            collapsed={!open && isTablet}
                            items={bottomMenuItems}
                            sx={{ pt: 0 }}
                        />
                    </DrawerFooter>
                )}

            </DrawerComponent>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 1, sm: 2, md: 3 },
                }}
            >
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
};

// SideMenuLayout.propTypes = {
//     navMenuItems: RecursiveList.propTypes.items.isRequired,
//     bottomMenuItems: RecursiveList.propTypes.items,
//     children: PropTypes.node,
// };

export default SideMenuLayout;

