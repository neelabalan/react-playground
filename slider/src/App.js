import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
    root: {
        width: 300,
    },
});

export default function App() {
    const classes = useStyles();
    const [width, setWidth] = useState(200)

    const handleChange = (event, newValue) => {
        setWidth(newValue);
    };

    return (
        <div className={classes.root}>
            <Typography id="discrete-slider" gutterBottom>
                Rick Image Slider 
            </Typography>
            <Slider
                onChange = {handleChange}
                defaultValue={200}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={20}
                marks
                min={200}
                max={300}
            />
            <img src="https://www.freepnglogos.com/uploads/rick-and-morty-png/rick-and-morty-non-toxic-rick-sanchez-18.png" alt="Rick Sanchez" width={width} height={width}></img>
        </div>
    );
}
