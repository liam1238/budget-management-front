import { replace } from 'lodash';
import { GET_EXPENSES_URL, ADD_EXPENSE_URL, UPDATE_EXPENSE_URL, DELETE_EXPENSE_URL, GET_EXPENSES_BY_ID_URL } from './constants';

export const Expenses = {
    getExpenses: async (limit = 5, offset = 0, sortBy = 'id') => {        
        const response = await fetch(`${GET_EXPENSES_URL}?limit=${limit}&offset=${offset}&sortBy=${sortBy}`);
        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
        const expenses = await response.json();
        return expenses;        
    },

    getExpenseById: async (id) => {
        const url = replace(GET_EXPENSES_BY_ID_URL, ':id', id); 
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
        
        const expense = await response.json();
        return expense;
    },

    addExpense: async (expenseData) => {        
        const response = await fetch(ADD_EXPENSE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData),
        });
        
        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
        const newExpense = await response.json();
        return newExpense;
    },

    updateExpense: async (id, updatedData) => {
        const url = replace(UPDATE_EXPENSE_URL, ':id', id); 
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
        const updatedExpense = await response.json();
        return updatedExpense;
    },

    deleteExpense: async (id) => {
        const url = replace(DELETE_EXPENSE_URL, ':id', id); 
        const response = await fetch(url, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
        return { success: true };
    },
};
