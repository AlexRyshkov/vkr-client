import React, {useState} from 'react';
import SimpleDialog from "./SimpleDialog";
import PatientsInfo from "./PatientsInfo";

export default function ShowPatientInfo({patient_id, onDialogClose}) {
    return <>
        <SimpleDialog title='Информация о пациенте'
                      content={<PatientsInfo patient_id={patient_id}/>}
                      onClose={() => onDialogClose()}/>
    </>
}