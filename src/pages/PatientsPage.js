import React, { useEffect, useState } from 'react';
import PageContent from "./PageContent";
import { getPatients } from "../Api";
import DataTable from "../components/DataTable";
import { useHistory } from "react-router-dom";
import PatientFilter from "../components/PatientFilter";
import { filters, usedFilters } from "../Constants";
import TextField from '@material-ui/core/TextField';

const columns = [
    { field: 'patient_id', headerName: 'ID', width: 200 },
    { field: 'gender', headerName: 'Пол', width: 100 },
    { field: 'birth_date', headerName: 'Дата рождения', width: 200 },
];

export default function PatientsPage() {
    const [patients, setPatients] = useState([]);
    const history = useHistory();
    const [filter, setFilter] = useState(filters);
    const [selectedFilters, setSelectedFilters] = useState(usedFilters);
    const [useFilter, setUseFilter] = useState(false);

    useEffect(() => {
        getPatients().then(res => {
            const patients = res.data.patients.map(patient => {
                return {
                    ...patient,
                    id: patient.id,
                    gender: patient.gender === 'm' ? 'Мужской' : 'Женский',
                };
            });
            setPatients(patients);
        });
    }, []);

    const rowDoubleClick = (e) => {
        history.push(`/data/patients/${e.row.id}`);
    };

    const sidebarContent = <div>
        <PatientFilter filter={filter} useFilter={useFilter} setUseFilter={setUseFilter}
            selectedFilters={selectedFilters}
            filterChange={(newFilter) => setFilter(newFilter)}
            selectedFilterChange={() => { }} />
    </div>;
    const mainContent = <div>
        <TextField id="standard-basic" label="Поиск по ID" variant="filled"/>
        <DataTable columns={columns} rows={patients} rowDoubleClick={rowDoubleClick} />
    </div>;
    return <PageContent pageName='Информация по пациентам' sidebarContent={sidebarContent} mainContent={mainContent} />
}