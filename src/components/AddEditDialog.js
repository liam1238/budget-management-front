import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, Button, TextField } from '@mui/material';

const AddEditDialog = ({
    open,
    handleClose,
    formData,
    handleIncomeSubmit,
    handleExpenseSubmit,
    isEditing,
}) => {
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (open) {
            reset(formData); 
        }
    }, [formData, open, reset]);

    // Wrapped in useCallback to avoid unnecessary re-creations of the function 
    const onSubmit = useCallback((data) => {
        if (!data.description || !data.amount || !data.date) {
            alert('All fields are required!');
            return;
        }
        if (formData.type === 'income') {
            handleIncomeSubmit(data, isEditing);
        } else {
            handleExpenseSubmit(data, isEditing);
        }
        reset(); // Reset the form after submission
        handleClose();
    }, [formData.type, handleIncomeSubmit, handleExpenseSubmit, isEditing, reset, handleClose]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <form className='dialog-form' onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    {...register('description')}
                    label="Description"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    {...register('amount')}
                    type="number"
                    label="Amount"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    {...register('date')}
                    type="date"
                    label="Date"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }} // fix bug in the view
                />
                <div className='btns-div'>
                    <Button type="submit" variant="contained" color="primary">{isEditing ? 'Update' : 'Add'}</Button>
                    <Button onClick={handleClose} variant="outlined" color="secondary">Cancel</Button>
                </div>
            </form>
        </Dialog>
    );
};

export default AddEditDialog;
