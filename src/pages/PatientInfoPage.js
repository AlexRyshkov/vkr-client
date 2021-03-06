import React from 'react';
import PageContent from "./PageContent";
import {useParams} from "react-router-dom";
import PatientsInfo from "../components/PatientsInfo";


export default function PatientInfoPage() {
    const {id} = useParams();
    const mainContent = <PatientsInfo patient_id={id}/>;
    return <PageContent pageName='Информация о пациенте' sidebarContent={null} mainContent={mainContent}/>
}