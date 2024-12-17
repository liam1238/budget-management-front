import React from 'react';
import { Button, TablePagination } from '@mui/material';
import ItemTable from './ItemTable';

const DataTable = ({ 
    title, 
    data, 
    totalItems, 
    rowsPerPage, 
    page, 
    onPageChange, 
    onAdd, 
    onEdit, 
    onDelete, 
    type 
}) => {
    return (
        <>
            <h1>{title}</h1>
            <Button
                className="add-button"
                variant="contained"
                onClick={() => onAdd(type)}
            >
                Add {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
            <ItemTable
                data={data}
                type={type}
                onEdit={(item) => onEdit(item, type)}
                onDelete={(id) => onDelete(id, type)}
            />
            <TablePagination
                rowsPerPageOptions={[rowsPerPage]}
                component="div"
                count={totalItems}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
            />
        </>
    );
};

export default DataTable;
