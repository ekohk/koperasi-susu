import { Add, Delete, Download, Edit } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Alert, Chip, IconButton } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { formatNumber, formatRupiah, downloadExcel } from '../../utils/format';
import { useAuth } from '../../auth/AuthContext';
import PageHeader from '../../components/PageHeader';
import ModernTable, { ModernTableCell, ModernTableRow } from '../../components/ModernTable';
import ModernButton, { ModernIconButton } from '../../components/ModernButton';
import { showSuccess, showError, showWarning, showConfirm, showDeleteConfirm } from '../../utils/sweetalert';
import Swal from 'sweetalert2';

export default function CollectionsPage() {
	const [filters, setFilters] = useState({ start_date: '', end_date: '' });
	const { token } = useAuth();
	const queryClient = useQueryClient();
	const { data, refetch } = useQuery({
		queryKey: ['collections', filters],
		queryFn: async () => (await axios.get('/api/collections', { params: filters })).data.data
	});

	// Ubah fungsi export agar seragam dengan pengeluaran
	const doExport = () => downloadExcel('/api/collections/export/excel', token || undefined);

	// Dialog tambah koleksi
	const [open, setOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [editingCollection, setEditingCollection] = useState<any>(null);
	const [collectors, setCollectors] = useState<any[]>([]);
	const [form, setForm] = useState<any>({ collector_id: '', morning_amount: '', afternoon_amount: '', date: dayjs().format('YYYY-MM-DD'), price_per_liter: '' });
	const [editForm, setEditForm] = useState<any>({ id: 0, morning_amount: '', afternoon_amount: '', price_per_liter: '' });

	// Dialog hapus per bulan
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteForm, setDeleteForm] = useState<any>({ year: dayjs().year(), month: dayjs().month() + 1 });
	const [availableMonths, setAvailableMonths] = useState<any[]>([]);
	const [selectedMonthData, setSelectedMonthData] = useState<any>(null);

	const loadCollectors = async () => {
		try {
			const res = await axios.get('/api/collectors');
			setCollectors(res.data?.data ?? []);
		} catch (error: any) {
			console.error('Gagal memuat daftar pengepul:', error?.response?.data || error?.message || error);
			showError('Gagal memuat daftar pengepul', 'Kesalahan Sistem');
			setCollectors([]);
		}
	};

	useEffect(() => {
		loadCollectors();
		// Load available months for bulk delete
		axios.get('/api/collections/stats/available-months')
			.then(res => setAvailableMonths(res.data.data))
			.catch(err => {
				console.error('Gagal memuat daftar bulan:', err?.response?.data || err?.message || err);
				showError('Gagal memuat daftar bulan tersedia', 'Kesalahan Sistem');
				setAvailableMonths([]);
			});
	}, []);

	const openCreate = async () => {
		setForm({ collector_id: '', morning_amount: '', afternoon_amount: '', date: dayjs().format('YYYY-MM-DD'), price_per_liter: '' });
		if (!collectors.length) {
			await loadCollectors();
		}
		setOpen(true);
	};


	const save = async () => {
		try {
			await axios.post('/api/collections', {
				collector_id: Number(form.collector_id),
				morning_amount: Number(form.morning_amount || 0),
				afternoon_amount: Number(form.afternoon_amount || 0),
				date: form.date,
				price_per_liter: Number(form.price_per_liter)
			});
			showSuccess('Data koleksi susu berhasil ditambahkan!', 'Berhasil');
			setOpen(false);
			queryClient.invalidateQueries({ queryKey: ['collections'] });
		} catch (err: any) {
			console.error('Save error:', err);
			showError('Gagal menyimpan data: ' + (err?.response?.data?.message || err?.message || 'Kesalahan tidak diketahui'), 'Gagal Menyimpan');
		}
	};

	const openEdit = (row: any) => {
		setEditingCollection(row);
		setEditForm({
			id: row.id,
			morning_amount: row.morning_amount ? parseFloat(row.morning_amount) : '',
			afternoon_amount: row.afternoon_amount ? parseFloat(row.afternoon_amount) : '',
			price_per_liter: row.price_per_liter ? parseInt(row.price_per_liter) : ''
		});
		setEditOpen(true);
	};

	const saveEdit = async () => {
		try {
			await axios.put(`/api/collections/${editForm.id}`, {
				morning_amount: Number(editForm.morning_amount || 0),
				afternoon_amount: Number(editForm.afternoon_amount || 0),
				price_per_liter: Number(editForm.price_per_liter)
			});
			showSuccess('Data koleksi susu berhasil diperbarui!', 'Berhasil');
			setEditOpen(false);
			queryClient.invalidateQueries({ queryKey: ['collections'] });
		} catch (err: any) {
			console.error('Update error:', err);
			showError('Gagal memperbarui data: ' + (err?.response?.data?.message || err?.message || 'Kesalahan tidak diketahui'), 'Gagal Memperbarui');
		}
	};

	const deleteCollection = async (id: number) => {
		const confirmed = await showDeleteConfirm('data koleksi susu ini');
		if (!confirmed) return;
		try {
			await axios.delete(`/api/collections/${id}`);
			showSuccess('Data koleksi susu berhasil dihapus!', 'Berhasil');
			queryClient.invalidateQueries({ queryKey: ['collections'] });
		} catch (err: any) {
			console.error('Delete error:', err);
			showError('Gagal menghapus data: ' + (err?.response?.data?.message || err?.message || 'Kesalahan tidak diketahui'), 'Gagal Menghapus');
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

		// Format angka dengan benar
		const formattedLiters = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(selectedMonthData.total_liters || 0);
		const formattedIncome = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(selectedMonthData.total_income || 0);

		const result = await Swal.fire({
			icon: 'warning',
			title: 'Konfirmasi Hapus Bulanan',
			html: `
				<p>Apakah Anda yakin ingin menghapus <strong>${selectedMonthData.record_count}</strong> data koleksi susu untuk bulan <strong>${deleteForm.month}/${deleteForm.year}</strong>?</p>
				<div style="text-align: left; margin-top: 1rem; padding: 1rem; background: #f3f4f6; border-radius: 0.5rem;">
					<p style="margin: 0.5rem 0;"><strong>Total:</strong> ${selectedMonthData.record_count} record</p>
					<p style="margin: 0.5rem 0;"><strong>Total Liter:</strong> ${formattedLiters} L</p>
					<p style="margin: 0.5rem 0;"><strong>Total Pengeluaran:</strong> Rp ${formattedIncome}</p>
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
			await axios.delete('/api/collections/bulk/delete-by-month', {
				data: { year: deleteForm.year, month: deleteForm.month }
			});
			
			setDeleteDialogOpen(false);
			queryClient.invalidateQueries({ queryKey: ['collections'] });
			
			// Refresh available months
			const res = await axios.get('/api/collections/stats/available-months');
			setAvailableMonths(res.data.data);
			
			showSuccess('Data bulanan berhasil dihapus!', 'Berhasil');
		} catch (error: any) {
			showError('Gagal menghapus data bulanan: ' + (error.response?.data?.message || error.message || 'Kesalahan tidak diketahui'), 'Gagal Menghapus');
		}
	};

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
			<PageHeader
				title="Koleksi Susu"
				description="Kelola data koleksi susu harian dari pengepul"
				actions={
					<>
						<TextField
							type="date"
							label="Mulai"
							InputLabelProps={{ shrink: true }}
							size="small"
							value={filters.start_date}
							onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
							sx={{ borderRadius: 2 }}
						/>
						<TextField
							type="date"
							label="Selesai"
							InputLabelProps={{ shrink: true }}
							size="small"
							value={filters.end_date}
							onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
							sx={{ borderRadius: 2 }}
						/>
						<ModernButton variant="outlined" startIcon={<Download />} onClick={doExport}>
							Download
						</ModernButton>
						<ModernButton startIcon={<Add />} onClick={openCreate}>
							Tambah
						</ModernButton>
						<ModernButton
							variant="outlined"
							startIcon={<Delete />}
							onClick={openDeleteDialog}
							color="error"
						>
							Hapus Per Bulan
						</ModernButton>
					</>
				}
			/>

			<ModernTable>
				<TableHead>
					<TableRow>
						<ModernTableCell>Tanggal</ModernTableCell>
						<ModernTableCell>Pengepul</ModernTableCell>
						<ModernTableCell align="right">Pagi (L)</ModernTableCell>
						<ModernTableCell align="right">Sore (L)</ModernTableCell>
						<ModernTableCell align="right">Total (L)</ModernTableCell>
						<ModernTableCell align="right">Harga/L</ModernTableCell>
						<ModernTableCell align="right">Pendapatan</ModernTableCell>
						<ModernTableCell align="center">Aksi</ModernTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{(data ?? []).map((row: any) => (
						<ModernTableRow key={row.id}>
							<ModernTableCell variant="date">{dayjs(row.date).format('DD/MM/YYYY')}</ModernTableCell>
							<ModernTableCell variant="name">{row.collector_name}</ModernTableCell>
							<ModernTableCell align="right">{formatNumber(row.morning_amount)}</ModernTableCell>
							<ModernTableCell align="right">{formatNumber(row.afternoon_amount)}</ModernTableCell>
							<ModernTableCell align="right">{formatNumber(row.total_amount)}</ModernTableCell>
							<ModernTableCell align="right" variant="amount">{formatRupiah(row.price_per_liter)}</ModernTableCell>
							<ModernTableCell align="right" variant="amount">{formatRupiah(row.total_income)}</ModernTableCell>
							<ModernTableCell align="center">
								<ModernIconButton color="primary" onClick={() => openEdit(row)}>
									<Edit />
								</ModernIconButton>
								<ModernIconButton color="error" onClick={() => deleteCollection(row.id)}>
									<Delete />
								</ModernIconButton>
							</ModernTableCell>
						</ModernTableRow>
					))}
				</TableBody>
			</ModernTable>

			<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>Tambah Koleksi Susu</DialogTitle>
				<DialogContent>
					<Select fullWidth value={form.collector_id} onChange={(e) => setForm({ ...form, collector_id: e.target.value })} sx={{ mt: 2 }} displayEmpty>
						<MenuItem value="" disabled>Pilih Pengepul</MenuItem>
						{collectors.map((c) => (
							<MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
						))}
					</Select>
					<TextField label="Tanggal" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
					<TextField label="Jumlah Pagi (L)" type="number" fullWidth margin="normal" value={form.morning_amount} onChange={(e) => setForm({ ...form, morning_amount: e.target.value })} />
					<TextField label="Jumlah Sore (L)" type="number" fullWidth margin="normal" value={form.afternoon_amount} onChange={(e) => setForm({ ...form, afternoon_amount: e.target.value })} />
					<TextField label="Harga per Liter" type="number" fullWidth margin="normal" value={form.price_per_liter} onChange={(e) => setForm({ ...form, price_per_liter: e.target.value })} />
				</DialogContent>
				<DialogActions>
					<ModernButton variant="outlined" onClick={() => setOpen(false)}>Batal</ModernButton>
					<ModernButton onClick={save} disabled={(Number(form.morning_amount || 0) <= 0) && (Number(form.afternoon_amount || 0) <= 0)}>Simpan</ModernButton>
				</DialogActions>
			</Dialog>

			{/* Dialog Edit Koleksi */}
			<Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>Edit Koleksi Susu</DialogTitle>
				<DialogContent>
					{editingCollection && (
						<>
							<Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
								<Typography variant="body2" color="text.secondary">Tanggal: {dayjs(editingCollection.date).format('DD/MM/YYYY')}</Typography>
								<Typography variant="body2" color="text.secondary">Pengepul: {editingCollection.collector_name}</Typography>
							</Box>
							
							{editingCollection.morning_amount > 0 && (
								<TextField 
									label="Jumlah Pagi (L)" 
									type="number" 
									fullWidth 
									margin="normal" 
									value={editForm.morning_amount} 
									onChange={(e) => setEditForm({ ...editForm, morning_amount: e.target.value })} 
								/>
							)}
							
							{editingCollection.afternoon_amount > 0 && (
								<TextField 
									label="Jumlah Sore (L)" 
									type="number" 
									fullWidth 
									margin="normal" 
									value={editForm.afternoon_amount} 
									onChange={(e) => setEditForm({ ...editForm, afternoon_amount: e.target.value })} 
								/>
							)}
							
							<TextField 
								label="Harga per Liter" 
								type="number" 
								fullWidth 
								margin="normal" 
								value={editForm.price_per_liter} 
								onChange={(e) => setEditForm({ ...editForm, price_per_liter: e.target.value })} 
							/>
						</>
					)}
				</DialogContent>
				<DialogActions>
					<ModernButton variant="outlined" onClick={() => setEditOpen(false)}>Batal</ModernButton>
					<ModernButton onClick={saveEdit}>Simpan</ModernButton>
				</DialogActions>
			</Dialog>

			{/* Dialog Hapus Per Bulan */}
			<Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>Hapus Data Koleksi Susu Per Bulan</DialogTitle>
				<DialogContent>
					<Alert severity="warning" sx={{ mb: 2 }}>
						<strong>Peringatan!</strong> Tindakan ini akan menghapus semua data koleksi susu untuk bulan yang dipilih. 
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
								<Grid item xs={4}>
									<Typography variant="body2" color="text.secondary">Total Record</Typography>
									<Typography variant="h6" color="primary">
										{selectedMonthData.record_count}
									</Typography>
								</Grid>
								<Grid item xs={4}>
									<Typography variant="body2" color="text.secondary">Total Liter</Typography>
									<Typography variant="h6" color="success.main">
										{new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(selectedMonthData.total_liters || 0)} L
									</Typography>
								</Grid>
								<Grid item xs={4}>
									<Typography variant="body2" color="text.secondary">Total Pengeluaran</Typography>
									<Typography variant="h6" color="error.main">
										Rp {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(selectedMonthData.total_income || 0)}
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
		</Box>
	);
}
