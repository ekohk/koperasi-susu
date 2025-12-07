import { useState } from 'react';
import { Add, Edit, Delete } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, IconButton } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import PageHeader from '../../components/PageHeader';
import ModernTable, { ModernTableCell, ModernTableRow } from '../../components/ModernTable';
import ModernButton, { ModernIconButton } from '../../components/ModernButton';
import { showSuccess, showError, showDeleteConfirm } from '../../utils/sweetalert';

export default function ShipmentsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => (await axios.get('/api/shipments')).data.data
  });

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ id: '', date: dayjs().format('YYYY-MM-DD'), amount: '', destination: '', notes: '' });

  const openCreate = () => {
    setForm({ id: '', date: dayjs().format('YYYY-MM-DD'), amount: '', destination: '', notes: '' });
    setOpen(true);
  };

  const openEdit = (row: any) => {
    setForm({
      id: row.id,
      date: row.date ? dayjs(row.date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      amount: row.amount ? parseFloat(row.amount).toString() : '',
      destination: row.destination || '',
      notes: row.notes || ''
    });
    setEditOpen(true);
  };

  const save = async () => {
    try {
      await axios.post('/api/shipments', {
        ...form,
        amount: Number(form.amount)
      });
      setOpen(false);
      setForm({ id: '', date: dayjs().format('YYYY-MM-DD'), amount: '', destination: '', notes: '' });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      showSuccess('Data pengiriman berhasil ditambahkan', 'Berhasil!');
    } catch (err: any) {
      showError('Gagal menyimpan data pengiriman: ' + (err?.response?.data?.message || err?.message || 'Terjadi kesalahan'), 'Gagal Menyimpan');
    }
  };

  const saveEdit = async () => {
    try {
      await axios.put(`/api/shipments/${form.id}`, {
        date: form.date, // pastikan date selalu dikirim
        amount: Number(form.amount),
        destination: form.destination,
        notes: form.notes
      });
      setEditOpen(false);
      setForm({ id: '', date: dayjs().format('YYYY-MM-DD'), amount: '', destination: '', notes: '' });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      showSuccess('Data pengiriman berhasil diperbarui', 'Berhasil!');
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

  const deleteShipment = async (id: number) => {
    const confirmed = await showDeleteConfirm('pengiriman ini');
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`/api/shipments/${id}`);
      showSuccess('Data pengiriman berhasil dihapus', 'Berhasil!');
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    } catch (err: any) {
      showError('Gagal menghapus data pengiriman: ' + (err?.response?.data?.message || err?.message || 'Terjadi kesalahan'), 'Gagal Menghapus');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <PageHeader
        title="Pengiriman Susu"
        description="Kelola data pengiriman susu harian"
        actions={
          <ModernButton startIcon={<Add />} onClick={openCreate}>
            Tambah
          </ModernButton>
        }
      />

      <ModernTable>
        <TableHead>
          <TableRow>
            <ModernTableCell>Tanggal</ModernTableCell>
            <ModernTableCell align="right">Jumlah (L)</ModernTableCell>
            <ModernTableCell>Tujuan</ModernTableCell>
            <ModernTableCell>Catatan</ModernTableCell>
            <ModernTableCell align="center">Aksi</ModernTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(data ?? []).map((row: any) => (
            <ModernTableRow key={row.id}>
              <ModernTableCell variant="date">{dayjs(row.date).format('DD/MM/YYYY')}</ModernTableCell>
              <ModernTableCell align="right">{row.amount} L</ModernTableCell>
              <ModernTableCell variant="name">{row.destination}</ModernTableCell>
              <ModernTableCell variant="description">{row.notes || <Box sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>-</Box>}</ModernTableCell>
              <ModernTableCell align="center">
                <ModernIconButton color="primary" onClick={() => openEdit(row)}>
                  <Edit />
                </ModernIconButton>
                <ModernIconButton color="error" onClick={() => deleteShipment(row.id)}>
                  <Delete />
                </ModernIconButton>
              </ModernTableCell>
            </ModernTableRow>
          ))}
        </TableBody>
      </ModernTable>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Tambah Pengiriman Susu</DialogTitle>
        <DialogContent>
          <TextField
            label="Tanggal"
            type="date"
            fullWidth
            margin="normal"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Jumlah Susu (Liter)"
            type="number"
            fullWidth
            margin="normal"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
          />
          <TextField
            label="Alamat / Tujuan"
            fullWidth
            margin="normal"
            value={form.destination}
            onChange={e => setForm({ ...form, destination: e.target.value })}
          />
          <TextField
            label="Catatan"
            fullWidth
            margin="normal"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <ModernButton variant="outlined" onClick={() => setOpen(false)}>Batal</ModernButton>
          <ModernButton
            onClick={save}
            disabled={
              !form.date ||
              !form.amount ||
              Number(form.amount) <= 0 ||
              !form.destination
            }
          >
            Simpan
          </ModernButton>
        </DialogActions>
      </Dialog>

      {/* Dialog Edit Pengiriman */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Pengiriman Susu</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Tanggal: {dayjs(form.date).format('DD/MM/YYYY')}
            </Typography>
          </Box>
          <TextField
            label="Jumlah Susu (Liter)"
            type="number"
            fullWidth
            margin="normal"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
          />
          <TextField
            label="Alamat / Tujuan"
            fullWidth
            margin="normal"
            value={form.destination}
            onChange={e => setForm({ ...form, destination: e.target.value })}
          />
          <TextField
            label="Catatan"
            fullWidth
            margin="normal"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <ModernButton variant="outlined" onClick={() => setEditOpen(false)}>Batal</ModernButton>
          <ModernButton
            onClick={saveEdit}
            disabled={
              !form.date ||
              !form.amount ||
              Number(form.amount) <= 0 ||
              !form.destination
            }
          >
            Simpan
          </ModernButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}



