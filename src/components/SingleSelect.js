import React, {useEffect, useState} from 'react';
import Select from "react-select";


export default function SingleSelect({placeholder, items, displayField, setSelectedItem}) {
    const options = items.map(item => ({value: item, label: item[displayField]}));

    return <div style={{width: 270}}><Select onChange={(e) => setSelectedItem(e.value)} placeholder={placeholder}
                                             options={options}></Select></div>;
}