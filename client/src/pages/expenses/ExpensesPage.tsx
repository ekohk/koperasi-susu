import { Add, Download, PhotoCamera, Visibility, Edit, Delete } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, IconButton } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useRef } from 'react';
import { formatDate, formatRupiah, downloadExcel } from '../../utils/format';
import { useAuth } from '../../auth/AuthContext';
import { ModernTableCell, ModernTableRow } from '../../components/ModernTable';
import { showSuccess, showError, showWarning, showDeleteConfirm } from '../../utils/sweetalert';

const BASE_URL = 'http://localhost:5000';

export default function ExpensesPage() {
	const queryClient = useQueryClient();
	const { token } = useAuth();
	const { data } = useQuery({ queryKey: ['expenses'], queryFn: async () => (await axios.get('/api/expenses')).data.data });
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState<any>({ id: 0, category: '', amount: '', date: '', description: '' });
	const fileRef = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [detail, setDetail] = useState<any|null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (ev) => setPreview(ev.target?.result as string);
			reader.readAsDataURL(file);
		} else {
			setPreview(null);
		}
	};

	const openCreate = () => {
		setForm({ id: 0, category: '', amount: '', date: '', description: '' });
		setPreview(null);
		setOpen(true);
	};
	const openEdit = (row: any) => {
		console.log('Opening edit for row:', row);
		setForm({
			id: row.id,
			category: row.category || '',
			amount: row.amount ? parseInt(row.amount) : '',
			date: row.date || '',
			description: row.description || ''
		});
		setPreview(row.proof_image ? `${BASE_URL}/uploads/${row.proof_image}` : null);
		setOpen(true);
	};
	const openDetail = (row: any) => {
		setDetail(row);
	};

	const save = async () => {
		console.log('save called');
		console.log('form data:', {
			id: form.id,
			category: form.category,
			amount: form.amount,
			date: form.date,
			description: form.description
		});

		// More detailed validation
		if (!form.category || form.category.trim() === '') {
			showWarning('Kategori wajib diisi', 'Peringatan');
			return;
		}
		if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
			showWarning('Jumlah harus berupa angka positif', 'Peringatan');
			return;
		}
		if (!form.date || form.date.trim() === '') {
			showWarning('Tanggal wajib diisi', 'Peringatan');
			return;
		}

		try {
			const dateValue = form.date ? form.date.slice(0, 10) : '';

			// Always use FormData since backend now supports file uploads
			const formData = new FormData();
			formData.append('category', form.category.trim());
			formData.append('amount', String(Number(form.amount)));
			formData.append('date', dateValue);
			formData.append('description', form.description ? form.description.trim() : '');

			// Add file if selected
			if (fileRef.current && fileRef.current.files && fileRef.current.files[0]) {
				formData.append('proof_image', fileRef.current.files[0]);
				console.log('Sending FormData with file');
			} else {
				console.log('Sending FormData without file');
			}

			// Log FormData content for debugging
			console.log('FormData contents being sent:');
			for (let pair of formData.entries()) {
				console.log(`${pair[0]}: "${pair[1]}"`);
			}

			if (form.id) {
				console.log('Updating expense with ID:', form.id);
				await axios.put(`/api/expenses/${form.id}`, formData, {
					headers: { 'Content-Type': 'multipart/form-data' }
				});
				showSuccess('Data pengeluaran berhasil diperbarui', 'Berhasil!');
			} else {
				console.log('Creating new expense');
				await axios.post('/api/expenses', formData, {
					headers: { 'Content-Type': 'multipart/form-data' }
				});
				showSuccess('Data pengeluaran berhasil ditambahkan', 'Berhasil!');
			}
			setOpen(false);
			queryClient.invalidateQueries({ queryKey: ['expenses'] });
		} catch (err: any) {
			console.error('Save error details:', {
				message: err?.message,
				response: err?.response?.data,
				status: err?.response?.status,
				requestData: err?.config?.data
			});

			if (err.response && err.response.status === 400 && err.response.data && err.response.data.errors) {
				const msg = err.response.data.errors.map((e: any) => `${e.param}: ${e.msg}`).join(', ');
				showError('Gagal menyimpan data pengeluaran: ' + msg, 'Gagal Menyimpan');
			} else {
				showError('Gagal menyimpan data pengeluaran: ' + (err?.response?.data?.message || err?.message || 'Terjadi kesalahan'), 'Gagal Menyimpan');
			}
		}
	};

	const remove = async (id: number) => {
		const confirmed = await showDeleteConfirm('pengeluaran ini');
		if (!confirmed) return;
		try {
			await axios.delete(`/api/expenses/${id}`);
			queryClient.invalidateQueries({ queryKey: ['expenses'] });
			showSuccess('Data pengeluaran berhasil dihapus', 'Berhasil!');
		} catch (err: any) {
			showError('Gagal menghapus data pengeluaran: ' + (err?.response?.data?.message || err?.message || 'Terjadi kesalahan'), 'Gagal Menghapus');
		}
	};

	const doExport = () => downloadExcel('/api/expenses/export/excel', token || undefined);

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
			{/* Modern Header */}
			<Box sx={{ mb: 4, p: { xs: 3, md: 4 }, bgcolor: 'white', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 0.5 }}>
							Pengeluaran
						</Typography>
						<Typography variant="body2" sx={{ color: '#6b7280' }}>
							Kelola dan pantau semua pengeluaran koperasi
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', gap: 1.5 }}>
						<Button
							variant="outlined"
							startIcon={<Download />}
							onClick={doExport}
							sx={{
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 600,
								borderColor: '#22c55e',
								color: '#22c55e',
								'&:hover': {
									borderColor: '#16a34a',
									bgcolor: '#f0fdf4'
								}
							}}
						>
							Download
						</Button>
						<Button
							variant="contained"
							startIcon={<Add />}
							onClick={openCreate}
							sx={{
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 600,
								bgcolor: '#22c55e',
								'&:hover': {
									bgcolor: '#16a34a'
								}
							}}
						>
							Tambah
						</Button>
					</Box>
				</Box>
			</Box>

			{/* Table Card */}
			<Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', bgcolor: '#ffffff' }}>
				<CardContent sx={{ p: 0 }}>
						<Table sx={{ '& .MuiTableCell-head': { bgcolor: '#f9fafb', color: '#374151', fontWeight: 600, fontSize: '0.875rem' } }}>
							<TableHead>
								<TableRow>
									<TableCell sx={{ py: 2, px: 3 }}>Kategori</TableCell>
									<TableCell sx={{ py: 2, px: 3 }}>Jumlah</TableCell>
									<TableCell sx={{ py: 2, px: 3 }}>Tanggal</TableCell>
									<TableCell sx={{ py: 2, px: 3 }}>Keterangan</TableCell>
									<TableCell sx={{ py: 2, px: 3 }}>Bukti</TableCell>
									<TableCell align="right" sx={{ py: 2, px: 3 }}>Aksi</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(data ?? []).map((row: any) => (
									<ModernTableRow key={row.id}>
										<ModernTableCell variant="name">{row.category}</ModernTableCell>
										<ModernTableCell variant="amount">{formatRupiah(row.amount)}</ModernTableCell>
										<ModernTableCell variant="date">{formatDate(row.date)}</ModernTableCell>
										<ModernTableCell variant="description">{row.description}</ModernTableCell>
										<ModernTableCell>
											{row.proof_image ? (
												<a href={`${BASE_URL}/uploads/${row.proof_image}`} target="_blank" rel="noopener noreferrer">
													<img src={`${BASE_URL}/uploads/${row.proof_image}`} alt="Bukti" style={{
														maxWidth: 60,
														maxHeight: 60,
														borderRadius: 8,
														border: '1px solid #e5e7eb',
														objectFit: 'cover'
													}} />
												</a>
											) : (
												<Box sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</Box>
											)}
										</ModernTableCell>
										<ModernTableCell align="right">
											<Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
												<IconButton
													size="small"
													onClick={() => openDetail(row)}
													sx={{
														color: '#22c55e',
														'&:hover': { bgcolor: '#f0fdf4' }
													}}
												>
													<Visibility fontSize="small" />
												</IconButton>
												<IconButton
													size="small"
													onClick={() => openEdit(row)}
													sx={{
														color: '#3b82f6',
														'&:hover': { bgcolor: '#eff6ff' }
													}}
												>
													<Edit fontSize="small" />
												</IconButton>
												<IconButton
													size="small"
													onClick={() => remove(row.id)}
													sx={{
														color: '#ef4444',
														'&:hover': { bgcolor: '#fef2f2' }
													}}
												>
													<Delete fontSize="small" />
												</IconButton>
											</Box>
										</ModernTableCell>
									</ModernTableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

			<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>{form.id ? 'Edit' : 'Tambah'} Pengeluaran</DialogTitle>
				<DialogContent>
					{form.id > 0 && (
						<Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
							<Typography variant="body2" color="text.secondary">Tanggal: {form.date ? formatDate(form.date) : '-'}</Typography>
						</Box>
					)}
					<TextField label="Kategori" fullWidth margin="normal" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
					<TextField label="Jumlah" type="number" fullWidth margin="normal" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
					{form.id === 0 && (
						<TextField label="Tanggal" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" value={form.date?.slice(0,10) || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} />
					)}
					<TextField label="Keterangan" fullWidth margin="normal" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
					<input type="file" ref={fileRef} accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
					<Button variant="outlined" startIcon={<PhotoCamera />} onClick={() => fileRef.current?.click()} sx={{ mt: 2 }}>
						Pilih Foto
					</Button>
					{preview && (
						<Box sx={{ mt: 2, mb: 1 }}>
							<img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, border: '1px solid #eee' }} />
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Batal</Button>
					<Button variant="contained" onClick={save}>Simpan</Button>
				</DialogActions>
			</Dialog>
			{/* Dialog detail pengeluaran */}
			<Dialog open={!!detail} onClose={() => setDetail(null)} fullWidth maxWidth="sm">
				<DialogTitle>Detail Pengeluaran</DialogTitle>
				<DialogContent>
					{detail && (
						<Card sx={{ mb: 2, p: 2 }}>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<Typography variant="body2" color="text.secondary">Kategori</Typography>
									<Typography variant="body1" fontWeight={500}>{detail.category}</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="body2" color="text.secondary">Jumlah</Typography>
									<Typography variant="body1" fontWeight={500}>{formatRupiah(detail.amount)}</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="body2" color="text.secondary">Tanggal</Typography>
									<Typography variant="body1" fontWeight={500}>{formatDate(detail.date)}</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="body2" color="text.secondary">Keterangan</Typography>
									<Typography variant="body1" fontWeight={500}>{detail.description || '-'}</Typography>
								</Grid>
								{detail.proof_image && (
									<Grid item xs={12}>
										<Typography variant="body2" color="text.secondary">Bukti</Typography>
										<Box sx={{ mt: 1 }}>
											<img src={`${BASE_URL}/uploads/${detail.proof_image}`} alt="Bukti" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, border: '1px solid #eee' }} />
										</Box>
									</Grid>
								)}
							</Grid>
						</Card>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDetail(null)}>Tutup</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
