import { Add, Delete, Visibility, Edit, Assignment, People, CheckCircle, Cancel, LocalHospital, WbSunny } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Alert, Chip, Tabs, Tab, Paper, Divider, IconButton, TableContainer, Switch, FormControlLabel } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import PageHeader from '../../components/PageHeader';
import ModernTable, { ModernTableCell, ModernTableRow } from '../../components/ModernTable';
import ModernButton, { ModernIconButton } from '../../components/ModernButton';
import { showSuccess, showError, showWarning, showConfirm, showDeleteConfirm } from '../../utils/sweetalert';
import Swal from 'sweetalert2';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					{children}
				</Box>
			)}
		</div>
	);
}

export default function AttendancesPage() {
	const [tabValue, setTabValue] = useState(0);
	const [filters, setFilters] = useState({ start_date: dayjs().startOf('month').format('YYYY-MM-DD'), end_date: dayjs().endOf('month').format('YYYY-MM-DD'), status: '' });
	const { data, refetch } = useQuery({
		queryKey: ['attendances', filters],
		queryFn: async () => (await axios.get('/api/attendances', { params: filters })).data.data
	});

	// Generate all dates within current filters (month) and merge with data
	const monthDates: string[] = (() => {
		const dates: string[] = [];
		const start = dayjs(filters.start_date);
		const end = dayjs(filters.end_date);
		let cursor = start.startOf('day');
		while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
			dates.push(cursor.format('YYYY-MM-DD'));
			cursor = cursor.add(1, 'day');
		}
		return dates;
	})();

	// Newest first
	const monthDatesDesc = [...monthDates].reverse();

	const [showFullMonth, setShowFullMonth] = useState(true);

	const fullMonthRows = monthDatesDesc.flatMap((date) => {
		const rowsForDate = (data ?? []).filter((r: any) => dayjs(r.date).isSame(dayjs(date), 'day'));
		if (rowsForDate.length > 0) return rowsForDate;
		return [{
			id: `placeholder-${date}`,
			date,
			employee_name: '-',
			employee_position: '-',
			status: '-',
			notes: ''
		}];
	});

	const displayRows = showFullMonth ? fullMonthRows : (data ?? []).sort((a: any, b: any) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

	const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
	const [selectedYear, setSelectedYear] = useState(dayjs().year());

	const { data: salaries, refetch: refetchSalaries, isLoading: salariesLoading, error: salariesError } = useQuery({
		queryKey: ['salaries', selectedMonth, selectedYear],
		queryFn: async () => {
			const response = await axios.get('/api/attendances/salaries', { 
				params: { month: selectedMonth, year: selectedYear } 
			});
			return response.data.data;
		},
		enabled: !!selectedMonth && !!selectedYear
	});

	const { data: attendanceStats } = useQuery({
		queryKey: ['attendance-stats', selectedMonth, selectedYear],
		queryFn: async () => {
			const response = await axios.get('/api/attendances/stats/attendance-overview', {
				params: { month: selectedMonth, year: selectedYear }
			});
			return response.data.data;
		},
		enabled: !!selectedMonth && !!selectedYear
	});

	// Update selectedMonth and selectedYear based on filters
	useEffect(() => {
		if (filters.start_date) {
			const startDate = new Date(filters.start_date);
			setSelectedMonth(startDate.getMonth() + 1);
			setSelectedYear(startDate.getFullYear());
		}
	}, [filters.start_date]);

	const [open, setOpen] = useState(false);
	const [employees, setEmployees] = useState<any[]>([]);
	const [form, setForm] = useState<any>({ 
		employee_id: '', 
		date: '', 
		status: 'hadir', 
		notes: ''
	});
	const queryClient = useQueryClient();

	// Dialog hapus per bulan
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteForm, setDeleteForm] = useState<any>({ year: dayjs().year(), month: dayjs().month() + 1 });
	const [availableMonths, setAvailableMonths] = useState<any[]>([]);
	const [selectedMonthData, setSelectedMonthData] = useState<any>(null);

	// Tambahkan state untuk edit dialog
	const [editOpen, setEditOpen] = useState(false);
	const [editForm, setEditForm] = useState<any>({ id: '', employee_id: '', date: '', status: '', notes: '' });


	useEffect(() => {
		axios.get('/api/employees').then(res => setEmployees(res.data.data));
		// Load available months for bulk delete
		axios.get('/api/attendances/stats/available-months').then(res => setAvailableMonths(res.data.data));
	}, []);

	const openCreate = () => {
		setForm({ 
			employee_id: '', 
			date: new Date().toISOString().slice(0,10), 
			status: 'hadir', 
			notes: ''
		});
		setOpen(true);
	};

	const save = async () => {
		try {
			await axios.post('/api/attendances', { ...form, employee_id: Number(form.employee_id) });
			showSuccess('Data absensi berhasil ditambahkan', 'Berhasil!');
			setOpen(false);
			queryClient.invalidateQueries({ queryKey: ['attendances', filters] });
			queryClient.invalidateQueries({ queryKey: ['attendance-stats'] });
		} catch (err: any) {
			console.error('Save error:', err);
			showError('Gagal menyimpan data absensi: ' + (err?.response?.data?.message || err?.message || 'Terjadi kesalahan'), 'Gagal Menyimpan');
		}
	};

	const openDeleteDialog = () => {
		setDeleteForm({ year: dayjs().year(), month: dayjs().month() + 1 });
		setSelectedMonthData(null);
		setDeleteDialogOpen(true);
	};

	const handleMonthChange = () => {
		const monthData = availableMonths.find(m => m.year === deleteForm.year && m.month === deleteForm.month);
		setSelectedMonthData(monthData || null);
	};

	const deleteByMonth = async () => {
		if (!selectedMonthData) return;

		const result = await Swal.fire({
			icon: 'warning',
			title: 'Konfirmasi Hapus Bulanan',
			html: `
				<p>Apakah Anda yakin ingin menghapus <strong>${selectedMonthData.record_count}</strong> data absensi untuk bulan <strong>${deleteForm.month}/${deleteForm.year}</strong>?</p>
				<div style="text-align: left; margin-top: 1rem; padding: 1rem; background: #f3f4f6; border-radius: 0.5rem;">
					<p style="margin: 0.5rem 0;"><strong>Total:</strong> ${selectedMonthData.record_count} record</p>
					<p style="margin: 0.5rem 0;"><strong>Hadir:</strong> ${selectedMonthData.present_count} record</p>
					<p style="margin: 0.5rem 0;"><strong>Ijin:</strong> ${selectedMonthData.absent_count} record</p>
					<p style="margin: 0.5rem 0;"><strong>Libur:</strong> ${selectedMonthData.holiday_count} record</p>
					<p style="margin: 0.5rem 0;"><strong>Sakit:</strong> ${selectedMonthData.sick_count} record</p>
				</div>
				<p style="color: #ef4444; margin-top: 1rem; font-weight: 500;">Tindakan ini tidak dapat dibatalkan!</p>
			`,
			showCancelButton: true,
			confirmButtonText: 'Ya, Hapus!',
			cancelButtonText: 'Batal',
			confirmButtonColor: '#ef4444',
			cancelButtonColor: '#6b7280',
			reverseButtons: true,
		});

		if (!result.isConfirmed) {
			return;
		}

		try {
			await axios.delete('/api/attendances/bulk/delete-by-month', {
				data: { year: deleteForm.year, month: deleteForm.month }
			});
			
			setDeleteDialogOpen(false);
			queryClient.invalidateQueries({ queryKey: ['attendances', filters] });
			queryClient.invalidateQueries({ queryKey: ['attendance-stats'] });
			
			// Refresh available months
			const res = await axios.get('/api/attendances/stats/available-months');
			setAvailableMonths(res.data.data);
			
			showSuccess('Data absensi bulanan berhasil dihapus', 'Berhasil!');
		} catch (error: any) {
			showError('Gagal menghapus data absensi: ' + (error.response?.data?.message || error.message || 'Terjadi kesalahan'), 'Gagal Menghapus');
		}
	};

	const openEdit = (row: any) => {
		setEditForm({
			id: row.id,
			employee_id: row.employee_id,
			date: row.date,
			status: row.status,
			notes: row.notes || ''
		});
		setEditOpen(true);
	};

	const saveEdit = async () => {
		try {
			await axios.put(`/api/attendances/${editForm.id}`, {
				employee_id: Number(editForm.employee_id),
				date: dayjs(editForm.date).format('YYYY-MM-DD'),
				status: editForm.status,
				notes: editForm.notes
			});
			showSuccess('Data absensi berhasil diperbarui', 'Berhasil!');
			setEditOpen(false);
			queryClient.invalidateQueries({ queryKey: ['attendances', filters] });
			queryClient.invalidateQueries({ queryKey: ['attendance-stats'] });
		} catch (err: any) {
			let errorMsg = 'Gagal mengupdate: ';
			if (err?.response?.data?.errors) {
				errorMsg += err.response.data.errors.map((e: any) => e.msg).join(', ');
			} else {
				errorMsg += err?.response?.data?.message || err?.message || 'Unknown error';
			}
			showError(errorMsg, 'Gagal Memperbarui');
		}
	};

	const removeAttendance = async (id: number) => {
		const confirmed = await showDeleteConfirm('data absensi ini');
		if (!confirmed) return;
		try {
			await axios.delete(`/api/attendances/${id}`);
			showSuccess('Data absensi berhasil dihapus', 'Berhasil!');
			queryClient.invalidateQueries({ queryKey: ['attendances', filters] });
			queryClient.invalidateQueries({ queryKey: ['attendance-stats'] });
		} catch (err: any) {
			showError('Gagal menghapus data absensi: ' + (err?.response?.data?.message || err?.message || 'Terjadi kesalahan'), 'Gagal Menghapus');
		}
	};


	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR'
		}).format(amount);
	};

	// Tampilkan semua baris tanpa pagination atau tombol tambahan


	return (
		<Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
			<PageHeader
				title="Absensi & Gaji Karyawan"
				description="Manajemen kehadiran dan penggajian karyawan"
				actions={
					<>
						<ModernButton startIcon={<Add />} onClick={openCreate}>
							Tambah
						</ModernButton>
						<ModernButton
							variant="outlined"
							color="error"
							startIcon={<Delete />}
							onClick={openDeleteDialog}
						>
							Hapus Per Bulan
						</ModernButton>
					</>
				}
			/>

			{/* Modern Tabs */}
			<Box sx={{ mb: 3 }}>
				<Paper elevation={0} sx={{
					borderRadius: 3,
					border: '1px solid #e5e7eb',
					bgcolor: '#ffffff',
					overflow: 'hidden'
				}}>
					<Tabs
						value={tabValue}
						onChange={(e, newValue) => setTabValue(newValue)}
						sx={{
							'& .MuiTabs-flexContainer': {
								bgcolor: '#f8fafc'
							},
							'& .MuiTab-root': {
								color: '#6b7280',
								fontWeight: 600,
								textTransform: 'none',
								fontSize: '0.875rem',
								'&.Mui-selected': {
									color: '#22c55e'
								}
							},
							'& .MuiTabs-indicator': {
								bgcolor: '#22c55e',
								height: 3,
								borderRadius: '3px 3px 0 0'
							}
						}}
					>
						<Tab label="Absensi" />
						<Tab label="Gaji" />
					</Tabs>
				</Paper>
			</Box>

			<Box>
				<TabPanel value={tabValue} index={0}>
					<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
						{/* Statistik Absensi */}
						{attendanceStats && (
							<Card elevation={0} sx={{
								mb: 3,
								flexShrink: 0,
								borderRadius: 3,
								border: '1px solid #e5e7eb',
								bgcolor: '#ffffff',
								overflow: 'hidden'
							}}>
								<Box sx={{ bgcolor: '#f8fafc', p: 3, borderBottom: '1px solid #e5e7eb' }}>
									<Typography variant="h6" sx={{
										display: 'flex',
										alignItems: 'center',
										fontWeight: 600,
										color: '#1f2937'
									}}>
										<Assignment sx={{ mr: 1.5, fontSize: 20, color: '#22c55e' }} />
										Statistik Absensi - {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
									</Typography>
								</Box>
								<CardContent sx={{ p: 3 }}>
									<Grid container spacing={3}>
										<Grid item xs={12} sm={6} md={3}>
											<Box textAlign="center">
												<Typography variant="h4" color="success.main" fontWeight="bold">
													{attendanceStats.totalPresent}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Hadir
												</Typography>
											</Box>
										</Grid>
										<Grid item xs={12} sm={6} md={3}>
											<Box textAlign="center">
												<Typography variant="h4" color="error.main" fontWeight="bold">
													{attendanceStats.totalAbsent}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Ijin
												</Typography>
											</Box>
										</Grid>
										<Grid item xs={12} sm={6} md={3}>
											<Box textAlign="center">
												<Typography variant="h4" color="warning.main" fontWeight="bold">
													{attendanceStats.totalSick}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Sakit
												</Typography>
											</Box>
										</Grid>
										<Grid item xs={12} sm={6} md={3}>
											<Box textAlign="center">
												<Typography variant="h4" color="info.main" fontWeight="bold">
													{attendanceStats.totalHoliday}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Libur
												</Typography>
											</Box>
										</Grid>
									</Grid>
									
									<Divider sx={{ my: 2 }} />
									
									<Grid container spacing={2}>
										<Grid item xs={12} sm={6} md={3}>
											<Box textAlign="center">
												<Typography variant="h5" color="primary.main" fontWeight="bold">
													{attendanceStats.attendanceRate}%
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Tingkat Kehadiran
												</Typography>
												<Typography variant="caption" color="text.secondary">
													({attendanceStats.totalPresent} dari {attendanceStats.totalRecords} record)
												</Typography>
											</Box>
										</Grid>
										<Grid item xs={12} sm={6} md={3}>
											<Box textAlign="center">
												<Typography variant="h5" color="secondary.main" fontWeight="bold">
													{attendanceStats.totalEmployees}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Total Karyawan
												</Typography>
											</Box>
										</Grid>
										<Grid item xs={12} sm={6} md={3}>
											<Box textAlign="center">
												<Typography variant="h5" color="text.secondary" fontWeight="bold">
													{attendanceStats.totalWorkingDays}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Hari Kerja
												</Typography>
											</Box>
										</Grid>
										<Grid item xs={12} sm={6} md={3}>
											<Box textAlign="center">
												<Typography variant="h5" color="success.main" fontWeight="bold">
													{attendanceStats.overallAttendanceRate}%
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Kehadiran vs Target
												</Typography>
												<Typography variant="caption" color="text.secondary">
													({attendanceStats.totalPresent} dari {attendanceStats.expectedAttendance} target)
												</Typography>
											</Box>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						)}
						
						{/* Tabel Absensi */}
						<Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
							<CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
								<Box sx={{ p: 2, pb: 0 }}>
									<FormControlLabel
										control={<Switch size="small" checked={showFullMonth} onChange={(e) => setShowFullMonth(e.target.checked)} />}
										label={showFullMonth ? 'Tampilkan 1 bulan (dengan tanggal kosong)' : 'Hanya tampilkan data absensi'}
									/>
								</Box>
								<TableContainer>
									<ModernTable>
										<TableHead sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }}>
											<TableRow>
												<ModernTableCell sx={{ minWidth: 120 }}>Tanggal</ModernTableCell>
												<ModernTableCell sx={{ minWidth: 150 }}>Nama</ModernTableCell>
												<ModernTableCell sx={{ minWidth: 120 }}>Posisi</ModernTableCell>
												<ModernTableCell sx={{ minWidth: 100 }}>Status</ModernTableCell>
												<ModernTableCell sx={{ minWidth: 200 }}>Catatan</ModernTableCell>
												<ModernTableCell sx={{ minWidth: 100 }} align="center">Aksi</ModernTableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{displayRows.map((row: any) => (
												<ModernTableRow key={row.id}>
													<ModernTableCell variant="date">{dayjs(row.date).format('DD/MM/YYYY')}</ModernTableCell>
													<ModernTableCell variant="name">{row.employee_name === '-' ? <Box sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</Box> : row.employee_name}</ModernTableCell>
													<ModernTableCell>{row.employee_position === '-' ? <Box sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</Box> : row.employee_position}</ModernTableCell>
													<ModernTableCell>
														{row.status && row.status !== '-' ? (
															<Chip
																label={row.status}
																color={
																	row.status === 'hadir' ? 'success' :
																	row.status === 'sakit' ? 'warning' :
																	row.status === 'ijin' ? 'error' : 'default'
																}
																size="small"
															/>
														) : (
															<Box sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</Box>
														)}
													</ModernTableCell>
													<ModernTableCell variant="description">{row.notes || <Box sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</Box>}</ModernTableCell>
													<ModernTableCell align="center">
														{String(row.id).startsWith('placeholder-') ? null : (
															<>
																<ModernIconButton color="primary" onClick={() => openEdit(row)}>
																	<Edit />
																</ModernIconButton>
																<ModernIconButton color="error" onClick={() => removeAttendance(row.id)}>
																	<Delete />
																</ModernIconButton>
															</>
														)}
													</ModernTableCell>
												</ModernTableRow>
											))}
										</TableBody>
									</ModernTable>
								</TableContainer>
							</CardContent>
						</Card>
					</Box>
				</TabPanel>

				<TabPanel value={tabValue} index={1}>
					<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
						{/* Filter Controls */}
						<Box sx={{ mb: 2, flexShrink: 0 }}>
							<Typography variant="h6" sx={{ mb: 1 }}>Data Gaji Karyawan</Typography>
							<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
								<Typography variant="body2">Filter Periode:</Typography>
								<TextField
									label="Bulan"
									type="number"
									size="small"
									value={selectedMonth}
									onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
									inputProps={{ min: 1, max: 12 }}
									sx={{ width: 100 }}
								/>
								<TextField
									label="Tahun"
									type="number"
									size="small"
									value={selectedYear}
									onChange={(e) => setSelectedYear(parseInt(e.target.value))}
									inputProps={{ min: 2020, max: 2030 }}
									sx={{ width: 100 }}
								/>
							</Box>
						</Box>
						
						{/* Tabel Gaji */}
						<Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
							<CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
								{salariesLoading ? (
									<Box sx={{ textAlign: 'center', py: 4 }}>
										<Typography>Loading data gaji...</Typography>
									</Box>
								) : salariesError ? (
									<Alert severity="error">
										Error loading salaries: {salariesError?.message}
									</Alert>
								) : salaries && salaries.length > 0 ? (
									<TableContainer sx={{
										overflowX: 'auto',
										maxHeight: '70vh',
										'&::-webkit-scrollbar': {
											width: '8px',
											height: '8px',
										},
										'&::-webkit-scrollbar-track': {
											background: '#f1f1f1',
											borderRadius: '4px',
										},
										'&::-webkit-scrollbar-thumb': {
											background: '#c1c1c1',
											borderRadius: '4px',
											'&:hover': {
												background: '#a8a8a8',
											},
										},
									}}>
										<Table sx={{ minWidth: 1400 }} stickyHeader>
											<TableHead>
												<TableRow>
													<TableCell align="center" sx={{ minWidth: 80, fontWeight: 600, bgcolor: '#f9fafb' }}>Periode</TableCell>
													<TableCell sx={{ minWidth: 150, fontWeight: 600, bgcolor: '#f9fafb' }}>Nama Karyawan</TableCell>
													<TableCell sx={{ minWidth: 120, fontWeight: 600, bgcolor: '#f9fafb' }}>Posisi</TableCell>
													<TableCell align="right" sx={{ minWidth: 120, fontWeight: 600, bgcolor: '#f9fafb' }}>Gaji Pokok</TableCell>
													<TableCell align="center" sx={{ minWidth: 80, fontWeight: 600, bgcolor: '#f9fafb' }}>Hadir</TableCell>
													<TableCell align="center" sx={{ minWidth: 80, fontWeight: 600, bgcolor: '#f9fafb' }}>Ijin</TableCell>
													<TableCell align="center" sx={{ minWidth: 80, fontWeight: 600, bgcolor: '#f9fafb' }}>Sakit</TableCell>
													<TableCell align="center" sx={{ minWidth: 80, fontWeight: 600, bgcolor: '#f9fafb' }}>Libur</TableCell>
													<TableCell align="center" sx={{ minWidth: 100, fontWeight: 600, bgcolor: '#f9fafb' }}>Total Kerja</TableCell>
													<TableCell align="right" sx={{ minWidth: 120, fontWeight: 600, bgcolor: '#f9fafb' }}>Gaji/Hari</TableCell>
													<TableCell align="right" sx={{ minWidth: 120, fontWeight: 600, bgcolor: '#f9fafb' }}>Total Gaji</TableCell>
													<TableCell align="right" sx={{ minWidth: 120, fontWeight: 600, bgcolor: '#f9fafb' }}>Potongan</TableCell>
													<TableCell align="right" sx={{ minWidth: 120, fontWeight: 600, bgcolor: '#f9fafb' }}>Bonus</TableCell>
													<TableCell align="right" sx={{ minWidth: 120, fontWeight: 600, bgcolor: '#f9fafb' }}>Gaji Akhir</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{salaries.map((row: any, index: number) => (
													<TableRow key={row.id} hover sx={{ backgroundColor: index % 2 === 0 ? '#fafafa' : 'white' }}>
														<TableCell align="center" sx={{ fontWeight: 'medium', minWidth: 80 }}>{row.month}/{row.year}</TableCell>
														<TableCell sx={{ fontWeight: 'medium', minWidth: 150 }}>{row.employee_name}</TableCell>
														<TableCell sx={{ minWidth: 120 }}>{row.employee_position}</TableCell>
														<TableCell align="right" sx={{ minWidth: 120, fontWeight: 600, color: '#22c55e' }}>{formatCurrency(row.base_salary)}</TableCell>
														<TableCell align="center" sx={{ minWidth: 80 }}>
															<Chip
																label={row.present_days}
																color="success"
																size="small"
																variant="outlined"
															/>
														</TableCell>
														<TableCell align="center" sx={{ minWidth: 80 }}>
															<Chip
																label={row.absent_days}
																color="error"
																size="small"
																variant="outlined"
															/>
														</TableCell>
														<TableCell align="center" sx={{ minWidth: 80 }}>
															<Chip
																label={row.sick_days}
																color="warning"
																size="small"
																variant="outlined"
															/>
														</TableCell>
														<TableCell align="center" sx={{ minWidth: 80 }}>
															<Chip
																label={row.holiday_days}
																color="info"
																size="small"
																variant="outlined"
															/>
														</TableCell>
														<TableCell align="center" sx={{ minWidth: 100 }}>
															<Chip
																label={row.total_working_days}
																color="primary"
																size="small"
															/>
														</TableCell>
														<TableCell align="right" sx={{ minWidth: 120, fontWeight: 600, color: '#22c55e' }}>{formatCurrency(row.salary_per_day)}</TableCell>
														<TableCell align="right" sx={{ minWidth: 120, fontWeight: 600, color: '#22c55e' }}>{formatCurrency(row.total_salary)}</TableCell>
														<TableCell align="right" sx={{ color: row.deductions > 0 ? '#d32f2f' : 'inherit', minWidth: 120 }}>
															{formatCurrency(row.deductions)}
														</TableCell>
														<TableCell align="right" sx={{ color: row.bonuses > 0 ? '#2e7d32' : 'inherit', minWidth: 120 }}>
															{formatCurrency(row.bonuses)}
														</TableCell>
														<TableCell align="right" sx={{ minWidth: 120 }}>
															<Typography variant="body2" fontWeight="bold" color="primary">
																{formatCurrency(row.final_salary)}
															</Typography>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								) : (
									<Box sx={{ textAlign: 'center', py: 4 }}>
										<Typography color="text.secondary">
											Tidak ada data gaji untuk periode {selectedMonth}/{selectedYear}
										</Typography>
									</Box>
								)}
							</CardContent>
						</Card>
					</Box>
				</TabPanel>
			</Box>

			<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>Tambah Absensi</DialogTitle>
				<DialogContent>
					<Select fullWidth value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} sx={{ mt: 2 }} displayEmpty>
						<MenuItem value="" disabled>Pilih Karyawan</MenuItem>
						{employees.map((e) => (
							<MenuItem key={e.id} value={e.id}>{e.name} - {e.position}</MenuItem>
						))}
					</Select>
					<TextField label="Tanggal" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
					<Select fullWidth value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} sx={{ mt: 2 }}>
						<MenuItem value="hadir">Hadir</MenuItem>
						<MenuItem value="ijin">Ijin</MenuItem>
						<MenuItem value="libur">Libur</MenuItem>
						<MenuItem value="sakit">Sakit</MenuItem>
					</Select>

					<TextField label="Catatan" fullWidth margin="normal" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
				</DialogContent>
				<DialogActions>
					<ModernButton variant="outlined" onClick={() => setOpen(false)}>Batal</ModernButton>
					<ModernButton onClick={save}>Simpan</ModernButton>
				</DialogActions>
			</Dialog>

			{/* Dialog Hapus Per Bulan */}
			<Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>Hapus Data Absensi Per Bulan</DialogTitle>
				<DialogContent>
					<Alert severity="warning" sx={{ mb: 2 }}>
						<strong>Peringatan!</strong> Tindakan ini akan menghapus semua data absensi untuk bulan yang dipilih. 
						Tindakan ini tidak dapat dibatalkan!
					</Alert>
					
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<TextField
								label="Tahun"
								type="number"
								fullWidth
								margin="normal"
								value={deleteForm.year}
								onChange={(e) => {
									setDeleteForm({ ...deleteForm, year: parseInt(e.target.value) });
									setTimeout(handleMonthChange, 100);
								}}
								inputProps={{ min: 2020, max: 2030 }}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								label="Bulan"
								type="number"
								fullWidth
								margin="normal"
								value={deleteForm.month}
								onChange={(e) => {
									setDeleteForm({ ...deleteForm, month: parseInt(e.target.value) });
									setTimeout(handleMonthChange, 100);
								}}
								inputProps={{ min: 1, max: 12 }}
							/>
						</Grid>
					</Grid>

					{selectedMonthData && (
						<Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
							<Typography variant="h6" gutterBottom>
								Data untuk {deleteForm.month}/{deleteForm.year}
							</Typography>
							<Grid container spacing={2}>
								<Grid item xs={3}>
									<Typography variant="body2" color="text.secondary">Total Record</Typography>
									<Typography variant="h6" color="primary">
										{selectedMonthData.record_count}
									</Typography>
								</Grid>
								<Grid item xs={3}>
									<Typography variant="body2" color="text.secondary">Hadir</Typography>
									<Typography variant="h6" color="success.main">
										{selectedMonthData.present_count}
									</Typography>
								</Grid>
								<Grid item xs={3}>
									<Typography variant="body2" color="text.secondary">Ijin</Typography>
									<Typography variant="h6" color="warning.main">
										{selectedMonthData.absent_count}
									</Typography>
								</Grid>
								<Grid item xs={3}>
									<Typography variant="body2" color="text.secondary">Libur</Typography>
									<Typography variant="h6" color="info.main">
										{selectedMonthData.holiday_count}
									</Typography>
								</Grid>
								<Grid item xs={3}>
									<Typography variant="body2" color="text.secondary">Sakit</Typography>
									<Typography variant="h6" color="error.main">
										{selectedMonthData.sick_count}
									</Typography>
								</Grid>
							</Grid>
						</Box>
					)}

					{!selectedMonthData && deleteForm.year && deleteForm.month && (
						<Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
							<Typography color="text.secondary">
								Tidak ada data untuk bulan {deleteForm.month}/{deleteForm.year}
							</Typography>
						</Box>
					)}

					<Box sx={{ mt: 2 }}>
						<Typography variant="body2" color="text.secondary" gutterBottom>
							Bulan yang tersedia:
						</Typography>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
							{availableMonths.slice(0, 10).map((month: any) => (
								<Chip
									key={`${month.year}-${month.month}`}
									label={`${month.month}/${month.year} (${month.record_count})`}
									variant="outlined"
									size="small"
									onClick={() => {
										setDeleteForm({ year: month.year, month: month.month });
										setSelectedMonthData(month);
									}}
									color={month.year === deleteForm.year && month.month === deleteForm.month ? 'primary' : 'default'}
								/>
							))}
						</Box>
					</Box>
				</DialogContent>
				<DialogActions>
					<ModernButton variant="outlined" onClick={() => setDeleteDialogOpen(false)}>Batal</ModernButton>
					<ModernButton
						color="error"
						onClick={deleteByMonth}
						disabled={!selectedMonthData}
					>
						Hapus Data
					</ModernButton>
				</DialogActions>
			</Dialog>

			{/* Dialog Edit Absensi */}
			<Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>Edit Absensi</DialogTitle>
				<DialogContent>
					<Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
						<Typography variant="body2" color="text.secondary">
							Tanggal: {dayjs(editForm.date).format('DD/MM/YYYY')}
						</Typography>
					</Box>
					<Select fullWidth value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} sx={{ mt: 2 }}>
						<MenuItem value="hadir">Hadir</MenuItem>
						<MenuItem value="ijin">Ijin</MenuItem>
						<MenuItem value="libur">Libur</MenuItem>
						<MenuItem value="sakit">Sakit</MenuItem>
					</Select>
					<TextField label="Catatan" fullWidth margin="normal" value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
				</DialogContent>
				<DialogActions>
					<ModernButton variant="outlined" onClick={() => setEditOpen(false)}>Batal</ModernButton>
					<ModernButton onClick={saveEdit}>Simpan</ModernButton>
				</DialogActions>
			</Dialog>


		</Box>
	);
}
