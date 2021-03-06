import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {DialogContent} from "@material-ui/core";

const styles = makeStyles((theme) => ({
    dialog: {}
}));

export default function SimpleDialog({title, content, onClose}) {
    const classes = styles();
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    return (
        <Dialog className={classes.dialog} onClose={handleClose} open={open}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
        </Dialog>
    );
}