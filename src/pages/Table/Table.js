import React, { useEffect, useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CircularProgress, Alert, Button, TablePagination, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Incomes } from '../../utils/incomes';
import { Expenses } from '../../utils/expenses';
import AddEditDialog from '../../components/AddEditDialog';
import ItemTable from '../../components/ItemTable';
import './Table.css';

const TableScreen = () => {
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [expensePage, setExpensePage] = useState(0); // Current page for expenses
    const [incomePage, setIncomePage] = useState(0); // Current page for incomes
    const rowsPerPage = 5; // Rows per page
    const [totalIncomes, setTotalIncomes] = useState(0); // Total incomes count
    const [totalExpenses, setTotalExpenses] = useState(0); // Total expenses count

    const [open, setOpen] = useState(false); // Dialog open state
    const [isEditing, setIsEditing] = useState(false); // Editing mode
    const [formData, setFormData] = useState({
        id: '',
        description: '',
        amount: '',
        date: '',
        type: '',
    });

    const [sortOption, setSortOption] = useState('id'); // Sorting option (by id or description)

    const location = useLocation(); // Get current URL
    const isExpenseDetailRoute = location.pathname.includes('/table/expense/');
    const isIncomeDetailRoute = location.pathname.includes('/table/income/');

    // Fetch data for expenses and incomes
    const getExpensesAndIncomes = useCallback(async () => {
        try {
            setLoading(true);
            
            // Calculate offsets based on current page and rows per page
            const expenseOffset = expensePage * rowsPerPage;
            const incomeOffset = incomePage * rowsPerPage;
    
            // Fetch paginated data from backend
            const fetchedIncomes = await Incomes.getIncomes(rowsPerPage, incomeOffset, sortOption);
            const fetchedExpenses = await Expenses.getExpenses(rowsPerPage, expenseOffset, sortOption);
    
            // Update states with fresh data (no duplicates)
            setIncomes(fetchedIncomes.data);
            setExpenses(fetchedExpenses.data);
    
            // Update total counts for pagination
            setTotalIncomes(fetchedIncomes.totalCount);
            setTotalExpenses(fetchedExpenses.totalCount);
    
            setError(null);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [expensePage, incomePage, sortOption]);
    
    useEffect(() => {
        getExpensesAndIncomes();
    }, [getExpensesAndIncomes]);

    // Handle pagination
    const handleExpensePageChange = (_, newPage) => setExpensePage(newPage);
    const handleIncomePageChange = (_, newPage) => setIncomePage(newPage);

    // Handle dialog open/close
    const handleClickOpen = (item = null, type = '') => {
        setIsEditing(!!item);
        setFormData(item || { id: '', description: '', amount: '', date: '', type });
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleIncomeSubmit = async (formData, isEditing) => {
        try {
            if (isEditing) {
                await Incomes.updateIncome(formData.id, formData);
    
                // Update the local state
                setIncomes((prevIncomes) =>
                    prevIncomes.map((income) =>
                        income.id === formData.id ? { ...income, ...formData } : income
                    )
                );
            } else {
                // Add and refresh the data
                await Incomes.addIncome(formData);
                await getExpensesAndIncomes();
            }
        } catch (e) {
            setError(e.message);
        }
    };

    const handleExpenseSubmit = async (formData, isEditing) => {
        try {
            if (isEditing) {
                await Expenses.updateExpense(formData.id, formData);
    
                // Update the local state
                setExpenses((prevExpenses) =>
                    prevExpenses.map((expense) =>
                        expense.id === formData.id ? { ...expense, ...formData } : expense
                    )
                );
            } else {
                // Add and refresh the data
                await Expenses.addExpense(formData); 
                await getExpensesAndIncomes();
            }
        } catch (e) {
            setError(e.message);
        }
    };    

    const handleDelete = async (id, type) => {
        try {
            if (type === 'income') {
                await Incomes.deleteIncome(id);
                setIncomes((prev) => prev.filter((income) => income.id !== id));
            } else {
                await Expenses.deleteExpense(id);
                setExpenses((prev) => prev.filter((expense) => expense.id !== id));
            }
        } catch (e) {
            setError(e.message);
        }
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    return (
        <>
            {error && <Alert severity="error">{error}</Alert>}
            {loading && <CircularProgress size={100} className="loading-spinner" />}
            {!loading && (
                <div className="table-head">
                    <h1>Tables Screen</h1>
                    <h3>Add, edit, or delete incomes and expenses below:</h3>
                </div>
            )}
            {!loading && !isExpenseDetailRoute && !isIncomeDetailRoute && (
                <>
                <FormControl className='sort-select'>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortOption}
                        onChange={handleSortChange}
                        label="Sort By"
                    >
                        <MenuItem value="id">By ID</MenuItem>
                        <MenuItem value="description">By Description</MenuItem>
                        <MenuItem value="amount">By Amount</MenuItem>
                    </Select>
                </FormControl>
                <div className="tables-container">
                    <h1>Incomes</h1>
                    <Button
                        className="add-button"
                        variant="contained"
                        onClick={() => handleClickOpen(null, 'income')}
                    >
                        Add Income
                    </Button>
                    <ItemTable
                        data={incomes}
                        type="income"
                        onEdit={(item) => handleClickOpen(item, 'income')}
                        onDelete={(id) => handleDelete(id, 'income')}
                    />
                    <TablePagination
                        rowsPerPageOptions={[5]}
                        component="div"
                        count={totalIncomes}
                        rowsPerPage={rowsPerPage}
                        page={incomePage}
                        onPageChange={handleIncomePageChange}
                    />

                    <h1>Expenses</h1>
                    <Button
                        className="add-button"
                        variant="contained"
                        onClick={() => handleClickOpen(null, 'expense')}
                    >
                        Add Expense
                    </Button>
                    <ItemTable
                        data={expenses}
                        type="expense"
                        onEdit={(item) => handleClickOpen(item, 'expense')}
                        onDelete={(id) => handleDelete(id, 'expense')}
                    />
                    <TablePagination
                        rowsPerPageOptions={[5]}
                        component="div"
                        count={totalExpenses}
                        rowsPerPage={rowsPerPage}
                        page={expensePage}
                        onPageChange={handleExpensePageChange}
                    />
                </div>
                </>
            )}
            <AddEditDialog
                open={open}
                handleClose={handleClose}
                isEditing={isEditing}
                formData={formData}
                handleIncomeSubmit={handleIncomeSubmit}
                handleExpenseSubmit={handleExpenseSubmit}
            />
            <Outlet />
        </>
    );
};

export default TableScreen;
