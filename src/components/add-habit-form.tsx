import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Paper, Typography, Fade } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { addHabit } from '../store/habit-slice';

const AddHabitForm: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
    const [description, setDescription] = useState<string>("");

    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            dispatch(
                addHabit({
                    name,
                    frequency,
                    description
                })
            );
            setName("");
            setDescription("");
        }
    };

    return (
        <Fade in={true} timeout={800}>
            <Paper elevation={3} sx={{
                p: 4,
                borderRadius: 4,
                background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
                }
            }}>
                <Typography variant="h5" gutterBottom sx={{
                    fontWeight: 700,
                    color: '#1a237e',
                    mb: 3,
                    borderBottom: '2px solid #3f51b5',
                    paddingBottom: 1,
                    textAlign: 'center',
                    letterSpacing: '0.5px'
                }}>
                    Create New Habit
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3
                    }}>
                        <TextField
                            label="Habit Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='What habit would you like to build?'
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                sx: {
                                    borderRadius: 2,
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    transition: 'background 0.3s ease-in-out',
                                    '&:hover': {
                                        background: 'rgba(255, 255, 255, 1)'
                                    }
                                }
                            }}
                            required
                        />

                        <TextField
                            label="Description (Optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details about your habit"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            InputProps={{
                                sx: {
                                    borderRadius: 2,
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    transition: 'background 0.3s ease-in-out',
                                    '&:hover': {
                                        background: 'rgba(255, 255, 255, 1)'
                                    }
                                }
                            }}
                        />

                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Frequency</InputLabel>
                            <Select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
                                label="Frequency"
                                sx={{
                                    borderRadius: 2,
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    transition: 'background 0.3s ease-in-out',
                                    '&:hover': {
                                        background: 'rgba(255, 255, 255, 1)'
                                    }
                                }}
                            >
                                <MenuItem value="daily">Daily</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<AddCircleOutlineIcon />}
                            sx={{
                                borderRadius: 2,
                                py: 1.5,
                                fontWeight: 'bold',
                                textTransform: 'none',
                                boxShadow: '0 4px 10px rgba(63, 81, 181, 0.2)',
                                background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)',
                                    boxShadow: '0 6px 12px rgba(63, 81, 181, 0.3)',
                                    transform: 'scale(1.05)'
                                }
                            }}
                        >
                            Add Habit
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Fade>
    );
};

export default AddHabitForm;