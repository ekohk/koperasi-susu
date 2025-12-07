import { Add, Download, PhotoCamera, Visibility, Edit, Delete } from '@mui/icons-material';
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TableBody, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useRef } from 'react';
import { formatDate, formatRupiah, downloadExcel } from '../../utils/format';
import { useAuth } from '../../auth/AuthContext';
import dayjs from 'dayjs';
import PageHeader from '../../components/PageHeader';
import ModernTable, { ModernTableCell, ModernTableRow } from '../../components/ModernTable';
import ModernButton, { ModernIconButton } from '../../components/ModernButton';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetalert';

const BASE_URL = 'http://localhost:5000';

export default function IncomesPage() {
	const queryClient = useQueryClient();
	const { token } = useAuth();
	const { data } = useQuery({ queryKey: ['incomes'], queryFn: async () => (await axios.get('/api/incomes')).data.data });
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState<any>({ id: 0, source: '', amount: '', date: '', description: '' });
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
		setForm({ id: 0, source: '', amount: '', date: '', description: '' });
		setPreview(null);
		setOpen(true);
	};
	const openEdit = (row: any) => {
		// Ensure date is in YYYY-MM-DD format for date input
		const formattedDate = row.date ? new Date(row.date).toISOString().split('T')[0] : '';
		setForm({
			...row,
			amount: row.amount ? parseInt(row.amount) : '',
			date: formattedDate
		});
		setPreview(row.proof_image ? `${BASE_URL}/uploads/${row.proof_image}` : null);
		setOpen(true);
	};
	const openDetail = (row: any) => {
		setDetail(row);
	};

	const save = async () => {
		console.log('save called');
		console.log('form:', form);
		try {
			const formData = new FormData();
			formData.append('source', form.source);
			formData.append('amount', form.amount);
			// Only append date for new records, not for edits
			if (!form.id) {
				formData.append('date', form.date);
			}
			formData.append('description', form.description);
			if (fileRef.current && fileRef.current.files && fileRef.current.files[0]) {
				formData.append('proof_image', fileRef.current.files[0]);
			}
			// Log FormData content
			for (let pair of formData.entries()) {
				console.log(pair[0]+ ':', pair[1]);
			}
			if (form.id) {
				await axios.put(`/api/incomes/${form.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
			} else {
				await axios.post('/api/incomes', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
			}
			setOpen(false);
			queryClient.invalidateQueries({ queryKey: ['incomes'] });
			showSuccess('Data pemasukan berhasil disimpan', 'Berhasil!');
		} catch (err: any) {
			console.error('Save error:', err);
			if (err.response && err.response.status === 400 && err.response.data && err.response.data.errors) {
				const msg = err.response.data.errors.map((e: any) => e.msg).join(', ');
				showError('Gagal menyimpan data pemasukan: ' + msg, 'Gagal Menyimpan');
			} else {
				showError('Gagal menyimpan data pemasukan: ' + (err?.message || 'Terjadi kesalahan'), 'Gagal Menyimpan');
			}
		}
	};

	const remove = async (id: number) => {
		const confirmed = await showDeleteConfirm('pemasukan ini');
		if (!confirmed) return;
		try {
			await axios.delete(`/api/incomes/${id}`);
			queryClient.invalidateQueries({ queryKey: ['incomes'] });
			showSuccess('Data pemasukan berhasil dihapus', 'Berhasil!');
		} catch (err: any) {
			showError('Gagal menghapus data pemasukan: ' + (err?.response?.data?.message || err?.message || 'Terjadi kesalahan'), 'Gagal Menghapus');
		}
	};

	const doExport = () => downloadExcel('/api/incomes/export/excel', token || undefined);

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
			<PageHeader
				title="Pemasukan"
				description="Kelola dan pantau semua pemasukan koperasi"
				actions={
					<>
						<ModernButton variant="outlined" startIcon={<Download />} onClick={doExport}>
							Download
						</ModernButton>
						<ModernButton startIcon={<Add />} onClick={openCreate}>
							Tambah
						</ModernButton>
					</>
				}
			/>

			<ModernTable>
				<TableHead>
					<TableRow>
						<ModernTableCell>Sumber</ModernTableCell>
						<ModernTableCell>Jumlah</ModernTableCell>
						<ModernTableCell>Tanggal</ModernTableCell>
						<ModernTableCell>Keterangan</ModernTableCell>
						<ModernTableCell>Bukti</ModernTableCell>
						<ModernTableCell align="right">Aksi</ModernTableCell>
					</TableRow>
			</TableHead>
			<TableBody>
				{(data ?? []).map((row: any) => (
					<ModernTableRow key={row.id}>
						<ModernTableCell variant="name">{row.source}</ModernTableCell>
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
								<ModernIconButton onClick={() => openDetail(row)} color="success">
									<Visibility fontSize="small" />
								</ModernIconButton>
								<ModernIconButton onClick={() => openEdit(row)} color="primary">
									<Edit fontSize="small" />
								</ModernIconButton>
								<ModernIconButton onClick={() => remove(row.id)} color="error">
									<Delete fontSize="small" />
								</ModernIconButton>
							</Box>
						</ModernTableCell>
					</ModernTableRow>
				))}
			</TableBody>
		</ModernTable>

			<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>{form.id ? 'Edit' : 'Tambah'} Pemasukan</DialogTitle>
				<DialogContent>
					<TextField label="Sumber" fullWidth margin="normal" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
					<TextField label="Jumlah" type="number" fullWidth margin="normal" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
					{!form.id && (
						<TextField 
							label="Tanggal" 
							type="date" 
							InputLabelProps={{ shrink: true }} 
							fullWidth 
							margin="normal" 
							value={form.date?.slice(0,10) || ''} 
							onChange={(e) => setForm({ ...form, date: e.target.value })}
						/>
					)}
					{form.id ? (
						<Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
							<Typography variant="body2" color="text.secondary">
								Tanggal: {dayjs(form.date).format('DD/MM/YYYY')}
							</Typography>
						</Box>
					) : null}
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
			{/* Dialog detail pemasukan */}
			<Dialog open={!!detail} onClose={() => setDetail(null)} fullWidth maxWidth="sm">
				<DialogTitle>Detail Pemasukan</DialogTitle>
				<DialogContent>
					{detail && (
						<Card sx={{ mb: 2, p: 2 }}>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<Typography variant="body2" color="text.secondary">Sumber</Typography>
									<Typography variant="body1" fontWeight={500}>{detail.source}</Typography>
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
