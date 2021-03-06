import React from 'react';
import PageContent from "./PageContent";
import { useParams } from "react-router-dom";
import PatientsInfo from "../components/PatientsInfo";


export default function DataImportPage() {
    const mainContent = <form action="http://localhost:5000/api/upload" method="POST"
        enctype="multipart/form-data">
        <input style={{display: 'block', width:'300px', heigth: 200}} type="file" name="file" />
        <input type="submit" />
    </form>;
    return <PageContent pageName='Выбор файла' sidebarContent={null} mainContent={mainContent} />
}