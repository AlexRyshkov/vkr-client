import React from 'react';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    content: {margin: theme.spacing(2),}
}));

export default function BasePopover({buttonContent, content, onClose}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        if (onClose)
            onClose();
    };

    const open = Boolean(anchorEl);

    return (
        <div>
            <Button style={{width: '100%'}} variant="outlined" color="primary" onClick={handleClick}>
                {buttonContent}
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div className={classes.content}>{content}</div>
            </Popover>
        </div>
    );
}
