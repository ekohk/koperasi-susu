import { Add, Visibility, Download, Edit, Delete } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Chip, Divider } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { downloadExcel } from '../../utils/format';
import { useAuth } from '../../auth/AuthContext';
import PageHeader from '../../components/PageHeader';
import ModernTable, { ModernTableCell, ModernTableRow } from '../../components/ModernTable';
import ModernButton, { ModernIconButton } from '../../components/ModernButton';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetalert';

export default function CollectorsPage() {
	const queryClient = useQueryClient();
	const { data } = useQuery({ queryKey: ['collectors'], queryFn: async () => (await axios.get('/api/collectors')).data.data });
	const [open, setOpen] = useState(false);
	const [detailOpen, setDetailOpen] = useState(false);
	const [selectedCollector, setSelectedCollector] = useState<any>(null);
	const [form, setForm] = useState({ id: 0, name: '', address: '', phone: '' });
	const { token } = useAuth();

	// Query for collector detail
	const { data: collectorDetail, isLoading: detailLoading, error: detailError } = useQuery({
		queryKey: ['collector-detail', selectedCollector?.id],
		queryFn: async () => {
			if (!selectedCollector) return null;
			try {
				const response = await axios.get(`/api/collectors/${selectedCollector.id}`);
				return response.data.data;
			} catch (error) {
				throw error;
			}
		},
		enabled: !!selectedCollector && detailOpen,
		retry: 1
	});

	const openCreate = () => { setForm({ id: 0, name: '', address: '', phone: '' }); setOpen(true); };
	const openEdit = (row: any) => { setForm(row); setOpen(true); };
	
	const openDetail = async (collector: any) => {
		setSelectedCollector(collector);
		setDetailOpen(true);
	};

	const save = async () => {
		try {
			if (form.id) {
				await axios.put(`/api/collectors/${form.id}`, form);
				showSuccess('Data pengepul berhasil diperbarui', 'Berhasil!');
			} else {
				await axios.post('/api/collectors', form);
				showSuccess('Data pengepul berhasil ditambahkan', 'Berhasil!');
			}
			setOpen(false);
			queryClient.invalidateQueries({ queryKey: ['collectors'] });
		} catch (err: any) {
			console.error('Save error:', err);
			showError('Gagal menyimpan data pengepul: ' + (err?.response?.data?.message || err?.message || 'Terjadi kesalahan'), 'Gagal Menyimpan');
		}
	};

	const remove = async (id: number) => {
		const confirmed = await showDeleteConfirm('pengepul ini');
		if (!confirmed) return;
		try {
			await axios.delete(`/api/collectors/${id}`);
			showSuccess('Data pengepul berhasil dihapus', 'Berhasil!');
			queryClient.invalidateQueries({ queryKey: ['collectors'] });
		} catch (err: any) {
			console.error('Delete error:', err);
			showError('Gagal menghapus data pengepul: ' + (err?.response?.data?.message || err?.message || 'Terjadi kesalahan'), 'Gagal Menghapus');
		}
	};

	const handleDownloadCollector = () => {
		if (!selectedCollector) return;
		downloadExcel(`/api/collections/export/excel?collector_id=${selectedCollector.id}`, token || undefined);
	};

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
			<PageHeader
				title="Pengepul Susu"
				description="Kelola data pengepul susu koperasi"
				actions={
					<ModernButton startIcon={<Add />} onClick={openCreate}>
						Tambah
					</ModernButton>
				}
			/>

			<ModernTable>
				<TableHead>
					<TableRow>
						<ModernTableCell>Nama</ModernTableCell>
						<ModernTableCell>Alamat</ModernTableCell>
						<ModernTableCell>Telepon</ModernTableCell>
						<ModernTableCell align="right">Aksi</ModernTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{(data ?? []).map((row: any) => (
						<ModernTableRow key={row.id}>
							<ModernTableCell variant="name">{row.name}</ModernTableCell>
							<ModernTableCell variant="description">{row.address}</ModernTableCell>
							<ModernTableCell>{row.phone}</ModernTableCell>
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
				<DialogTitle>{form.id ? 'Edit' : 'Tambah'} Pengepul</DialogTitle>
				<DialogContent>
					<TextField label="Nama" fullWidth margin="normal" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
					<TextField label="Alamat" fullWidth margin="normal" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
					<TextField label="Telepon" fullWidth margin="normal" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
				</DialogContent>
				<DialogActions>
					<ModernButton variant="outlined" onClick={() => setOpen(false)}>Batal</ModernButton>
					<ModernButton onClick={save}>Simpan</ModernButton>
				</DialogActions>
			</Dialog>

			{/* Detail Dialog */}
			<Dialog open={detailOpen} onClose={() => setDetailOpen(false)} fullWidth maxWidth="md">
				<DialogTitle>
					Detail Pengepul Susu
					{selectedCollector && (
						<Typography variant="subtitle1" color="text.secondary">
							{selectedCollector.name}
						</Typography>
					)}
				</DialogTitle>
				<DialogContent>
					{detailLoading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4, gap: 2 }}>
							<CircularProgress size={24} />
							<Typography>Memuat data...</Typography>
						</Box>
					) : collectorDetail ? (
						<Box>
							{/* Collector Information */}
							<Card sx={{ mb: 3 }}>
								<CardContent>
									<Typography variant="h6" gutterBottom>Informasi Pengepul</Typography>
									<Grid container spacing={2}>
										<Grid item xs={12} sm={6}>
											<Typography variant="body2" color="text.secondary">Nama</Typography>
											<Typography variant="body1" fontWeight={500}>{collectorDetail.name}</Typography>
										</Grid>
										<Grid item xs={12} sm={6}>
											<Typography variant="body2" color="text.secondary">Telepon</Typography>
											<Typography variant="body1" fontWeight={500}>{collectorDetail.phone || '-'}</Typography>
										</Grid>
										<Grid item xs={12}>
											<Typography variant="body2" color="text.secondary">Alamat</Typography>
											<Typography variant="body1" fontWeight={500}>{collectorDetail.address || '-'}</Typography>
										</Grid>
									</Grid>
								</CardContent>
							</Card>

							{/* Summary Statistics */}
							{collectorDetail.summary && (
								<Card sx={{ mb: 3 }}>
									<CardContent>
										<Typography variant="h6" gutterBottom>Ringkasan 10 Hari Terakhir</Typography>
										<Grid container spacing={2}>
											<Grid item xs={6} sm={3}>
												<Typography variant="body2" color="text.secondary">Total Susu</Typography>
												<Typography variant="h6" color="primary" fontWeight={700}>
													{collectorDetail.summary.total_amount?.toFixed(2) ?? '0.00'} L
												</Typography>
											</Grid>
											<Grid item xs={6} sm={3}>
												<Typography variant="body2" color="text.secondary">Total Biaya</Typography>
												<Typography variant="h6" color="success.main" fontWeight={700}>
													Rp {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(collectorDetail.summary.total_income || 0)}
												</Typography>
											</Grid>
											<Grid item xs={6} sm={3}>
												<Typography variant="body2" color="text.secondary">Rata-rata/Hari</Typography>
												<Typography variant="h6" color="info.main" fontWeight={700}>
													{collectorDetail.summary.average_amount?.toFixed(2) ?? '0.00'} L
												</Typography>
											</Grid>
											<Grid item xs={6} sm={3}>
												<Typography variant="body2" color="text.secondary">Hari Aktif</Typography>
												<Typography variant="h6" color="warning.main" fontWeight={700}>
													{collectorDetail.summary.days_count ?? 0} hari
												</Typography>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							)}

							{/* Collections Table */}
							<Card>
								<CardContent>
									<Typography variant="h6" gutterBottom>Laporan 10 Hari Terakhir</Typography>
									<ModernTable>
										<TableHead>
											<TableRow>
												<ModernTableCell>Tanggal</ModernTableCell>
												<ModernTableCell align="right">Pagi (L)</ModernTableCell>
												<ModernTableCell align="right">Sore (L)</ModernTableCell>
												<ModernTableCell align="right">Total (L)</ModernTableCell>
												<ModernTableCell align="right">Harga/L</ModernTableCell>
												<ModernTableCell align="right">Biaya</ModernTableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{Array.isArray(collectorDetail.collections) && collectorDetail.collections.length > 0 ? (
												collectorDetail.collections.map((collection: any) => (
													<ModernTableRow key={collection.date}>
														<ModernTableCell variant="date">{new Date(collection.date).toLocaleDateString('id-ID')}</ModernTableCell>
														<ModernTableCell align="right">{collection.morning_amount}</ModernTableCell>
														<ModernTableCell align="right">{collection.afternoon_amount}</ModernTableCell>
														<ModernTableCell align="right">{collection.total_amount}</ModernTableCell>
														<ModernTableCell align="right" variant="amount">Rp {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(collection.price_per_liter || 0)}</ModernTableCell>
														<ModernTableCell align="right" variant="amount">
															Rp {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(parseFloat(collection.total_income) || 0)}
														</ModernTableCell>
													</ModernTableRow>
												))
											) : (
												<ModernTableRow>
													<ModernTableCell colSpan={6} align="center" sx={{ py: 3 }}>
														<Box sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>
															Tidak ada data penjualan dalam 10 hari terakhir
														</Box>
													</ModernTableCell>
												</ModernTableRow>
											)}
										</TableBody>
									</ModernTable>
								</CardContent>
							</Card>
						</Box>
					) : detailError ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
							<Typography color="error">
								{(detailError as any)?.response?.data?.message || detailError.message || 'Tidak dapat memuat data pengepul'}
							</Typography>
						</Box>
					) : (
						<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
							<Typography color="text.secondary">Tidak dapat memuat data pengepul</Typography>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<ModernButton variant="outlined" onClick={() => setDetailOpen(false)}>Tutup</ModernButton>
					<ModernButton
						startIcon={<Download />}
						onClick={handleDownloadCollector}
						disabled={!selectedCollector}
					>
						Download
					</ModernButton>
				</DialogActions>
			</Dialog>
		</Box>
	);
}







