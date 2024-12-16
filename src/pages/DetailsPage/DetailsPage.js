import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Incomes } from '../../utils/incomes';
import { Expenses } from '../../utils/expenses';
import { Button, CircularProgress, Alert } from '@mui/material';
import './DetailsPage.css';

const IncomeOrExpanseDetail = ({ type }) => {
    const { id } = useParams();  // Get the ID from the URL
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIncomeOrExpanse = async () => {
            try {
                setLoading(true);
                const data = type === 'income' ? await Incomes.getIncomeById(id) : await Expenses.getExpenseById(id); 
                setDetails(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchIncomeOrExpanse();
    }, [id, type]);

    const handleBack = () => {
        navigate(-1);  // Navigate back to the previous page
    };

    return (
        <>
            {error && <Alert severity="error">{error?.toString()}</Alert>}
            {loading && <CircularProgress size={100} className="loading-spinner" />}
            {!loading &&
                <div className='detail-head'>
                    <h1>{type === 'income' ? 'Income' : 'Expanse'} Detail:</h1>
                    {details && (
                        <div>
                            <p><strong>ID:</strong> {details.id}</p>
                            <p><strong>Description:</strong> {details.description}</p>
                            <p><strong>Amount:</strong> {details.amount}</p>
                            <p><strong>Date:</strong> {details.date}</p>
                            <Button className='btn' onClick={handleBack} variant="contained">Back to Table</Button>
                        </div>
                    )}
                </div>
            }   
        </>
    );
};

export default IncomeOrExpanseDetail;
