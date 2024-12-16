import { get } from 'lodash';
import { GET_TOTAL_INCOME_URL, GET_TOTAL_EXPENSE_URL } from './constants';

export const Budget = {
    getSummary: async () => {        
        const response = await fetch(GET_TOTAL_INCOME_URL);
        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
        const incomes = await response.json();
        
        const response2 = await fetch(GET_TOTAL_EXPENSE_URL);
        if (!response2.ok) {
            throw new Error(`${response2.status}: ${response2.statusText}`);
        }
        const expenses = await response2.json();

        const balance = incomes?.totalIncome - expenses?.totalExpenses;
        
        const summary = {
            totalIncome: get(incomes, 'totalIncome', 0), // Default to 0 if totalIncome is missing
            totalExpenses: get(expenses, 'totalExpenses', 0), // Default to 0 if totalExpenses is missing
            balance: balance | 0,
        };
        
        return summary;        
    },
};
