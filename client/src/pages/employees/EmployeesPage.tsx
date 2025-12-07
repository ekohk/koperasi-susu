// client/src/pages/employees/EmployeesPage.tsx

import { Add, Visibility, Edit, Delete, Download } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Chip, Divider } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import ModernTable, { ModernTableCell, ModernTableRow } from '../../components/ModernTable';
import ModernButton, { ModernIconButton } from '../../components/ModernButton';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetalert';

export default function EmployeesPage() {
	const queryClient = useQueryClient();
	const { data } = useQuery({ queryKey: ['employees'], queryFn: async () => (await axios.get('/api/employees')).data.data });
	const [open, setOpen] = useState(false);
	const [detailOpen, setDetailOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
	const [form, setForm] = useState<any>({ id: 0, name: '', position: '', salary: '', join_date: '', phone: '', address: '' });

	const openCreate = () => { setForm({ id: 0, name: '', position: '', salary: '', join_date: '', phone: '', address: '' }); setOpen(true); };
	const openEdit = (row: any) => {
		setForm({
			...row,
			salary: row.salary ? parseInt(row.salary) : ''
		});
		setEditOpen(true);
	};
	
	const openDetail = async (employee: any) => {
		setSelectedEmployee(employee);
		setDetailOpen(true);
	};

	// Query for employee detail
	const { data: employeeDetail, isLoading: detailLoading, error: detailError } = useQuery({
		queryKey: ['employee-detail', selectedEmployee?.id],
		queryFn: async () => {
			if (!selectedEmployee) return null;
			try {
				console.log('Fetching employee detail for ID:', selectedEmployee.id);
				const response = await axios.get(`/api/employees/${selectedEmployee.id}/detail`);
				console.log('Employee detail response:', response.data);
				return response.data.data;
			} catch (error) {
				console.error('Error fetching employee detail:', error);
				throw error;
			}
		},
		enabled: !!selectedEmployee && detailOpen,
		retry: 1,
		refetchOnWindowFocus: false
	});

	const save = async () => {
		try {
			console.log('Saving employee data:', form);
			// Pastikan join_date hanya dikirim untuk data baru
			const payload = { 
				...form, 
				salary: Number(form.salary),
				join_date: form.id ? undefined : (form.join_date ? new Date(form.join_date).toISOString().split('T')[0] : null)
			};
			
			if (form.id) {
				console.log('Updating employee with ID:', form.id);
				await axios.put(`/api/employees/${form.id}`, payload);
				console.log('Employee updated successfully');
				showSuccess('Data karyawan berhasil diperbarui', 'Berhasil!');
			} else {
				console.log('Creating new employee');
				await axios.post('/api/employees', payload);
				console.log('Employee created successfully');
				showSuccess('Data karyawan berhasil ditambahkan', 'Berhasil!');
			}
			
			setOpen(false);
			setEditOpen(false);
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			queryClient.invalidateQueries({ queryKey: ['employee-detail'] });
		} catch (error) {
			console.error('Error saving employee:', error);
			let message = 'Gagal menyimpan data karyawan';
			if (typeof error === 'object' && error !== null && 'response' in error) {
				const errObj = error as any;
				message = errObj.response?.data?.message || errObj.message || message;
			} else if (error instanceof Error) {
				message = error.message;
			}
			showError('Gagal menyimpan data karyawan: ' + message, 'Gagal Menyimpan');
		}
	};

	const remove = async (id: number) => {
		const confirmed = await showDeleteConfirm('karyawan ini');
		if (!confirmed) return;
		try {
			await axios.delete(`/api/employees/${id}`);
			showSuccess('Data karyawan berhasil dihapus', 'Berhasil!');
			queryClient.invalidateQueries({ queryKey: ['employees'] });
		} catch (err: any) {
			console.error('Delete error:', err);
			let message = 'Unknown error';
			if (typeof err === 'object' && err !== null && 'response' in err) {
				const errObj = err as any;
				message = errObj.response?.data?.message || errObj.message || message;
			} else if (err instanceof Error) {
				message = err.message;
			}
			showError('Gagal menghapus data karyawan: ' + message, 'Gagal Menghapus');
		}
	};

	const handleDownloadEmployee = async () => {
		if (!selectedEmployee) return;
		
		try {
			// Test route first
			console.log('Testing export route...');
			const testResponse = await axios.get(`/api/attendances/test-export?employee_id=${selectedEmployee.id}`);
			console.log('Test response:', testResponse.data);
			
			// If test works, try actual export
			const response = await axios.get(`/api/attendances/export/excel?employee_id=${selectedEmployee.id}`, {
				responseType: 'blob'
			});
			
			// Create blob link to download
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `absensi-${selectedEmployee.name}-${new Date().toISOString().split('T')[0]}.xlsx`);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Download error:', error);
			let message = 'Unknown error';
			if (typeof error === 'object' && error !== null && 'response' in error) {
				const errObj = error as any;
				message = errObj.response?.data?.message || errObj.message || message;
			} else if (error instanceof Error) {
				message = error.message;
			}
			showError('Gagal mengunduh file absensi: ' + message, 'Gagal Mengunduh');
		}
	};

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
			<PageHeader
				title="Karyawan"
				description="Kelola data karyawan dan absensi"
				actions={
					<ModernButton startIcon={<Add />} onClick={openCreate}>
						Tambah
					</ModernButton>
				}
			/>

			<Box sx={{ overflowX: 'auto', width: '100%' }}>
				<ModernTable sx={{ minWidth: 800 }}>
					<TableHead>
						<TableRow>
							<ModernTableCell sx={{ minWidth: 120 }}>Nama</ModernTableCell>
							<ModernTableCell sx={{ minWidth: 100 }}>Posisi</ModernTableCell>
							<ModernTableCell sx={{ minWidth: 120 }}>Gaji</ModernTableCell>
							<ModernTableCell sx={{ minWidth: 100 }}>Gabung</ModernTableCell>
							<ModernTableCell sx={{ minWidth: 120 }}>Telepon</ModernTableCell>
							<ModernTableCell sx={{ minWidth: 150 }}>Alamat</ModernTableCell>
							<ModernTableCell align="center" sx={{ minWidth: 140 }}>Aksi</ModernTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{(data ?? []).map((row: any) => (
							<ModernTableRow
								key={row.id}
								onClick={() => openDetail(row)}
								sx={{ cursor: 'pointer' }}
							>
								<ModernTableCell variant="name" sx={{ minWidth: 120 }}>{row.name}</ModernTableCell>
								<ModernTableCell sx={{ minWidth: 100 }}>{row.position}</ModernTableCell>
								<ModernTableCell variant="amount" sx={{ minWidth: 120 }}>Rp {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Number(row.salary) || 0)}</ModernTableCell>
								<ModernTableCell variant="date" sx={{ minWidth: 100 }}>{new Date(row.join_date).toLocaleDateString('id-ID')}</ModernTableCell>
								<ModernTableCell sx={{ minWidth: 120 }}>{row.phone || <Box sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</Box>}</ModernTableCell>
								<ModernTableCell variant="description" sx={{ minWidth: 150 }}>{row.address || <Box sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</Box>}</ModernTableCell>
								<ModernTableCell align="center" sx={{ minWidth: 140 }}>
									<Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
										<ModernIconButton
											onClick={(e: React.MouseEvent) => { e.stopPropagation(); openDetail(row); }}
											color="success"
										>
											<Visibility />
										</ModernIconButton>
										<ModernIconButton
											onClick={(e: React.MouseEvent) => { e.stopPropagation(); openEdit(row); }}
											color="primary"
										>
											<Edit />
										</ModernIconButton>
										<ModernIconButton
											onClick={(e: React.MouseEvent) => { e.stopPropagation(); remove(row.id); }}
											color="error"
										>
											<Delete />
										</ModernIconButton>
									</Box>
								</ModernTableCell>
							</ModernTableRow>
						))}
					</TableBody>
				</ModernTable>
			</Box>

			{/* Create Dialog */}
			<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>Tambah Karyawan</DialogTitle>
				<DialogContent>
					<TextField label="Nama" fullWidth margin="normal" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
					<TextField label="Posisi" fullWidth margin="normal" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
					<TextField label="Gaji" type="number" fullWidth margin="normal" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
					<TextField 
						label="Tanggal Gabung" 
						type="date" 
						InputLabelProps={{ shrink: true }} 
						fullWidth 
						margin="normal" 
						value={form.join_date ? (typeof form.join_date === 'string' ? form.join_date.slice(0,10) : new Date(form.join_date).toISOString().split('T')[0]) : ''} 
						onChange={(e) => setForm({ ...form, join_date: e.target.value })} 
					/>
					<TextField label="Telepon" fullWidth margin="normal" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
					<TextField label="Alamat" fullWidth margin="normal" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
				</DialogContent>
				<DialogActions>
					<ModernButton variant="outlined" onClick={() => setOpen(false)}>Batal</ModernButton>
					<ModernButton onClick={save}>Simpan</ModernButton>
				</DialogActions>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>Edit Karyawan</DialogTitle>
				<DialogContent>
					<Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
						<Typography variant="body2" color="text.secondary">
							Tanggal Bergabung: {form.join_date ? new Date(form.join_date).toLocaleDateString('id-ID') : '-'}
						</Typography>
					</Box>
					<TextField label="Nama" fullWidth margin="normal" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
					<TextField label="Posisi" fullWidth margin="normal" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
					<TextField label="Gaji" type="number" fullWidth margin="normal" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
					<TextField label="Telepon" fullWidth margin="normal" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
					<TextField label="Alamat" fullWidth margin="normal" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
				</DialogContent>
				<DialogActions>
					<ModernButton variant="outlined" onClick={() => setEditOpen(false)}>Batal</ModernButton>
					<ModernButton onClick={save}>Simpan</ModernButton>
				</DialogActions>
			</Dialog>

			{/* Detail Dialog */}
			<Dialog open={detailOpen} onClose={() => setDetailOpen(false)} fullWidth maxWidth="md">
				<DialogTitle>
					Detail Karyawan
					{selectedEmployee && (
						<Typography variant="subtitle1" color="text.secondary">
							{selectedEmployee.name}
						</Typography>
					)}
				</DialogTitle>
				<DialogContent>
					{detailLoading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4, gap: 2 }}>
							<CircularProgress size={24} />
							<Typography>Memuat data...</Typography>
						</Box>
					) : employeeDetail ? (
						<Box>
							{/* Employee Information */}
							<Card sx={{ mb: 3 }}>
								<CardContent>
									<Typography variant="h6" gutterBottom>Informasi Karyawan</Typography>
									<Grid container spacing={2}>
										<Grid item xs={12} sm={6}>
											<Typography variant="body2" color="text.secondary">Nama</Typography>
											<Typography variant="body1" fontWeight={500}>{employeeDetail.employee.name}</Typography>
										</Grid>
										<Grid item xs={12} sm={6}>
											<Typography variant="body2" color="text.secondary">Posisi</Typography>
											<Typography variant="body1" fontWeight={500}>{employeeDetail.employee.position}</Typography>
										</Grid>
										<Grid item xs={12} sm={6}>
											<Typography variant="body2" color="text.secondary">Gaji</Typography>
											<Typography variant="body1" fontWeight={500} color="success.main">
												Rp {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Number(employeeDetail.employee.salary) || 0)}
											</Typography>
										</Grid>
										<Grid item xs={12} sm={6}>
											<Typography variant="body2" color="text.secondary">Tanggal Gabung</Typography>
											<Typography variant="body1" fontWeight={500}>
												{new Date(employeeDetail.employee.join_date).toLocaleDateString('id-ID')}
											</Typography>
										</Grid>
										<Grid item xs={12} sm={6}>
											<Typography variant="body2" color="text.secondary">Telepon</Typography>
											<Typography variant="body1" fontWeight={500}>{employeeDetail.employee.phone || '-'}</Typography>
										</Grid>
										<Grid item xs={12}>
											<Typography variant="body2" color="text.secondary">Alamat</Typography>
											<Typography variant="body1" fontWeight={500}>{employeeDetail.employee.address || '-'}</Typography>
										</Grid>
									</Grid>
								</CardContent>
							</Card>

							{/* Summary Statistics */}
							<Card sx={{ mb: 3 }}>
								<CardContent>
									<Typography variant="h6" gutterBottom>Ringkasan Absensi 1 Bulan Terakhir</Typography>
									<Grid container spacing={2}>
										<Grid item xs={6} sm={3}>
											<Typography variant="body2" color="text.secondary">Total Hari</Typography>
											<Typography variant="h6" color="primary" fontWeight={700}>
												{employeeDetail.summary.total_days} hari
											</Typography>
										</Grid>
										<Grid item xs={6} sm={3}>
											<Typography variant="body2" color="text.secondary">Hadir</Typography>
											<Typography variant="h6" color="success.main" fontWeight={700}>
												{employeeDetail.summary.present_days} hari
											</Typography>
										</Grid>
										<Grid item xs={6} sm={3}>
											<Typography variant="body2" color="text.secondary">Ijin</Typography>
											<Typography variant="h6" color="warning.main" fontWeight={700}>
												{employeeDetail.summary.absent_days} hari
											</Typography>
										</Grid>
										<Grid item xs={6} sm={3}>
											<Typography variant="body2" color="text.secondary">Libur</Typography>
											<Typography variant="h6" color="info.main" fontWeight={700}>
												{employeeDetail.summary.holiday_days} hari
											</Typography>
										</Grid>
										<Grid item xs={6} sm={3}>
											<Typography variant="body2" color="text.secondary">Sakit</Typography>
											<Typography variant="h6" color="orange" fontWeight={700}>
												{employeeDetail.summary.sick_days} hari
											</Typography>
										</Grid>
										<Grid item xs={12}>
											<Typography variant="body2" color="text.secondary">Tingkat Kehadiran</Typography>
											<Typography variant="h6" color="primary" fontWeight={700}>
												{employeeDetail.summary.attendance_rate.toFixed(1)}%
											</Typography>
										</Grid>
									</Grid>
								</CardContent>
							</Card>

							{/* Attendances Table */}
							<Card>
								<CardContent>
									<Typography variant="h6" gutterBottom>Laporan Absensi 1 Bulan Terakhir</Typography>
									<Box sx={{ overflowX: 'auto', width: '100%' }}>
										<ModernTable sx={{ minWidth: 400 }}>
											<TableHead>
												<TableRow>
													<ModernTableCell sx={{ minWidth: 120 }}>Tanggal</ModernTableCell>
													<ModernTableCell sx={{ minWidth: 100 }}>Status</ModernTableCell>
													<ModernTableCell sx={{ minWidth: 180 }}>Catatan</ModernTableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{employeeDetail.attendances.length > 0 ? (
													employeeDetail.attendances.map((attendance: any) => (
														<ModernTableRow key={attendance.date}>
															<ModernTableCell variant="date" sx={{ minWidth: 120 }}>{new Date(attendance.date).toLocaleDateString('id-ID')}</ModernTableCell>
															<ModernTableCell sx={{ minWidth: 100 }}>
																<Chip
																	label={attendance.status === 'hadir' ? 'Hadir' : attendance.status === 'ijin' ? 'Ijin' : 'Libur'}
																	color={attendance.status === 'hadir' ? 'success' : attendance.status === 'ijin' ? 'warning' : 'info'}
																	size="small"
																/>
															</ModernTableCell>
															<ModernTableCell variant="description" sx={{ minWidth: 180 }}>{attendance.notes || <Box sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</Box>}</ModernTableCell>
														</ModernTableRow>
													))
												) : (
													<ModernTableRow>
														<ModernTableCell colSpan={3} align="center" sx={{ py: 3 }}>
															<Box sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>
																Tidak ada data absensi dalam 1 bulan terakhir
															</Box>
														</ModernTableCell>
													</ModernTableRow>
												)}
											</TableBody>
										</ModernTable>
									</Box>
								</CardContent>
							</Card>
						</Box>
					) : detailError ? (
						<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 2 }}>
							<Typography color="error" variant="h6">
								Error: {typeof detailError === 'object' && detailError !== null && 'response' in detailError ? (detailError as any).response?.data?.message : detailError instanceof Error ? detailError.message : 'Tidak dapat memuat data karyawan'}
							</Typography>
							<Typography color="text.secondary" variant="body2">
								Status: {typeof detailError === 'object' && detailError !== null && 'response' in detailError ? (detailError as any).response?.status : 'Unknown'}
							</Typography>
							<ModernButton
								variant="outlined"
								onClick={() => {
									setDetailOpen(false);
									setTimeout(() => setDetailOpen(true), 100);
								}}
							>
								Coba Lagi
							</ModernButton>
						</Box>
					) : (
						<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
							<Typography color="text.secondary">Tidak dapat memuat data karyawan</Typography>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<ModernButton variant="outlined" onClick={() => setDetailOpen(false)}>Tutup</ModernButton>
					{selectedEmployee && (
						<ModernButton
							startIcon={<Download />}
							onClick={handleDownloadEmployee}
							disabled={!selectedEmployee}
						>
							Download
						</ModernButton>
					)}
				</DialogActions>
			</Dialog>
		</Box>
	);
}