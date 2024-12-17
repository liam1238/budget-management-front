import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ItemTable = ({ data, onEdit, onDelete, type }) => (
    <TableContainer className="table-container">
        <Table>
            <TableHead>
                <TableRow className="table-row-head">
                    <TableCell className="table-row-cell">ID</TableCell>
                    <TableCell className="table-row-cell">Description</TableCell>
                    <TableCell className="table-row-cell">Amount</TableCell>
                    <TableCell className="table-row-cell">Date</TableCell>
                    <TableCell className="table-row-cell">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((item) => (
                    <TableRow className="table-row-body" key={item.id}>
                        <TableCell className="table-col">
                        <Link to={`${type}/${item.id}`}>{item.id}</Link>
                        </TableCell>
                        <TableCell className="table-col">{item.description}</TableCell>
                        <TableCell className="table-col">{item.amount}</TableCell>
                        <TableCell className="table-col">{item.date}</TableCell>
                        <TableCell className="table-col">
                            <Button onClick={() => onEdit(item)}>Edit</Button>
                            <Button color="error" onClick={() => onDelete(item.id)}>Delete</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export default ItemTable;
