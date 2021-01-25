import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import axios from 'axios'
import format from "date-fns/format"
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import { makeStyles } from '@material-ui/core/styles';

function App() {
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [data, setData] = React.useState({ title: '', url: '', explanation: '' })
    const useStyles = makeStyles({
        root: {
            maxWidth: 800,
            justifyContent: 'center',
            alignItems: 'center',
        },
        media: {
            height: 600,
        },
        box: {
            alignContent: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }
    });

    const classes = useStyles();
    React.useEffect(() => {
        onDateSelect(new Date())
    }, []);

    async function onDateSelect(date) {
        setSelectedDate(date)
        let base_url = 'https://api.nasa.gov/planetary/apod'
        var data = require('./token.json');
        const resp = await axios.get(base_url, {
            params: {
                api_key: data['token'],
                date: format(selectedDate, 'yyyy-MM-dd'),
            }
        })
        setData({
            url: resp.data.url,
            title: resp.data.title,
            explanation: resp.data.explanation
        })

    }

    return (
        <Box className={classes.box}>
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={data.url}
                        title="Space Image"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {data.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {data.explanation}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-around">
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="Date picker dialog"
                                format="yyyy-MM-dd"
                                value={selectedDate}
                                onChange={onDateSelect}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                </CardActions>
            </Card>
        </Box>
    )
}

export default App;
