import React, {useEffect, useState} from 'react';
import MultiSelect from "react-multi-select-component";

export default function MultipleSelect({name, items, onSelectedItemsChanged, displayFields, selected, placeholder}) {
    const [selectedItems, setSelectedItems] = useState(selected);
    const options = items.map(item => ({value: item.id.toString(), label: displayFields.map(f => item[f]).join(', ')}));

    useEffect(() => {
        onSelectedItemsChanged(name, selectedItems);
    }, [selectedItems]);

    return <div style={{width:220}}><MultiSelect

        disableSearch={true}
        options={options}
        value={selectedItems}
        onChange={setSelectedItems}
        labelledBy="Select"
        overrideStrings={{
            "allItemsAreSelected": "Все",
            "clearSearch": "Очистить поиск",
            "noOptions": "",
            "search": "Поиск",
            "selectAll": "Выбрать все",
            "selectSomeItems": placeholder ? placeholder : "Выбрать..."
        }}
    /></div>;
}