import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

function ExpensesTable({ expenses, onDelete, onEdit }) {
    const totalExpense = expenses.reduce((sum, record) => sum + record.amount, 0);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell align="right">Type</TableCell>
                        <TableCell align="right">Amount ($)</TableCell>

                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {expenses.map((expense) => (
                        <TableRow key={expense._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {expense.title}
                            </TableCell>
                            <TableCell align="right">{expense.type}</TableCell>
                            <TableCell align="right">{expense.amount}</TableCell>
                            
                            {expense.type!=="auto"?<TableCell align="right">
                                <Button onClick={() => onEdit(expense)}>Edit</Button>
                                <Button onClick={() => onDelete(expense._id)}>Delete</Button>
                            </TableCell>:<TableCell align="right">No Action</TableCell>}
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell align="right">${totalExpense}</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ExpensesTable;