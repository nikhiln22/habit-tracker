import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
    Box, Button, Grid, LinearProgress, Paper, Typography,
    Chip, Divider, Tooltip, IconButton, Fade, Collapse
} from '@mui/material';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { toggleHabit, removeHabit, Habit } from '../store/habit-slice';

const HabitList: React.FC = () => {
    const { habits } = useSelector((state: RootState) => state.habits);
    const dispatch = useDispatch<AppDispatch>();
    const today = new Date().toISOString().split("T")[0];
    const [expandedHabit, setExpandedHabit] = useState<string | null>(null);

    const toggleExpand = (habitId: string) => {
        setExpandedHabit(expandedHabit === habitId ? null : habitId);
    };

    const getStreak = (habit: Habit) => {
        let streak = 0;
        const currentDate = new Date();

        while (true) {
            const dateString = currentDate.toISOString().split("T")[0];
            if (habit.completedDates.includes(dateString)) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    };

    const getBestStreak = (habit: Habit) => {
        let bestStreak = 0;
        let currentStreak = 0;
        let sortedDates = [...habit.completedDates].sort();

        if (sortedDates.length === 0) {
            return 0;
        }

        for (let i = 0; i < sortedDates.length; i++) {
            if (i === 0) {
                currentStreak = 1;
            } else {
                const prevDate = new Date(sortedDates[i - 1]);
                prevDate.setDate(prevDate.getDate() + 1);


                if (prevDate.toISOString().split('T')[0] === sortedDates[i]) {
                    currentStreak++;
                } else {

                    currentStreak = 1;
                }
            }

            bestStreak = Math.max(bestStreak, currentStreak);
        }

        return bestStreak;
    };

    const getStreakColor = (streak: number) => {
        if (streak >= 20) return "#f57c00";
        if (streak >= 10) return "#ff9800";
        if (streak >= 5) return "#ffc107";
        return "#4caf50";
    };


    const getProgressColor = (streak: number) => {
        const percentage = (streak / 30) * 100;
        if (percentage >= 80) return "success";
        if (percentage >= 40) return "info";
        if (percentage >= 20) return "warning";
        return "primary";
    };


    const getCompletionHistory = (habit: Habit) => {
        const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split("T")[0];
        }).reverse();

        return lastSevenDays.map(date => ({
            date,
            completed: habit.completedDates.includes(date)
        }));
    };

    if (habits.length === 0) {
        return (
            <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary">
                    No habits added yet
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    Create your first habit to get started on your journey!
                </Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
            {habits?.map((habit, index) => {
                const streak = getStreak(habit);
                const isCompleted = habit.completedDates.includes(today);
                const isExpanded = expandedHabit === habit.id;
                const bestStreak = getBestStreak(habit);

                return (
                    <Fade in={true} timeout={400 + (index * 100)} key={habit.id}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                border: isCompleted ? '1px solid rgba(76, 175, 80, 0.3)' : undefined,
                                background: isCompleted
                                    ? 'linear-gradient(to right, rgba(76, 175, 80, 0.05), rgba(255, 255, 255, 1))'
                                    : 'white',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                }
                            }}
                        >
                            <Grid container alignItems='center' spacing={2}>
                                <Grid item xs={12} sm={7}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                color: isCompleted ? '#2e7d32' : 'inherit',
                                                textDecoration: isCompleted ? 'none' : 'none'
                                            }}
                                        >
                                            {habit.name}
                                        </Typography>
                                        {streak > 0 && (
                                            <Tooltip title={`${streak} day streak`}>
                                                <Chip
                                                    icon={<LocalFireDepartmentIcon />}
                                                    label={streak}
                                                    size="small"
                                                    sx={{
                                                        ml: 2,
                                                        fontWeight: 'bold',
                                                        backgroundColor: getStreakColor(streak),
                                                        color: 'white'
                                                    }}
                                                />
                                            </Tooltip>
                                        )}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Chip
                                            label={habit.frequency}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{ textTransform: "capitalize" }}
                                        />
                                        {habit.description && (
                                            <Typography variant="body2" color="text.secondary">
                                                {habit.description}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                                        gap: 1
                                    }}>
                                        <Button
                                            variant={isCompleted ? 'contained' : 'outlined'}
                                            color={isCompleted ? "success" : "primary"}
                                            startIcon={isCompleted ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
                                            onClick={() => dispatch(toggleHabit({ id: habit.id, date: today }))}
                                            sx={{
                                                borderRadius: 6,
                                                px: 2,
                                                boxShadow: isCompleted ? 2 : 0,
                                                textTransform: 'none'
                                            }}
                                        >
                                            {isCompleted ? "Completed" : "Mark Complete"}
                                        </Button>
                                        <Tooltip title="Remove habit">
                                            <IconButton
                                                color="error"
                                                onClick={() => dispatch(removeHabit(habit.id))}
                                                size="small"
                                                sx={{
                                                    border: '1px solid rgba(211, 47, 47, 0.5)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(211, 47, 47, 0.1)'
                                                    }
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant='body2' fontWeight={500}>
                                        Current Streak: {streak} days
                                    </Typography>
                                    <Typography variant='body2' color="text.secondary">
                                        Goal: 30 days
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant='determinate'
                                    value={(streak / 30) * 100}
                                    color={getProgressColor(streak) as "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                                    sx={{
                                        mt: 1,
                                        height: 8,
                                        borderRadius: 4,
                                    }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Button
                                    onClick={() => toggleExpand(habit.id)}
                                    endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    size="small"
                                    color="inherit"
                                    sx={{ textTransform: 'none' }}
                                >
                                    {isExpanded ? "Hide Details" : "Show Details"}
                                </Button>
                            </Box>

                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Last 7 Days History
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        {getCompletionHistory(habit).map((day, idx) => (
                                            <Box key={idx} sx={{ textAlign: 'center' }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        bgcolor: day.completed ? '#4caf50' : 'transparent',
                                                        border: day.completed ? 'none' : '1px dashed #ccc',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        margin: '0 auto',
                                                        mt: 0.5
                                                    }}
                                                >
                                                    {day.completed && <CheckCircleIcon fontSize="small" sx={{ color: 'white' }} />}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Habit Stats
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Paper elevation={0} sx={{ p: 1, textAlign: 'center', bgcolor: 'background.default' }}>
                                                    <Typography variant="h6" color="primary">
                                                        {habit.completedDates.length}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Total Completions
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Paper elevation={0} sx={{ p: 1, textAlign: 'center', bgcolor: 'background.default' }}>
                                                    <Typography variant="h6" color="primary">
                                                        {Math.max(streak, bestStreak)}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Best Streak
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Collapse>
                        </Paper>
                    </Fade>
                );
            })}
        </Box>
    );
};

export default HabitList;