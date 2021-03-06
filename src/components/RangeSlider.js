import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';


export default function RangeSlider({text, rangeValue, onChange}) {
    const handleChange = (event, newValue) => {
        onChange(newValue);
    };

    return (
        <div>
            <Typography id="range-slider" style={{marginBottom: 35}}>
                {text}
            </Typography>
            <Slider
                valueLabelDisplay="on"
                style={{width:450, marginLeft:20}}
                value={rangeValue}
                onChange={handleChange}
                marks={[
                    {value: 0, label: '0 лет'},
                    {value: 100, label: '100 лет'},
                ]}
            />
        </div>
    );
}