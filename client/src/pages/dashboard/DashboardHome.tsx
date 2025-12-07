import {
    Card,
    CardContent,
    Grid,
    Typography,
    Box,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Paper,
    IconButton
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    People,
    AttachMoney,
    LocalShipping,
    MonetizationOn,
    Build,
    CheckCircle,
    Cancel,
    LocalHospital,
    WbSunny,
    Opacity,
    Person,
    Assignment,
    AccountBalance
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
    AreaChart,
    Area
} from 'recharts';
import dayjs from 'dayjs';
import { formatRupiah, formatNumber } from '../../utils/format';

const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'];

export default function DashboardHome() {
    const { data: overview } = useQuery({
        queryKey: ['dashboard-overview'],
        queryFn: async () => (await axios.get('/api/dashboard/overview')).data.data
    });

    const { data: weekly } = useQuery({
        queryKey: ['collections-weekly'],
        queryFn: async () => (await axios.get('/api/dashboard/charts/collections-weekly')).data.data
    });

    const { data: financial } = useQuery({
        queryKey: ['financial-monthly'],
        queryFn: async () => (await axios.get('/api/dashboard/charts/financial-monthly')).data.data
    });

    const { data: recentCollections } = useQuery({
        queryKey: ['recent-collections'],
        queryFn: async () => (await axios.get('/api/dashboard/recent-collections')).data.data
    });

    const { data: recentAttendances } = useQuery({
        queryKey: ['recent-attendances'],
        queryFn: async () => (await axios.get('/api/dashboard/recent-attendances')).data.data
    });

    const { data: recentIncomes } = useQuery({
        queryKey: ['recent-incomes'],
        queryFn: async () => (await axios.get('/api/dashboard/recent-incomes')).data.data
    });

    const { data: recentExpenses } = useQuery({
        queryKey: ['recent-expenses'],
        queryFn: async () => (await axios.get('/api/dashboard/recent-expenses')).data.data
    });

    const { data: recentShipments } = useQuery({
        queryKey: ['recent-shipments'],
        queryFn: async () => (await axios.get('/api/dashboard/recent-shipments')).data.data
    });

    const totalPresentToday = overview?.today?.attendances?.present || 0;
    const totalAbsentToday = overview?.today?.attendances?.leave || 0;
    const totalSickToday = overview?.today?.attendances?.sick || 0;
    const totalHolidayToday = overview?.today?.attendances?.holiday || 0;
    const totalRecordsToday = totalPresentToday + totalAbsentToday + totalSickToday + totalHolidayToday;

    // Calculate dynamic percentages for progress bars
    const calculatePercentage = (current: number, max: number, fallback: number = 50) => {
        if (!max || max === 0) return fallback;
        const percentage = Math.min((current / max) * 100, 100);
        return Math.max(percentage, 5); // Minimum 5% for visibility
    };

    // Progress bar calculations based on targets or historical data
    const collectorsPercentage = calculatePercentage(overview?.collectors || 0, 50, 75); // Target: 50 collectors
    const employeesPercentage = calculatePercentage(overview?.employees || 0, 20, 60); // Target: 20 employees
    const milkPercentage = calculatePercentage(overview?.today?.collections?.total_milk || 0, 5000, 85); // Target: 5000L per day
    const incomePercentage = calculatePercentage(overview?.monthly?.collections?.total_income || 0, 5000000, 90); // Target: 5M per month

    // Prepare financial summary data
    const financialSummary = [
        {
            title: 'Total Pemasukan',
            value: formatRupiah(overview?.monthly?.income?.total_amount || 0),
            icon: <TrendingUp sx={{ color: '#22c55e' }} />,
            color: '#22c55e',
            bgColor: '#dcfce7'
        },
        {
            title: 'Total Pengeluaran',
            value: formatRupiah(overview?.monthly?.expenses?.total_amount || 0),
            icon: <TrendingDown sx={{ color: '#ef4444' }} />,
            color: '#ef4444',
            bgColor: '#fef2f2'
        },
        {
            title: 'Biaya Pemeliharaan',
            value: formatRupiah(overview?.monthly?.maintenance?.total_cost || 0),
            icon: <Build sx={{ color: '#f59e0b' }} />,
            color: '#f59e0b',
            bgColor: '#fef3c7'
        },
        {
            title: 'Profit',
            value: formatRupiah((overview?.monthly?.income?.total_amount || 0) -
                (overview?.monthly?.expenses?.total_amount || 0) -
                (overview?.monthly?.maintenance?.total_cost || 0)),
            icon: <MonetizationOn sx={{ color: '#3b82f6' }} />,
            color: '#3b82f6',
            bgColor: '#eff6ff'
        }
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            {/* Modern Header */}
            <Box sx={{ mb: 4, p: { xs: 3, md: 4 }, bgcolor: 'white', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 3,
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                    }}>
                        <Opacity sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 0.5 }}>
                            Koperasi Susu Banyu Makmur
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#6b7280' }}>
                            Dashboard Monitoring & Analytics
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#9ca3af', mt: 2 }}>
                    Selamat datang! Pantau aktivitas dan performa koperasi secara real-time
                </Typography>
            </Box>

            {/* Modern Metrics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={0} sx={{
                        borderRadius: 3,
                        border: '1px solid #e5e7eb',
                        bgcolor: '#ffffff',
                        overflow: 'hidden',
                        '&:hover': {
                            boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease-in-out'
                        }
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: '#dcfce7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <People sx={{ color: '#22c55e', fontSize: 24 }} />
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
                                        Total Pengepul
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 1 }}>
                                        <Typography variant="h4" sx={{
                                            fontWeight: 700,
                                            color: '#1f2937',
                                            fontSize: { xs: '1.75rem', md: '2rem' },
                                            lineHeight: 1.2
                                        }}>
                                            {formatNumber(overview?.collectors || 0)}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                                            /50
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{
                                height: 2,
                                bgcolor: '#f3f4f6',
                                borderRadius: 1,
                                overflow: 'hidden'
                            }}>
                                <Box sx={{
                                    height: '100%',
                                    width: `${collectorsPercentage}%`,
                                    bgcolor: '#22c55e',
                                    borderRadius: 1,
                                    transition: 'width 0.5s ease-in-out'
                                }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={0} sx={{
                        borderRadius: 3,
                        border: '1px solid #e5e7eb',
                        bgcolor: '#ffffff',
                        overflow: 'hidden',
                        '&:hover': {
                            boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease-in-out'
                        }
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: '#dcfce7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Person sx={{ color: '#22c55e', fontSize: 24 }} />
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
                                        Total Karyawan
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 1 }}>
                                        <Typography variant="h4" sx={{
                                            fontWeight: 700,
                                            color: '#1f2937',
                                            fontSize: { xs: '1.75rem', md: '2rem' },
                                            lineHeight: 1.2
                                        }}>
                                            {formatNumber(overview?.employees || 0)}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                                            /20
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{
                                height: 2,
                                bgcolor: '#f3f4f6',
                                borderRadius: 1,
                                overflow: 'hidden'
                            }}>
                                <Box sx={{
                                    height: '100%',
                                    width: `${employeesPercentage}%`,
                                    bgcolor: '#22c55e',
                                    borderRadius: 1,
                                    transition: 'width 0.5s ease-in-out'
                                }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={0} sx={{
                        borderRadius: 3,
                        border: '1px solid #e5e7eb',
                        bgcolor: '#ffffff',
                        overflow: 'hidden',
                        '&:hover': {
                            boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease-in-out'
                        }
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: '#dcfce7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Opacity sx={{ color: '#22c55e', fontSize: 24 }} />
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
                                        Susu Hari Ini
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 1 }}>
                                        <Typography variant="h4" sx={{
                                            fontWeight: 700,
                                            color: '#1f2937',
                                            fontSize: { xs: '1.75rem', md: '2rem' },
                                            lineHeight: 1.2
                                        }}>
                                            {formatNumber(overview?.today?.collections?.total_milk || 0)} L
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                                            /5000L
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{
                                height: 2,
                                bgcolor: '#f3f4f6',
                                borderRadius: 1,
                                overflow: 'hidden'
                            }}>
                                <Box sx={{
                                    height: '100%',
                                    width: `${milkPercentage}%`,
                                    bgcolor: '#22c55e',
                                    borderRadius: 1,
                                    transition: 'width 0.5s ease-in-out'
                                }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={0} sx={{
                        borderRadius: 3,
                        border: '1px solid #e5e7eb',
                        bgcolor: '#ffffff',
                        overflow: 'hidden',
                        '&:hover': {
                            boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease-in-out'
                        }
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: '#dcfce7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <AccountBalance sx={{ color: '#22c55e', fontSize: 24 }} />
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
                                        Biaya Koleksi Bulan Ini
                                    </Typography>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 700,
                                        color: '#1f2937',
                                        fontSize: { xs: '1rem', md: '1.125rem' },
                                        lineHeight: 1.2
                                    }}>
                                        {formatRupiah(overview?.monthly?.collections?.total_income || 0)}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                                        Target: Rp 5M
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{
                                height: 2,
                                bgcolor: '#f3f4f6',
                                borderRadius: 1,
                                overflow: 'hidden'
                            }}>
                                <Box sx={{
                                    height: '100%',
                                    width: `${incomePercentage}%`,
                                    bgcolor: '#22c55e',
                                    borderRadius: 1,
                                    transition: 'width 0.5s ease-in-out'
                                }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Modern Charts Section */}
            <Grid container spacing={3} sx={{ mb: 4}}>
                {/* Koleksi Susu 7 Hari Terakhir */}
                <Grid item xs={12} lg={8}>
                    <Card elevation={0} sx={{
                        borderRadius: 3,
                        border: '1px solid #e5e7eb',
                        bgcolor: '#ffffff',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ bgcolor: '#f8fafc', p: 3, borderBottom: '1px solid #e5e7eb' }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1f2937' }}>
                                <TrendingUp sx={{ mr: 1.5, fontSize: 20, color: '#22c55e' }} />
                                Trend Koleksi Susu (7 Hari Terakhir)
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ height: 300, mt: 1 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={(weekly ?? []).map((d: any) => ({
                                        ...d,
                                        date: dayjs(d.date).format('DD/MM'),
                                        total_milk: Number(d.total_milk || 0),
                                        total_income: Number(d.total_income || 0)
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <RechartsTooltip
                                            formatter={(value: any, name: any) => {
                                                if (name === 'total_milk') {
                                                    return [`${formatNumber(value)} L`, 'Total Susu'];
                                                } else if (name === 'total_income') {
                                                    return [formatRupiah(value), 'Biaya Koleksi'];
                                                }
                                                return [value, name];
                                            }}
                                        />
                                        <Legend />
                                        <Area
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="total_milk"
                                            stroke="#10b981"
                                            fill="#10b981"
                                            fillOpacity={0.2}
                                            name="Total Susu"
                                        />
                                        <Area
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="total_income"
                                            stroke="#059669"
                                            fill="#059669"
                                            fillOpacity={0.2}
                                            name="Biaya Koleksi"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Absensi Hari Ini */}
                <Grid item xs={12} lg={4}>
                    <Card elevation={0} sx={{
                        borderRadius: 3,
                        border: '1px solid #e5e7eb',
                        bgcolor: '#ffffff',
                        overflow: 'hidden',
                        height: '100%'
                    }}>
                        <Box sx={{ bgcolor: '#f8fafc', p: 3, borderBottom: '1px solid #e5e7eb' }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1f2937' }}>
                                <Assignment sx={{ mr: 1.5, fontSize: 20, color: '#22c55e' }} />
                                Absensi Hari Ini
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                            {/* Check if there is any attendance data for today before rendering the summary */}
                            {totalRecordsToday > 0 ? (
                                <Box>
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#dcfce7', borderRadius: 2 }}>
                                                <CheckCircle sx={{ color: '#22c55e', mr: 1 }} />
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>Hadir</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#22c55e' }}>{totalPresentToday}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#fef2f2', borderRadius: 2 }}>
                                                <Cancel sx={{ color: '#ef4444', mr: 1 }} />
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>Ijin</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#ef4444' }}>{totalAbsentToday}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#fef3c7', borderRadius: 2 }}>
                                                <LocalHospital sx={{ color: '#f59e0b', mr: 1 }} />
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>Sakit</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#f59e0b' }}>{totalSickToday}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#eff6ff', borderRadius: 2 }}>
                                                <WbSunny sx={{ color: '#3b82f6', mr: 1 }} />
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>Libur</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#3b82f6' }}>{totalHolidayToday}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6, bgcolor: '#f9fafb', borderRadius: 2, color: '#6b7280' }}>
                                    <Typography sx={{ fontSize: '0.875rem' }}>Belum ada data absensi hari ini</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Modern Financial Summary */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {financialSummary.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card elevation={0} sx={{
                            borderRadius: 3,
                            border: '1px solid #e5e7eb',
                            bgcolor: '#ffffff',
                            overflow: 'hidden',
                            '&:hover': {
                                boxShadow: '0 4px 20px rgba(34, 197, 94, 0.1)',
                                transform: 'translateY(-1px)',
                                transition: 'all 0.3s ease-in-out'
                            }
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 2,
                                        bgcolor: item.bgColor,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 2
                                    }}>
                                        {item.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 500 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', fontSize: '1rem' }}>
                                            {item.value}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Modern Keuangan Bulanan */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Card elevation={0} sx={{
                        borderRadius: 3,
                        border: '1px solid #e5e7eb',
                        bgcolor: '#ffffff',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ bgcolor: '#f8fafc', p: 3, borderBottom: '1px solid #e5e7eb' }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1f2937' }}>
                                <MonetizationOn sx={{ mr: 1.5, fontSize: 20, color: '#22c55e' }} />
                                Analisis Keuangan Bulanan
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ height: 400, mt: 1 }}>
                                <ResponsiveContainer>
                                    <BarChart data={(financial ?? []).map((item: any) => ({
                                        ...item,
                                        month: dayjs().month(item.month - 1).format('MMM'),
                                        income: Number(item.income || 0),
                                        expenses: Number(item.expenses || 0),
                                        maintenance: Number(item.maintenance || 0),
                                        profit: Number(item.profit || 0)
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <RechartsTooltip
                                            formatter={(value: any, name: any) => {
                                                const labelMap: { [key: string]: string } = {
                                                    'income': 'Pemasukan',
                                                    'expenses': 'Pengeluaran',
                                                    'maintenance': 'Pemeliharaan',
                                                    'profit': 'Profit'
                                                };
                                                return [formatRupiah(value), labelMap[name] || name];
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="income" fill="#22c55e" name="Pemasukan" />
                                        <Bar dataKey="expenses" fill="#ef4444" name="Pengeluaran" />
                                        <Bar dataKey="maintenance" fill="#f59e0b" name="Pemeliharaan" />
                                        <Bar dataKey="profit" fill="#3b82f6" name="Profit" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Modern Recent Activities */}
            <Grid container spacing={3}>
                {/* Recent Collections */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{
                        borderRadius: 3,
                        border: '1px solid #e5e7eb',
                        bgcolor: '#ffffff',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ bgcolor: '#f8fafc', p: 3, borderBottom: '1px solid #e5e7eb' }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1f2937' }}>
                                <Opacity sx={{ mr: 1.5, fontSize: 20, color: '#22c55e' }} />
                                Koleksi Susu Terbaru
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 0 }}>
                            <Table sx={{ '& .MuiTableCell-head': { bgcolor: '#f9fafb', color: '#374151', fontWeight: 600, fontSize: '0.875rem' } }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ py: 2, px: 3 }}>Tanggal</TableCell>
                                        <TableCell sx={{ py: 2, px: 3 }}>Pengepul</TableCell>
                                        <TableCell align="right" sx={{ py: 2, px: 3 }}>Total (L)</TableCell>
                                        <TableCell align="right" sx={{ py: 2, px: 3 }}>Biaya</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(recentCollections ?? []).slice(0, 5).map((row: any) => (
                                        <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                            <TableCell sx={{ py: 2, px: 3, color: '#6b7280', fontSize: '0.875rem' }}>{dayjs(row.date).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell sx={{ py: 2, px: 3, fontWeight: 500, color: '#111827' }}>{row.collector_name}</TableCell>
                                            <TableCell align="right" sx={{ py: 2, px: 3, fontWeight: 600, color: '#22c55e' }}>{formatNumber(row.total_amount)}</TableCell>
                                            <TableCell align="right" sx={{ py: 2, px: 3, color: '#111827' }}>{formatRupiah(row.total_income)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Shipments */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{
                        borderRadius: 3,
                        border: '1px solid #e5e7eb',
                        bgcolor: '#ffffff',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ bgcolor: '#f8fafc', p: 3, borderBottom: '1px solid #e5e7eb' }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1f2937' }}>
                                <LocalShipping sx={{ mr: 1.5, fontSize: 20, color: '#22c55e' }} />
                                Pengiriman Terbaru
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 0 }}>
                            <Table sx={{ '& .MuiTableCell-head': { bgcolor: '#f9fafb', color: '#374151', fontWeight: 600, fontSize: '0.875rem' } }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ py: 2, px: 3 }}>Tanggal</TableCell>
                                        <TableCell sx={{ py: 2, px: 3 }}>Tujuan</TableCell>
                                        <TableCell align="right" sx={{ py: 2, px: 3 }}>Jumlah (L)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(recentShipments ?? []).slice(0, 5).map((row: any) => (
                                        <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                            <TableCell sx={{ py: 2, px: 3, color: '#6b7280', fontSize: '0.875rem' }}>{dayjs(row.date).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell sx={{ py: 2, px: 3, fontWeight: 500, color: '#111827' }}>{row.destination}</TableCell>
                                            <TableCell align="right" sx={{ py: 2, px: 3, fontWeight: 600, color: '#22c55e' }}>{formatNumber(row.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Attendances */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{
                        borderRadius: 3,
                        border: '1px solid #e5e7eb',
                        bgcolor: '#ffffff',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ bgcolor: '#f8fafc', p: 3, borderBottom: '1px solid #e5e7eb' }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1f2937' }}>
                                <Assignment sx={{ mr: 1.5, fontSize: 20, color: '#22c55e' }} />
                                Absensi Terbaru
                            </Typography>
                        </Box>
                        <CardContent sx={{ p: 0 }}>
                            <Table sx={{ '& .MuiTableCell-head': { bgcolor: '#f9fafb', color: '#374151', fontWeight: 600, fontSize: '0.875rem' } }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ py: 2, px: 3 }}>Tanggal</TableCell>
                                        <TableCell sx={{ py: 2, px: 3 }}>Karyawan</TableCell>
                                        <TableCell sx={{ py: 2, px: 3 }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(recentAttendances ?? []).slice(0, 5).map((row: any) => (
                                        <TableRow key={row.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                            <TableCell sx={{ py: 2, px: 3, color: '#6b7280', fontSize: '0.875rem' }}>{dayjs(row.date).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell sx={{ py: 2, px: 3, fontWeight: 500, color: '#111827' }}>{row.employee_name}</TableCell>
                                            <TableCell sx={{ py: 2, px: 3 }}>
                                                <Chip
                                                    label={row.status === 'hadir' ? 'Hadir' : row.status === 'ijin' ? 'Ijin' : row.status === 'sakit' ? 'Sakit' : 'Libur'}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: row.status === 'hadir' ? '#dcfce7' :
                                                               row.status === 'ijin' ? '#fef2f2' :
                                                               row.status === 'sakit' ? '#fef3c7' : '#eff6ff',
                                                        color: row.status === 'hadir' ? '#22c55e' :
                                                               row.status === 'ijin' ? '#ef4444' :
                                                               row.status === 'sakit' ? '#f59e0b' : '#3b82f6',
                                                        fontWeight: 600,
                                                        fontSize: '0.75rem'
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}