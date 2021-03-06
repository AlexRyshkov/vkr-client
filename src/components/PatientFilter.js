import React, { useEffect, useState } from 'react';
import ItemsSelectPopover from "./MultipleSelect";
import RangeSlider from "./RangeSlider";
import { Box, Card, FormLabel, Paper } from "@material-ui/core";
import DateRangePicker from "./DateRangePicker";
import { getDepartments, getDiagnoses, getMkb } from "../Api";
import LabelCheckbox from "./LabelCheckbox";
import MultipleSelect from "./MultipleSelect";
import Divider from '@material-ui/core/Divider';
import { Label } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";


export default function PatientFilter({ filter, selectedFilters, filterChange, selectedFilterChange, useFilter, setUseFilter }) {
    const [departments, setDepartments] = useState(null);
    const [diagnoses, setDiagnoses] = useState(null);

    useEffect(() => {
        getDepartments().then(res => {
            setDepartments(res.data.departments);
        });
        getDiagnoses().then(res => {
            setDiagnoses(res.data.diagnoses);
        });
    }, []);

    useEffect(() => {
        filterChange(filter);
    }, [filter]);

    useEffect(() => {
        selectedFilterChange(selectedFilters);
    }, [selectedFilters]);

    const onFilterChange = (name, value) => {
        filterChange({
            ...filter,
            [name]: value
        });
    }

    if (departments != null & diagnoses != null) {
        return <div>
            <Paper style={{ padding: 10, background: 'rgb(197 223 255)' }}>
                <Typography variant='h5' style={{ marginTop: 10, marginBottom: 10 }}>Настройки фильтрации</Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <LabelCheckbox label='Фильтр по подразделениям' checked={selectedFilters.departments}
                        onChange={(e) => selectedFilterChange({
                            ...selectedFilters,
                            departments: e.target.checked
                        })} />
                    <MultipleSelect name='departments' items={departments} displayFields={['name']}
                        selected={filter.departments}
                        onSelectedItemsChanged={onFilterChange} placeholder={'Выбрать подразделения...'} />
                </div>
                <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <LabelCheckbox label='Фильтр по диагнозам' checked={selectedFilters.diagnoses}
                        onChange={(e) => selectedFilterChange({
                            ...selectedFilters,
                            diagnoses: e.target.checked
                        })} />
                    <MultipleSelect name='diagnoses' items={diagnoses} displayFields={['name']}
                        selected={filter.diagnoses}
                        onSelectedItemsChanged={onFilterChange} placeholder={'Выбрать диагнозы...'} />
                </div>
                <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                <Box />
                <Typography style={{ color: 'black' }}>Пол: </Typography>
                <LabelCheckbox name='genders' label='Мужской' checked={filter.genders.m}
                    onChange={(e) => onFilterChange(e.target.name, {
                        ...filter.genders,
                        m: e.target.checked
                    })} />
                <LabelCheckbox name='genders' label='Женский' checked={filter.genders.f}
                    onChange={(e) => onFilterChange(e.target.name, {
                        ...filter.genders,
                        f: e.target.checked
                    })} />
                <Box />
                <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                <Box />
                <div />
                <Box />
                <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                <RangeSlider text={'Возраст:'} rangeValue={filter.ageRange}
                    onChange={(newRange) => onFilterChange('ageRange', newRange)} />
                <Box />
                <Button variant="contained" color="primary">
                    Применить
                </Button>
            </Paper>
        </div>
    } else return <></>;
}
