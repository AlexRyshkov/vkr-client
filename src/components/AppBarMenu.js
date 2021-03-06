import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function AppBarMenu({route, onItemClick, isSelected}) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const itemClick = (label, routePath) => {
        onItemClick(label, routePath);
        handleClose();
    };

    const subRoutes = route.subRoutes;

    // console.log(isSelected);
    return (
        <div>
            <Button aria-controls="simple-menu" color="inherit" aria-haspopup="true" onClick={handleClick}
                    style={isSelected ? {borderBottom: '1px solid white'} : {}}>
                {route.label}
            </Button>
            <Menu
                id="simple-menu"
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {subRoutes && subRoutes.map((subRoute, index) => <MenuItem key={index}
                                                                           onClick={() => {
                                                                               itemClick(subRoute.label, route.path + subRoute.path)
                                                                           }}>{subRoute.label}</MenuItem>)}
            </Menu>
        </div>
    );
}
