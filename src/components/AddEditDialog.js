import React, { useEffect } from 'react';
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

    const onSubmit = (data) => {
        if (formData.type === 'income') {
            handleIncomeSubmit(data, isEditing);
        } else {
            handleExpenseSubmit(data, isEditing);
        }
        reset(); // Reset the form after submission
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '20px' }}>
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
