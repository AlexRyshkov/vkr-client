import {Checkbox, FormControlLabel} from "@material-ui/core";
import React from "react";


export default function LabelCheckbox({name, onChange, checked, label}) {
    return <FormControlLabel
        control={
            <Checkbox
                name={name}
                onChange={onChange}
                checked={checked}
                color="primary"
            />
        }
        label={label}
    />;
}

