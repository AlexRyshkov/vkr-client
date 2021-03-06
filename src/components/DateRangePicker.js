import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {ru} from "date-fns/locale";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from 'moment';

export default function DateRangePicker({dateRange, onDateChange}) {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ru}>
            <KeyboardDatePicker
                style={{width:200}}
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                label="Начало"
                value={dateRange.startDate}
                onChange={(date) => {
                    const parsedDate = moment(date).isValid()
                        ? moment(date).format('YYYY-MM-DD')
                        : '';
                    onDateChange({...dateRange, startDate: parsedDate});
                }}
            />
            <KeyboardDatePicker
                style={{width:200, marginLeft: 20}}
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                label="Конец"
                value={dateRange.endDate}
                onChange={(date) => {
                    const parsedDate = moment(date).isValid()
                        ? moment(date).format('YYYY-MM-DD')
                        : '';
                    onDateChange({...dateRange, startDate: parsedDate});
                }}
            />
        </MuiPickersUtilsProvider>
    );
}
