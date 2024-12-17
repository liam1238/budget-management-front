import React, { useEffect, useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CircularProgress, Alert } from '@mui/material';
import DataTable from '../../components/DataTable';
import SortSelect from '../../components/SortSelect';
import { Incomes } from '../../utils/incomes';
import { Expenses } from '../../utils/expenses';
import AddEditDialog from '../../components/AddEditDialog';
import './Table.css';

const TableScreen = () => {
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [expensePage, setExpensePage] = useState(0); // Current page for expenses
    const [incomePage, setIncomePage] = useState(0); // Current page for incomes
    const rowsPerPage = 5;
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

    const [sortOption, setSortOption] = useState('id'); // Sorting option (by id / description / amount)

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
    
            // Fetch paginated data from the backend
            const [fetchedIncomes, fetchedExpenses] = await Promise.all([
                Incomes.getIncomes(rowsPerPage, incomeOffset, sortOption),
                Expenses.getExpenses(rowsPerPage, expenseOffset, sortOption),
            ]);
    
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

    // Handle dialog open 
    const handleDialogOpen = (item = null, type = '') => {
        setIsEditing(!!item);
        setFormData(item || { id: '', description: '', amount: '', date: '', type });
        setOpen(true);
    };
    
    const handleDialogClose = () => setOpen(false); // Handle dialog open close

    const handleIncomeSubmit = async (formData, isEditing) => {
        try {
            setLoading(true);

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
        } finally {
            setLoading(false);
        }
    };

    const handleExpenseSubmit = async (formData, isEditing) => {
        try {
            setLoading(true);

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
        } finally {
            setLoading(false);
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
                <SortSelect sortOption={sortOption} onSortChange={handleSortChange} />
                <div className="tables-container">
                    <DataTable
                        title="Incomes"
                        data={incomes}
                        totalItems={totalIncomes}
                        rowsPerPage={rowsPerPage}
                        page={incomePage}
                        onPageChange={(_, page) => setIncomePage(page)}
                        onAdd={() => handleDialogOpen(null, 'income')}
                        onEdit={(item) => handleDialogOpen(item, 'income')}
                        onDelete={(id) => handleDelete(id, 'income')}
                        type="income"
                    />
                    <DataTable
                        title="Expenses"
                        data={expenses}
                        totalItems={totalExpenses}
                        rowsPerPage={rowsPerPage}
                        page={expensePage}
                        onPageChange={(_, page) => setExpensePage(page)}
                        onAdd={() => handleDialogOpen(null, 'expense')}
                        onEdit={(item) => handleDialogOpen(item, 'expense')}
                        onDelete={(id) => handleDelete(id, 'expense')}
                        type="expense"
                    />
                </div>
                </>
            )}
            <AddEditDialog
                open={open}
                handleClose={handleDialogClose}
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
