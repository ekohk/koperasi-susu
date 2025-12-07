import { Add, Download, PhotoCamera, Visibility, Edit, Delete } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, IconButton } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRef, useState } from 'react';
import { formatDate, formatRupiah, downloadExcel } from '../../utils/format';
import { useAuth } from '../../auth/AuthContext';
import PageHeader from '../../components/PageHeader';
import ModernTable, { ModernTableCell, ModernTableRow } from '../../components/ModernTable';
import ModernButton, { ModernIconButton } from '../../components/ModernButton';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetalert';

const BASE_URL = 'http://localhost:5000';

export default function MaintenancesPage() {
	const queryClient = useQueryClient();
	const { token } = useAuth();
	const { data } = useQuery({ queryKey: ['maintenances'], queryFn: async () => (await axios.get('/api/maintenances')).data.data });
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState<any>({ id: 0, item_name: '', start_date: '', end_date: '', cost: '', description: '' });
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
		setForm({ id: 0, item_name: '', start_date: '', end_date: '', cost: '', description: '' });
		setPreview(null);
		setOpen(true);
	};
	const openEdit = (row: any) => {
		setForm({
			...row,
			cost: row.cost ? parseInt(row.cost) : ''
		});
		setPreview(row.photo_path ? `${BASE_URL}/uploads/${row.photo_path}` : null);
		setOpen(true);
	};
	const openDetail = (row: any) => {
		setDetail(row);
	};

	const save = async () => {
		try {
			console.log('Form data before save:', form);

			const fd = new FormData();
			fd.append('item_name', form.item_name);
			// Ensure dates are in YYYY-MM-DD format
			fd.append('start_date', form.start_date ? form.start_date.slice(0, 10) : '');
			fd.append('end_date', form.end_date ? form.end_date.slice(0, 10) : '');
			fd.append('cost', String(form.cost));
			fd.append('description', form.description ?? '');
			if (fileRef.current?.files?.[0]) fd.append('photo', fileRef.current.files[0]);

			// Log FormData contents
			console.log('FormData contents:');
			for (let [key, value] of fd.entries()) {
				console.log(key, value);
			}

			if (form.id) {
				console.log('Updating maintenance with ID:', form.id);
				await axios.put(`/api/maintenances/${form.id}`, fd);
				showSuccess('Data pemeliharaan berhasil diperbarui', 'Berhasil!');
			} else {
				console.log('Creating new maintenance');
				await axios.post('/api/maintenances', fd);
				showSuccess('Data pemeliharaan berhasil ditambahkan', 'Berhasil!');
			}

			setOpen(false);
			queryClient.invalidateQueries({ queryKey: ['maintenances'] });
		} catch (err: any) {
			console.error('Save error details:', {
				message: err?.message,
				response: err?.response?.data,
				status: err?.response?.status,
				config: err?.config
			});
			showError('Gagal menyimpan data pemeliharaan: ' + (err?.response?.data?.message || err?.message || 'Terjadi kesalahan'), 'Gagal Menyimpan');
		}
	};

	const remove = async (id: number) => {
		const confirmed = await showDeleteConfirm('pemeliharaan ini');
		if (!confirmed) return;
		try {
			await axios.delete(`/api/maintenances/${id}`);
			queryClient.invalidateQueries({ queryKey: ['maintenances'] });
			showSuccess('Data pemeliharaan berhasil dihapus', 'Berhasil!');
		} catch (err: any) {
			showError('Gagal menghapus data pemeliharaan: ' + (err?.response?.data?.message || err?.message || 'Terjadi kesalahan'), 'Gagal Menghapus');
		}
	};

	const doExport = () => downloadExcel('/api/maintenances/export/excel', token || undefined);

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
			<PageHeader
				title="Pemeliharaan"
				description="Kelola data pemeliharaan peralatan dan biaya"
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
						<ModernTableCell>Peralatan</ModernTableCell>
						<ModernTableCell>Mulai</ModernTableCell>
						<ModernTableCell>Selesai</ModernTableCell>
						<ModernTableCell>Biaya</ModernTableCell>
						<ModernTableCell>Keterangan</ModernTableCell>
						<ModernTableCell>Bukti</ModernTableCell>
						<ModernTableCell align="right">Aksi</ModernTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{(data ?? []).map((row: any) => (
						<ModernTableRow key={row.id}>
							<ModernTableCell variant="name">{row.item_name}</ModernTableCell>
							<ModernTableCell variant="date">{formatDate(row.start_date)}</ModernTableCell>
							<ModernTableCell variant="date">{formatDate(row.end_date)}</ModernTableCell>
							<ModernTableCell variant="amount">{formatRupiah(row.cost)}</ModernTableCell>
							<ModernTableCell variant="description">{row.description || <Box sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</Box>}</ModernTableCell>
							<ModernTableCell>
								{row.photo_path ? (
									<a href={`${BASE_URL}/uploads/${row.photo_path}`} target="_blank" rel="noopener noreferrer">
										<img src={`${BASE_URL}/uploads/${row.photo_path}`} alt="Foto" style={{
											maxWidth: 60,
											maxHeight: 60,
											borderRadius: 8,
											border: '1px solid #e5e7eb',
											objectFit: 'cover'
										}} />
									</a>
								) : <Box sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</Box>}
							</ModernTableCell>
							<ModernTableCell align="right">
								<ModernIconButton color="success" onClick={() => openDetail(row)}>
									<Visibility />
								</ModernIconButton>
								<ModernIconButton color="primary" onClick={() => openEdit(row)}>
									<Edit />
								</ModernIconButton>
								<ModernIconButton color="error" onClick={() => remove(row.id)}>
									<Delete />
								</ModernIconButton>
							</ModernTableCell>
						</ModernTableRow>
					))}
				</TableBody>
			</ModernTable>

			<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
				<DialogTitle>{form.id ? 'Edit' : 'Tambah'} Pemeliharaan</DialogTitle>
				<DialogContent>
					{form.id > 0 && (
						<Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
							<Typography variant="body2" color="text.secondary">Tanggal Mulai: {form.start_date ? formatDate(form.start_date) : '-'}</Typography>
							<Typography variant="body2" color="text.secondary">Tanggal Selesai: {form.end_date ? formatDate(form.end_date) : '-'}</Typography>
						</Box>
					)}
					<TextField label="Peralatan" fullWidth margin="normal" value={form.item_name} onChange={(e) => setForm({ ...form, item_name: e.target.value })} />
					{form.id === 0 && (
						<>
							<TextField label="Tanggal Mulai" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" value={form.start_date?.slice(0,10) || ''} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
							<TextField label="Tanggal Selesai" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" value={form.end_date?.slice(0,10) || ''} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
						</>
					)}
					<TextField label="Biaya" type="number" fullWidth margin="normal" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
					<TextField label="Keterangan" fullWidth margin="normal" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
					<input type="file" ref={fileRef} accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
					<ModernButton variant="outlined" startIcon={<PhotoCamera />} onClick={() => fileRef.current?.click()}>
						Pilih Foto
					</ModernButton>
					{preview && (
						<Box sx={{ mt: 2, mb: 1 }}>
							<img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, border: '1px solid #eee' }} />
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<ModernButton variant="outlined" onClick={() => setOpen(false)}>Batal</ModernButton>
					<ModernButton onClick={save}>Simpan</ModernButton>
				</DialogActions>
			</Dialog>

			{/* Dialog detail pemeliharaan */}
			<Dialog open={!!detail} onClose={() => setDetail(null)} fullWidth maxWidth="sm">
				<DialogTitle>Detail Pemeliharaan</DialogTitle>
				<DialogContent>
					{detail && (
						<Card sx={{ mb: 2, p: 2 }}>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<Typography variant="body2" color="text.secondary">Peralatan</Typography>
									<Typography variant="body1" fontWeight={500}>{detail.item_name}</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="body2" color="text.secondary">Biaya</Typography>
									<Typography variant="body1" fontWeight={500}>{formatRupiah(detail.cost)}</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="body2" color="text.secondary">Tanggal Mulai</Typography>
									<Typography variant="body1" fontWeight={500}>{formatDate(detail.start_date)}</Typography>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Typography variant="body2" color="text.secondary">Tanggal Selesai</Typography>
									<Typography variant="body1" fontWeight={500}>{formatDate(detail.end_date)}</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="body2" color="text.secondary">Keterangan</Typography>
									<Typography variant="body1" fontWeight={500}>{detail.description || '-'}</Typography>
								</Grid>
								{detail.photo_path && (
									<Grid item xs={12}>
										<Typography variant="body2" color="text.secondary">Foto</Typography>
										<Box sx={{ mt: 1 }}>
											<img src={`${BASE_URL}/uploads/${detail.photo_path}`} alt="Foto" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, border: '1px solid #eee' }} />
										</Box>
									</Grid>
								)}
							</Grid>
						</Card>
					)}
				</DialogContent>
				<DialogActions>
					<ModernButton variant="outlined" onClick={() => setDetail(null)}>Tutup</ModernButton>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
