import {Card, CardContent, List, ListItem} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import SimpleDialog from "./SimpleDialog";
import React, {useEffect, useState} from "react";
import {getPatient} from "../Api";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    body: {
        fontSize: 16,
        marginTop: 10
    }
}));

export default function PatientsInfo({patient_id}) {
    const classes = useStyles();
    const [patient, setPatient] = useState(null);
    const [sample, setSample] = useState(null);
    useEffect(() => {
        getPatient(patient_id).then(res => {
            let patient = res.data.patient;
            patient = {...patient, gender: patient.gender === 'm' ? 'Мужской' : 'Женский'};
            console.log(patient);
            setPatient(patient);
        });
    }, []);

    const onSampleClick = (sample) => {
        setSample(sample);
    }

    return <div>{patient && <Card>
        <CardContent>
            <Typography className={classes.body} component="p">
                ID пациента: {patient.patient_id}
            </Typography>
            <Typography className={classes.body} component="p">
                Дата рождения: {patient.birth_date}
            </Typography>
            <Typography className={classes.body} component="p">
                Пол: {patient.gender}
            </Typography>
            <Typography className={classes.body} component="p">
                Диагнозы: {patient.diagnoses.map(diagnose => diagnose.code).join(', ')}
            </Typography>
            <Typography style={{marginTop: 20}} variant="h5" component="h2">
                История анализов
            </Typography>
            <List>
                {patient.samples.map(sample => {
                    return <ListItem key={sample.id} onClick={() => onSampleClick(sample)} style={{fontSize: 16}}
                                     button>{sample.date} - {sample.type === 'cbc' ? 'Общий анализ крови' : 'Биохимический анализ крови'}</ListItem>
                })}
            </List>
            {sample && <SimpleDialog
                title={`${sample.date} - ${sample.type === 'cbc' ? 'Общий анализ крови' : 'Биохимический анализ крови'}`}
                content={sample.results.map((result, index) => <Typography key={index}
                                                                           className={classes.body}>{result.test.name + ' ' + result.result}</Typography>)}
                onClose={() => setSample(null)}
            />}
        </CardContent>
    </Card>}</div>;
}