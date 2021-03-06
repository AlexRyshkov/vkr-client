import * as React from 'react';
import {DataGrid} from '@material-ui/data-grid';

export default function DataTable({columns, rows, rowDoubleClick}) {
    return (
        <div style={{height: 800, width: '100%'}}>
            <DataGrid rows={rows} columns={columns} pageSize={20} onRowDoubleClick={rowDoubleClick}/>
        </div>
    );
}