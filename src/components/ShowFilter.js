import React, {useState} from 'react';
import {Button, Checkbox, FormControlLabel} from "@material-ui/core";
import Filter from "./Filter";
import SimpleDialog from "./SimpleDialog";
import LabelCheckbox from "./LabelCheckbox";

export default function ShowFilter({
                                       filter,
                                       selectedFilters,
                                       useFilter,
                                       useFilterChange,
                                       onFilterChange,
                                       onSelectedFilterChange
                                   }) {
    const [showFilter, setShowFilter] = useState(false);
    const filterComponent = <Filter filter={filter} selectedFilters={selectedFilters} filterChange={onFilterChange}
                                    selectedFilterChange={onSelectedFilterChange}/>;
    return <>
        <Button style={{marginRight: 10}} variant="contained" onClick={() => {
            setShowFilter(true);
        }}>Настройки</Button>
        <LabelCheckbox checked={useFilter} label={'Фильтр'} onChange={useFilterChange}/>
        {showFilter && <SimpleDialog title='Фильтр' content={filterComponent} onClose={() => setShowFilter(false)}/>
        }
    </>
}