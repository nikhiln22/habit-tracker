import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from "../store/store";
import { fetchHabits, Habit } from '../store/habit-slice';
import {
    LinearProgress, Paper, Typography, Box, Grid,
    CircularProgress, Divider, Card, CardContent,
    Skeleton, Fade
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

// Circular progress with label component
const CircularProgressWithLabel: React.FC<{
    value: number;
    total: number;
    color: string;
    icon: React.ReactNode;
    label: string;
}> = ({ value, total, color, icon, label }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                    variant="determinate"
                    value={percentage}
                    size={80}
                    thickness={4}
                    sx={{ color }}
                />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {icon}
                </Box>
            </Box>
            <Typography variant="h5" component="div" sx={{ mt: 1, fontWeight: 'bold' }}>
                {value}{total > 0 ? `/${total}` : ''}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {label}
            </Typography>
        </Box>
    );
};

const HabitStats: React.FC = () => {
    const { habits, isLoading, error } = useSelector((state: RootState) => state.habits);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchHabits());
    }, [dispatch]);

    const getCompletedToday = () => {
        const today = new Date().toISOString().split("T")[0];
        return habits.filter((habit) => habit.completedDates.includes(today)).length;
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

    const getLongestStreak = () => {
        return Math.max(...habits.map(getStreak), 0);
    };

    // Calculate weekly completion rate
    const getWeeklyCompletionRate = () => {
        if (habits.length === 0) return 0;

        const today = new Date();
        let totalCompletions = 0;
        let totalPossible = 0;

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split("T")[0];

            habits.forEach(habit => {
                if (habit.frequency === "daily" ||
                    (habit.frequency === "weekly" && date.getDay() === 0)) { // Sunday for weekly habits
                    totalPossible++;
                    if (habit.completedDates.includes(dateString)) {
                        totalCompletions++;
                    }
                }
            });
        }

        return totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;
    };

    if (isLoading) {
        return (
            <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>Habit Statistics</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <Skeleton variant="rectangular" width={150} height={150} sx={{ borderRadius: 2 }} />
                    <Skeleton variant="rectangular" width={150} height={150} sx={{ borderRadius: 2 }} />
                    <Skeleton variant="rectangular" width={150} height={150} sx={{ borderRadius: 2 }} />
                </Box>
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2, bgcolor: 'error.light' }}>
                <Typography color="error" variant="h6" gutterBottom>Error Loading Data</Typography>
                <Typography color="error.dark">{error}</Typography>
            </Paper>
        );
    }

    const completedToday = getCompletedToday();
    const longestStreak = getLongestStreak();
    const weeklyCompletionRate = getWeeklyCompletionRate();

    return (
        <Fade in={true} timeout={800}>
            <Paper elevation={3} sx={{
                p: 3,
                mt: 4,
                borderRadius: 2,
                background: 'linear-gradient(to right, #fafafa, #f5f5f5)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)'
                }
            }}>
                <Typography variant="h5" sx={{
                    fontWeight: 600,
                    color: '#1a237e',
                    borderBottom: '2px solid #3f51b5',
                    paddingBottom: 1,
                    marginBottom: 3
                }}>
                    Habit Statistics
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={4}>
                        <Card elevation={2} sx={{
                            height: '100%',
                            borderRadius: 2,
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                            }
                        }}>
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 3
                            }}>
                                <CircularProgressWithLabel
                                    value={completedToday}
                                    total={habits.length}
                                    color="#4caf50"
                                    icon={<CheckCircleIcon sx={{ fontSize: 30, color: '#4caf50' }} />}
                                    label="Completed Today"
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Card elevation={2} sx={{
                            height: '100%',
                            borderRadius: 2,
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                            }
                        }}>
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 3
                            }}>
                                <CircularProgressWithLabel
                                    value={longestStreak}
                                    total={30}
                                    color="#ff9800"
                                    icon={<LocalFireDepartmentIcon sx={{ fontSize: 30, color: '#ff9800' }} />}
                                    label="Longest Streak"
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Card elevation={2} sx={{
                            height: '100%',
                            borderRadius: 2,
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                            }
                        }}>
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 3
                            }}>
                                <CircularProgressWithLabel
                                    value={weeklyCompletionRate}
                                    total={100}
                                    color="#3f51b5"
                                    icon={<TrendingUpIcon sx={{ fontSize: 30, color: '#3f51b5' }} />}
                                    label="Weekly Completion Rate"
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Weekly Progress Overview */}
                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Weekly Progress Overview
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={weeklyCompletionRate}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            mb: 1
                        }}
                    />
                    <Typography variant="body2" color="text.secondary" align="right">
                        {weeklyCompletionRate}% Complete
                    </Typography>
                </Box>

                {/* Detailed Habit Metrics */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">Total Habits</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FormatListBulletedIcon sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                                {habits.length}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">Daily Habits</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {habits.filter(h => h.frequency === 'daily').length}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">Weekly Habits</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {habits.filter(h => h.frequency === 'weekly').length}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">Avg. Streak</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LocalFireDepartmentIcon sx={{ mr: 1, fontSize: 20, color: '#ff9800' }} />
                                {habits.length > 0 ? Math.round(habits.reduce((sum, habit) => sum + getStreak(habit), 0) / habits.length) : 0}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Fade>
    );
};

export default HabitStats;