import { Download, Assessment } from '@mui/icons-material';
import {
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	Typography,
	TextField,
	Select,
	MenuItem,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Alert,
	Chip
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PageHeader from '../../components/PageHeader';
import ModernTable, { ModernTableCell, ModernTableRow } from '../../components/ModernTable';
import ModernButton from '../../components/ModernButton';

export default function MonthlyReportPage() {
	const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
	const [selectedYear, setSelectedYear] = useState(dayjs().year());
	const [availableMonths, setAvailableMonths] = useState<any[]>([]);

	const { data: reportData, refetch } = useQuery({
		queryKey: ['monthly-report', selectedMonth, selectedYear],
		queryFn: async () => {
			const response = await axios.get('/api/reports/monthly', {
				params: { month: selectedMonth, year: selectedYear }
			});
			return response.data.data;
		},
		enabled: false
	});

	useEffect(() => {
		// Load available months
		axios.get('/api/reports/available-months').then(res => {
			setAvailableMonths(res.data.data);
		});
	}, []);

	useEffect(() => {
		if (selectedMonth && selectedYear) {
			refetch();
		}
	}, [selectedMonth, selectedYear, refetch]);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR'
		}).format(amount);
	};

	const exportToPDF = () => {
		if (!reportData) return;

		const doc = new jsPDF();
		const pageWidth = doc.internal.pageSize.width;
		const margin = 20;
		let yPosition = margin;

		// Header
		doc.setFontSize(20);
		(doc as any).setFont('helvetica', 'bold');
		doc.text('LAPORAN BULANAN', pageWidth / 2, yPosition, { align: 'center' });
		yPosition += 10;

		doc.setFontSize(14);
		(doc as any).setFont('helvetica', 'normal');
		doc.text(`Banyu Makmur - ${reportData.period.monthName} ${reportData.period.year}`, pageWidth / 2, yPosition, { align: 'center' });
		yPosition += 20;

		// Summary Section
		doc.setFontSize(16);
		(doc as any).setFont('helvetica', 'bold');
		doc.text('RINGKASAN KEUANGAN', margin, yPosition);
		yPosition += 10;

		doc.setFontSize(12);
		(doc as any).setFont('helvetica', 'normal');
		doc.text(`Total Pemasukan: ${formatCurrency(reportData.summary.totalIncome)}`, margin, yPosition);
		yPosition += 7;
		doc.text(`Biaya Koleksi Susu: ${formatCurrency(reportData.summary.totalMilkValue)}`, margin, yPosition);
		yPosition += 7;
		doc.text(`Total Pengeluaran: ${formatCurrency(reportData.summary.totalExpense)}`, margin, yPosition);
		yPosition += 7;
		doc.text(`Total Pemeliharaan: ${formatCurrency(reportData.summary.totalMaintenance)}`, margin, yPosition);
		yPosition += 7;
		doc.text(`Total Gaji: ${formatCurrency(reportData.summary.totalSalary)}`, margin, yPosition);
		yPosition += 7;
		doc.text(`Total Pengiriman: ${reportData.summary.totalShipment} L`, margin, yPosition);
		yPosition += 10;

		// Milk Collections Table
		if (reportData.milkCollections.summary.length > 0) {
			doc.setFontSize(16);
			(doc as any).setFont('helvetica', 'bold');
			doc.text('KOLEKSI SUSU', margin, yPosition);
			yPosition += 10;

			const collectionsData = reportData.milkCollections.summary.map((item: any) => [
				item.collector_name,
				`${item.total_amount} L`,
				formatCurrency(item.avg_price),
				formatCurrency(item.total_value),
				`${item.collection_days} hari`
			]);

			(doc as any).autoTable({
				startY: yPosition,
				head: [['Pengepul', 'Total (L)', 'Rata-rata Harga', 'Total Nilai', 'Hari']],
				body: collectionsData,
				theme: 'grid',
				headStyles: { fillColor: [41, 128, 185] },
				margin: { left: margin, right: margin }
			});

			yPosition = (doc as any).lastAutoTable.finalY + 10;
		}

		// Shipments Table
		if (reportData.shipments.items.length > 0) {
			doc.setFontSize(16);
			(doc as any).setFont('helvetica', 'bold');
			doc.text('PENGIRIMAN SUSU', margin, yPosition);
			yPosition += 10;

			const shipmentsData = reportData.shipments.items.map((item: any) => [
				dayjs(item.date).format('DD/MM/YYYY'),
				`${item.total_amount} L`,
				item.destination,
				item.notes
			]);

			(doc as any).autoTable({
				startY: yPosition,
				head: [['Tanggal', 'Jumlah (L)', 'Tujuan', 'Keterangan']],
				body: shipmentsData,
				theme: 'grid',
				headStyles: { fillColor: [41, 128, 185] },
				margin: { left: margin, right: margin }
			});

			yPosition = (doc as any).lastAutoTable.finalY + 10;
		}

		// Attendance Table
		if (reportData.attendance.length > 0) {
			doc.setFontSize(16);
			(doc as any).setFont('helvetica', 'bold');
			doc.text('ABSENSI KARYAWAN', margin, yPosition);
			yPosition += 10;

			const attendanceData = reportData.attendance.map((item: any) => [
				item.employee_name,
				item.employee_position,
				item.present_days,
				item.absent_days,
				item.sick_days,
				item.holiday_days,
				item.total_days
			]);

			(doc as any).autoTable({
				startY: yPosition,
				head: [['Nama', 'Posisi', 'Hadir', 'Ijin', 'Sakit', 'Libur', 'Total']],
				body: attendanceData,
				theme: 'grid',
				headStyles: { fillColor: [41, 128, 185] },
				margin: { left: margin, right: margin }
			});

			yPosition = (doc as any).lastAutoTable.finalY + 10;
		}

		// Salaries Table
		if (reportData.salaries.length > 0) {
			doc.setFontSize(16);
			(doc as any).setFont('helvetica', 'bold');
			doc.text('GAJI KARYAWAN', margin, yPosition);
			yPosition += 10;

			const salariesData = reportData.salaries.map((item: any) => [
				item.employee_name,
				item.employee_position,
				formatCurrency(item.base_salary),
				item.total_working_days,
				formatCurrency(item.deductions),
				formatCurrency(item.bonuses),
				formatCurrency(item.final_salary)
			]);

			(doc as any).autoTable({
				startY: yPosition,
				head: [['Nama', 'Posisi', 'Gaji Pokok', 'Hari Kerja', 'Potongan', 'Bonus', 'Gaji Akhir']],
				body: salariesData,
				theme: 'grid',
				headStyles: { fillColor: [41, 128, 185] },
				margin: { left: margin, right: margin }
			});

			yPosition = (doc as any).lastAutoTable.finalY + 10;
		}

		// Incomes Table
		if (reportData.incomes.items.length > 0) {
			doc.setFontSize(16);
			(doc as any).setFont('helvetica', 'bold');
			doc.text('PEMASUKAN', margin, yPosition);
			yPosition += 10;

			const incomesData = reportData.incomes.items.map((item: any) => [
				item.source,
				formatCurrency(item.amount),
				dayjs(item.date).format('DD/MM/YYYY'),
				item.description
			]);

			(doc as any).autoTable({
				startY: yPosition,
				head: [['Sumber', 'Jumlah', 'Tanggal', 'Keterangan']],
				body: incomesData,
				theme: 'grid',
				headStyles: { fillColor: [41, 128, 185] },
				margin: { left: margin, right: margin }
			});

			yPosition = (doc as any).lastAutoTable.finalY + 10;
		}

		// Expenses Table
		if (reportData.expenses.items.length > 0) {
			doc.setFontSize(16);
			(doc as any).setFont('helvetica', 'bold');
			doc.text('PENGELUARAN', margin, yPosition);
			yPosition += 10;

			const expensesData = reportData.expenses.items.map((item: any) => [
				item.category,
				formatCurrency(item.amount),
				dayjs(item.date).format('DD/MM/YYYY'),
				item.description
			]);

			(doc as any).autoTable({
				startY: yPosition,
				head: [['Kategori', 'Jumlah', 'Tanggal', 'Keterangan']],
				body: expensesData,
				theme: 'grid',
				headStyles: { fillColor: [41, 128, 185] },
				margin: { left: margin, right: margin }
			});

			yPosition = (doc as any).lastAutoTable.finalY + 10;
		}

		// Maintenances
		if (reportData.maintenances.items.length > 0) {
			doc.setFontSize(16);
			(doc as any).setFont('helvetica', 'bold');
			doc.text('Pemeliharaan', margin, yPosition);
			yPosition += 10;

			const maintenancesData = reportData.maintenances.items.map((item: any) => [
				item.item_name,
				`${dayjs(item.start_date).format('DD/MM/YYYY')} - ${dayjs(item.end_date).format('DD/MM/YYYY')}`,
				formatCurrency(item.cost),
				item.description
			]);

			(doc as any).autoTable({
				startY: yPosition,
				head: [['Item', 'Periode', 'Biaya', 'Keterangan']],
				body: maintenancesData,
				theme: 'grid',
				headStyles: { fillColor: [41, 128, 185] },
				margin: { left: margin, right: margin }
			});

			yPosition = (doc as any).lastAutoTable.finalY + 10;
		}

		// Footer
		const totalPages = doc.getNumberOfPages();
		for (let i = 1; i <= totalPages; i++) {
			doc.setPage(i);
			doc.setFontSize(10);
			(doc as any).setFont('helvetica', 'normal');
			doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
		}

		// Save PDF
		doc.save(`Laporan_Bulanan_${reportData.period.monthName}_${reportData.period.year}.pdf`);
	};

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
			<PageHeader
				title="Laporan Bulanan"
				description="Laporan komprehensif untuk analisis kinerja bulanan"
				actions={
					<ModernButton
						startIcon={<Download />}
						onClick={exportToPDF}
						disabled={!reportData}
					>
						Download
					</ModernButton>
				}
			/>

			<Card
				elevation={0}
				sx={{
					borderRadius: 3,
					border: '1px solid #e5e7eb',
					bgcolor: '#ffffff',
					mb: 3
				}}
			>
				<CardContent sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom sx={{ color: '#1f2937', fontWeight: 600, mb: 3 }}>
						Filter Laporan
					</Typography>
					<Grid container spacing={3} alignItems="center">
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								select
								fullWidth
								label="Bulan"
								value={selectedMonth}
								onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
								variant="outlined"
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: 2,
										bgcolor: 'background.paper'
									}
								}}
							>
								{Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
									<MenuItem key={month} value={month}>
										{new Date(2024, month - 1).toLocaleDateString('id-ID', { month: 'long' })}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								select
								fullWidth
								label="Tahun"
								value={selectedYear}
								onChange={(e) => setSelectedYear(parseInt(e.target.value))}
							>
								{Array.from({ length: 5 }, (_, i) => dayjs().year() - 2 + i).map((year) => (
									<MenuItem key={year} value={year}>
										{year}
									</MenuItem>
								))}
							</TextField>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{reportData && (
				<>
					{/* Summary Cards */}
					<Grid container spacing={2} sx={{ mb: 3 }}>
							<Grid item xs={12} sm={6} md={4} lg={2}>
								<Card
									elevation={0}
									sx={{
										borderRadius: 3,
										border: '1px solid #dcfce7',
										bgcolor: '#ffffff',
										'&:hover': {
											boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)',
											transform: 'translateY(-1px)',
											transition: 'all 0.2s ease-in-out'
										}
									}}
								>
									<CardContent sx={{ p: 2.5 }}>
										<Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem', fontWeight: 500 }}>
											Total Pemasukan
										</Typography>
										<Typography variant="h6" sx={{ fontWeight: 700, color: '#15803d', fontSize: '1.25rem' }}>
											{formatCurrency(reportData.summary.totalIncome)}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} sm={6} md={4} lg={2}>
								<Card
									elevation={0}
									sx={{
										borderRadius: 3,
										border: '1px solid #dcfce7',
										bgcolor: '#ffffff',
										'&:hover': {
											boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)',
											transform: 'translateY(-1px)',
											transition: 'all 0.2s ease-in-out'
										}
									}}
								>
									<CardContent sx={{ p: 2.5 }}>
										<Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem', fontWeight: 500 }}>
											Biaya Koleksi Susu
										</Typography>
										<Typography variant="h6" sx={{ fontWeight: 700, color: '#15803d', fontSize: '1.25rem' }}>
											{formatCurrency(reportData.summary.totalMilkValue)}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} sm={6} md={4} lg={2}>
								<Card
									elevation={0}
									sx={{
										borderRadius: 3,
										border: '1px solid #dcfce7',
										bgcolor: '#ffffff',
										'&:hover': {
											boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)',
											transform: 'translateY(-1px)',
											transition: 'all 0.2s ease-in-out'
										}
									}}
								>
									<CardContent sx={{ p: 2.5 }}>
										<Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem', fontWeight: 500 }}>
											Total Pengeluaran
										</Typography>
										<Typography variant="h6" sx={{ fontWeight: 700, color: '#15803d', fontSize: '1.25rem' }}>
											{formatCurrency(reportData.summary.totalExpense)}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} sm={6} md={4} lg={2}>
								<Card
									elevation={0}
									sx={{
										borderRadius: 3,
										border: '1px solid #dcfce7',
										bgcolor: '#ffffff',
										'&:hover': {
											boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)',
											transform: 'translateY(-1px)',
											transition: 'all 0.2s ease-in-out'
										}
									}}
								>
									<CardContent sx={{ p: 2.5 }}>
										<Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem', fontWeight: 500 }}>
											Total Gaji
										</Typography>
										<Typography variant="h6" sx={{ fontWeight: 700, color: '#15803d', fontSize: '1.25rem' }}>
											{formatCurrency(reportData.summary.totalSalary)}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} sm={6} md={4} lg={2}>
								<Card
									elevation={0}
									sx={{
										borderRadius: 3,
										border: '1px solid #dcfce7',
										bgcolor: '#ffffff',
										'&:hover': {
											boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)',
											transform: 'translateY(-1px)',
											transition: 'all 0.2s ease-in-out'
										}
									}}
								>
									<CardContent sx={{ p: 2.5 }}>
										<Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem', fontWeight: 500 }}>
											Total Pemeliharaan
										</Typography>
										<Typography variant="h6" sx={{ fontWeight: 700, color: '#15803d', fontSize: '1.25rem' }}>
											{formatCurrency(reportData.summary.totalMaintenance)}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} sm={6} md={4} lg={2}>
								<Card
									elevation={0}
									sx={{
										borderRadius: 3,
										border: '1px solid #dcfce7',
										bgcolor: '#ffffff',
										'&:hover': {
											boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)',
											transform: 'translateY(-1px)',
											transition: 'all 0.2s ease-in-out'
										}
									}}
								>
									<CardContent sx={{ p: 2.5 }}>
										<Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem', fontWeight: 500 }}>
											Total Pengiriman
										</Typography>
										<Typography variant="h6" sx={{ fontWeight: 700, color: '#15803d', fontSize: '1.25rem' }}>
											{reportData.summary.totalShipment} L
										</Typography>
									</CardContent>
								</Card>
							</Grid>
					</Grid>

					{/* Milk Collections */}
					{reportData.milkCollections.summary.length > 0 && (
						<Card
								elevation={0}
								sx={{
									borderRadius: 3,
									border: '1px solid #e5e7eb',
									bgcolor: '#ffffff',
									overflow: 'hidden',
									mb: 3
								}}
							>
								<Box sx={{ bgcolor: '#f8fafc', p: 3, borderBottom: '1px solid #e5e7eb' }}>
									<Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1f2937' }}>
										<Assessment sx={{ mr: 1.5, fontSize: 20, color: '#22c55e' }} />
										Koleksi Susu - {reportData.period.monthName} {reportData.period.year}
									</Typography>
								</Box>
								<CardContent sx={{ p: 0 }}>
									<Table sx={{ '& .MuiTableCell-head': { bgcolor: '#f9fafb', color: '#374151', fontWeight: 600, fontSize: '0.875rem' } }}>
										<TableHead>
											<TableRow>
												<TableCell sx={{ py: 2, px: 3 }}>Pengepul</TableCell>
												<TableCell align="right" sx={{ py: 2, px: 3 }}>Total (L)</TableCell>
												<TableCell align="right" sx={{ py: 2, px: 3 }}>Rata-rata Harga</TableCell>
												<TableCell align="right" sx={{ py: 2, px: 3 }}>Total Nilai</TableCell>
												<TableCell align="right" sx={{ py: 2, px: 3 }}>Hari</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{reportData.milkCollections.summary.map((item: any, index: number) => (
												<TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
													<TableCell sx={{ py: 2, px: 3, fontWeight: 500, color: '#111827' }}>{item.collector_name}</TableCell>
													<TableCell align="right" sx={{ py: 2, px: 3, fontWeight: 600, color: '#22c55e' }}>
														{item.total_amount} L
													</TableCell>
													<TableCell align="right" sx={{ py: 2, px: 3, color: '#6b7280' }}>
														{formatCurrency(item.avg_price)}
													</TableCell>
													<TableCell align="right" sx={{ py: 2, px: 3, fontWeight: 600, color: '#111827' }}>
														{formatCurrency(item.total_value)}
													</TableCell>
													<TableCell align="right" sx={{ py: 2, px: 3, color: '#6b7280' }}>
														{item.collection_days} hari
													</TableCell>
												</TableRow>
											))}
											<TableRow sx={{ bgcolor: '#22c55e', '& .MuiTableCell-root': { color: 'white', fontWeight: 600, borderBottom: 'none' } }}>
												<TableCell sx={{ py: 2.5, px: 3 }}>TOTAL</TableCell>
												<TableCell align="right" sx={{ py: 2.5, px: 3 }}>{reportData.milkCollections.total.total_amount} L</TableCell>
												<TableCell align="right" sx={{ py: 2.5, px: 3 }}>{formatCurrency(reportData.milkCollections.total.avg_price)}</TableCell>
												<TableCell align="right" sx={{ py: 2.5, px: 3 }}>{formatCurrency(reportData.milkCollections.total.total_value)}</TableCell>
												<TableCell align="right" sx={{ py: 2.5, px: 3 }}>{reportData.milkCollections.total.total_days} hari</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
							</Card>
					)}

					{/* Shipments */}
					{reportData.shipments.items.length > 0 && (
						<Card
								elevation={0}
								sx={{
									borderRadius: 3,
									border: '1px solid #e5e7eb',
									bgcolor: '#ffffff',
									overflow: 'hidden',
									mb: 3
								}}
							>
								<Box sx={{ bgcolor: '#f8fafc', p: 3, borderBottom: '1px solid #e5e7eb' }}>
									<Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1f2937' }}>
										<Assessment sx={{ mr: 1.5, fontSize: 20, color: '#22c55e' }} />
										Pengiriman Susu - {reportData.period.monthName} {reportData.period.year}
									</Typography>
								</Box>
								<CardContent sx={{ p: 0 }}>
									<Table sx={{ '& .MuiTableCell-head': { bgcolor: '#f9fafb', color: '#374151', fontWeight: 600, fontSize: '0.875rem' } }}>
										<TableHead>
											<TableRow>
												<TableCell sx={{ py: 2, px: 3 }}>Tanggal</TableCell>
												<TableCell align="right" sx={{ py: 2, px: 3 }}>Jumlah (L)</TableCell>
												<TableCell sx={{ py: 2, px: 3 }}>Tujuan</TableCell>
												<TableCell sx={{ py: 2, px: 3 }}>Keterangan</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{reportData.shipments.items.map((item: any, index: number) => (
												<TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
													<TableCell sx={{ py: 2, px: 3, color: '#6b7280' }}>
														{dayjs(item.date).format('DD/MM/YYYY')}
													</TableCell>
													<TableCell align="right" sx={{ py: 2, px: 3, fontWeight: 600, color: '#22c55e' }}>
														{item.total_amount} L
													</TableCell>
													<TableCell sx={{ py: 2, px: 3, fontWeight: 500, color: '#111827' }}>{item.destination}</TableCell>
													<TableCell sx={{ py: 2, px: 3, color: '#6b7280' }}>{item.notes}</TableCell>
												</TableRow>
											))}
											<TableRow sx={{ bgcolor: '#22c55e', '& .MuiTableCell-root': { color: 'white', fontWeight: 600, borderBottom: 'none' } }}>
												<TableCell sx={{ py: 2.5, px: 3 }}>TOTAL PENGIRIMAN</TableCell>
												<TableCell align="right" sx={{ py: 2.5, px: 3 }}>{reportData.shipments.total} L</TableCell>
												<TableCell colSpan={2} sx={{ py: 2.5, px: 3 }}></TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						)}

					{/* Attendance */}
					{reportData.attendance.length > 0 && (
						<Card
								elevation={0}
								sx={{
									borderRadius: 3,
									border: '1px solid #e5e7eb',
									bgcolor: '#ffffff',
									overflow: 'hidden',
									mb: 3
								}}
							>
								<Box sx={{ bgcolor: '#f8fafc', p: 3, borderBottom: '1px solid #e5e7eb' }}>
									<Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1f2937' }}>
										<Assessment sx={{ mr: 1.5, fontSize: 20, color: '#22c55e' }} />
										Absensi Karyawan - {reportData.period.monthName} {reportData.period.year}
									</Typography>
								</Box>
								<CardContent sx={{ p: 0 }}>
									<Table sx={{ '& .MuiTableCell-head': { bgcolor: '#f9fafb', color: '#374151', fontWeight: 600, fontSize: '0.875rem' } }}>
										<TableHead>
											<TableRow>
												<TableCell sx={{ py: 2, px: 3 }}>Nama</TableCell>
												<TableCell sx={{ py: 2, px: 3 }}>Posisi</TableCell>
												<TableCell align="center" sx={{ py: 2, px: 3 }}>Hadir</TableCell>
												<TableCell align="center" sx={{ py: 2, px: 3 }}>Ijin</TableCell>
												<TableCell align="center" sx={{ py: 2, px: 3 }}>Sakit</TableCell>
												<TableCell align="center" sx={{ py: 2, px: 3 }}>Libur</TableCell>
												<TableCell align="center" sx={{ py: 2, px: 3 }}>Total</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{reportData.attendance.map((item: any, index: number) => (
												<TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
													<TableCell sx={{ py: 2, px: 3, fontWeight: 500, color: '#111827' }}>{item.employee_name}</TableCell>
													<TableCell sx={{ py: 2, px: 3, color: '#6b7280' }}>{item.employee_position}</TableCell>
													<TableCell align="center" sx={{ py: 2, px: 3 }}>
														<Chip label={item.present_days} color="success" size="small" />
													</TableCell>
													<TableCell align="center" sx={{ py: 2, px: 3 }}>
														<Chip label={item.absent_days} color="error" size="small" />
													</TableCell>
													<TableCell align="center" sx={{ py: 2, px: 3 }}>
														<Chip label={item.sick_days} color="warning" size="small" />
													</TableCell>
													<TableCell align="center" sx={{ py: 2, px: 3 }}>
														<Chip label={item.holiday_days} color="default" size="small" />
													</TableCell>
													<TableCell align="center" sx={{ py: 2, px: 3 }}>
														<Typography variant="body2" fontWeight="600" color="#22c55e">
															{item.total_days}
														</Typography>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						)}

					{/* Salaries */}
					{reportData.salaries.length > 0 && (
						<Card
								elevation={0}
								sx={{
									borderRadius: 3,
									border: '1px solid #e5e7eb',
									bgcolor: '#ffffff',
									overflow: 'hidden',
									mb: 3
								}}
							>
								<Box sx={{ bgcolor: '#f8fafc', p: 3, borderBottom: '1px solid #e5e7eb' }}>
									<Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1f2937' }}>
										<Assessment sx={{ mr: 1.5, fontSize: 20, color: '#22c55e' }} />
										Gaji Karyawan - {reportData.period.monthName} {reportData.period.year}
									</Typography>
								</Box>
								<CardContent sx={{ p: 0 }}>
									<Table sx={{ '& .MuiTableCell-head': { bgcolor: '#f9fafb', color: '#374151', fontWeight: 600, fontSize: '0.875rem' } }}>
										<TableHead>
											<TableRow>
												<TableCell sx={{ py: 2, px: 3 }}>Nama</TableCell>
												<TableCell sx={{ py: 2, px: 3 }}>Posisi</TableCell>
												<TableCell align="right" sx={{ py: 2, px: 3 }}>Gaji Pokok</TableCell>
												<TableCell align="center" sx={{ py: 2, px: 3 }}>Hari Kerja</TableCell>
												<TableCell align="right" sx={{ py: 2, px: 3 }}>Potongan</TableCell>
												<TableCell align="right" sx={{ py: 2, px: 3 }}>Bonus</TableCell>
												<TableCell align="right" sx={{ py: 2, px: 3 }}>Gaji Akhir</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{reportData.salaries.map((item: any, index: number) => (
												<TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
													<TableCell sx={{ py: 2, px: 3, fontWeight: 500, color: '#111827' }}>{item.employee_name}</TableCell>
													<TableCell sx={{ py: 2, px: 3, color: '#6b7280' }}>{item.employee_position}</TableCell>
													<TableCell align="right" sx={{ py: 2, px: 3, color: '#6b7280' }}>
														{formatCurrency(item.base_salary)}
													</TableCell>
													<TableCell align="center" sx={{ py: 2, px: 3 }}>
														<Chip
															label={item.total_working_days}
															size="small"
															sx={{ bgcolor: '#dcfce7', color: '#22c55e', fontWeight: 600 }}
														/>
													</TableCell>
													<TableCell align="right" sx={{ py: 2, px: 3, color: '#6b7280' }}>
														{formatCurrency(item.deductions)}
													</TableCell>
													<TableCell align="right" sx={{ py: 2, px: 3, color: '#6b7280' }}>
														{formatCurrency(item.bonuses)}
													</TableCell>
													<TableCell align="right" sx={{ py: 2, px: 3, fontWeight: 600, color: '#111827' }}>
														{formatCurrency(item.final_salary)}
													</TableCell>
												</TableRow>
											))}
											<TableRow sx={{ bgcolor: '#22c55e', '& .MuiTableCell-root': { color: 'white', fontWeight: 600, borderBottom: 'none' } }}>
												<TableCell colSpan={6} sx={{ py: 2.5, px: 3 }}>TOTAL GAJI</TableCell>
												<TableCell align="right" sx={{ py: 2.5, px: 3 }}>
													{formatCurrency(reportData.summary.totalSalary)}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						)}

					{/* Incomes */}
					{reportData.incomes.items.length > 0 && (
						<Card
								elevation={0}
								sx={{
									borderRadius: 3,
									border: '1px solid #e5e7eb',
									bgcolor: '#ffffff',
									overflow: 'hidden',
									mb: 3
								}}
							>
								<Box sx={{ bgcolor: '#f8fafc', p: 3, borderBottom: '1px solid #e5e7eb' }}>
									<Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1f2937' }}>
										<Assessment sx={{ mr: 1.5, fontSize: 20, color: '#22c55e' }} />
										Pemasukan - {reportData.period.monthName} {reportData.period.year}
									</Typography>
								</Box>
								<CardContent sx={{ p: 0 }}>
									<Table sx={{ '& .MuiTableCell-head': { bgcolor: '#f9fafb', color: '#374151', fontWeight: 600, fontSize: '0.875rem' } }}>
										<TableHead>
											<TableRow>
												<TableCell sx={{ py: 2, px: 3 }}>Sumber</TableCell>
												<TableCell align="right" sx={{ py: 2, px: 3 }}>Jumlah</TableCell>
												<TableCell sx={{ py: 2, px: 3 }}>Tanggal</TableCell>
												<TableCell sx={{ py: 2, px: 3 }}>Keterangan</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{reportData.incomes.items.map((item: any, index: number) => (
												<TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
													<TableCell sx={{ py: 2, px: 3, fontWeight: 500, color: '#111827' }}>{item.source}</TableCell>
													<TableCell align="right" sx={{ py: 2, px: 3, fontWeight: 600, color: '#111827' }}>
														{formatCurrency(item.amount)}
													</TableCell>
													<TableCell sx={{ py: 2, px: 3, color: '#6b7280' }}>
														{dayjs(item.date).format('DD/MM/YYYY')}
													</TableCell>
													<TableCell sx={{ py: 2, px: 3, color: '#6b7280' }}>{item.description}</TableCell>
												</TableRow>
											))}
											<TableRow sx={{ bgcolor: '#22c55e', '& .MuiTableCell-root': { color: 'white', fontWeight: 600, borderBottom: 'none' } }}>
												<TableCell sx={{ py: 2.5, px: 3 }}>TOTAL PEMASUKAN</TableCell>
												<TableCell align="right" sx={{ py: 2.5, px: 3 }}>
													{formatCurrency(reportData.incomes.total)}
												</TableCell>
												<TableCell colSpan={2} sx={{ py: 2.5, px: 3 }}></TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						)}

					{/* Expenses */}
					{reportData.expenses.items.length > 0 && (
						<Card
								elevation={0}
								sx={{
									borderRadius: 3,
									border: '1px solid #e5e7eb',
									bgcolor: '#ffffff',
									overflow: 'hidden',
									mb: 3
								}}
							>
								<Box sx={{ bgcolor: '#f8fafc', p: 3, borderBottom: '1px solid #e5e7eb' }}>
									<Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1f2937' }}>
										<Assessment sx={{ mr: 1.5, fontSize: 20, color: '#22c55e' }} />
										Pengeluaran - {reportData.period.monthName} {reportData.period.year}
									</Typography>
								</Box>
								<CardContent sx={{ p: 0 }}>
									<Table sx={{ '& .MuiTableCell-head': { bgcolor: '#f9fafb', color: '#374151', fontWeight: 600, fontSize: '0.875rem' } }}>
										<TableHead>
											<TableRow>
												<TableCell sx={{ py: 2, px: 3 }}>Kategori</TableCell>
												<TableCell align="right" sx={{ py: 2, px: 3 }}>Jumlah</TableCell>
												<TableCell sx={{ py: 2, px: 3 }}>Tanggal</TableCell>
												<TableCell sx={{ py: 2, px: 3 }}>Keterangan</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{reportData.expenses.items.map((item: any, index: number) => (
												<TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
													<TableCell sx={{ py: 2, px: 3, fontWeight: 500, color: '#111827' }}>{item.category}</TableCell>
													<TableCell align="right" sx={{ py: 2, px: 3, fontWeight: 600, color: '#111827' }}>
														{formatCurrency(item.amount)}
													</TableCell>
													<TableCell sx={{ py: 2, px: 3, color: '#6b7280' }}>
														{dayjs(item.date).format('DD/MM/YYYY')}
													</TableCell>
													<TableCell sx={{ py: 2, px: 3, color: '#6b7280' }}>{item.description}</TableCell>
												</TableRow>
											))}
											<TableRow sx={{ bgcolor: '#22c55e', '& .MuiTableCell-root': { color: 'white', fontWeight: 600, borderBottom: 'none' } }}>
												<TableCell sx={{ py: 2.5, px: 3 }}>TOTAL PENGELUARAN</TableCell>
												<TableCell align="right" sx={{ py: 2.5, px: 3 }}>
													{formatCurrency(reportData.expenses.total)}
												</TableCell>
												<TableCell colSpan={2} sx={{ py: 2.5, px: 3 }}></TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						)}

					{/* Maintenances */}
					{reportData.maintenances.items.length > 0 && (
						<Card
								elevation={0}
								sx={{
									borderRadius: 3,
									border: '1px solid #e5e7eb',
									bgcolor: '#ffffff',
									overflow: 'hidden',
									mb: 3
								}}
							>
								<Box sx={{ bgcolor: '#f8fafc', p: 3, borderBottom: '1px solid #e5e7eb' }}>
									<Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#1f2937' }}>
										<Assessment sx={{ mr: 1.5, fontSize: 20, color: '#22c55e' }} />
										Pemeliharaan - {reportData.period.monthName} {reportData.period.year}
									</Typography>
								</Box>
								<CardContent sx={{ p: 0 }}>
									<Table sx={{ '& .MuiTableCell-head': { bgcolor: '#f9fafb', color: '#374151', fontWeight: 600, fontSize: '0.875rem' } }}>
										<TableHead>
											<TableRow>
												<TableCell sx={{ py: 2, px: 3 }}>Item</TableCell>
												<TableCell sx={{ py: 2, px: 3 }}>Periode</TableCell>
												<TableCell align="right" sx={{ py: 2, px: 3 }}>Biaya</TableCell>
												<TableCell sx={{ py: 2, px: 3 }}>Keterangan</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{reportData.maintenances.items.map((item: any, index: number) => (
												<TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
													<TableCell sx={{ py: 2, px: 3, fontWeight: 500, color: '#111827' }}>{item.item_name}</TableCell>
													<TableCell sx={{ py: 2, px: 3, color: '#6b7280' }}>
														{dayjs(item.start_date).format('DD/MM/YYYY')} - {dayjs(item.end_date).format('DD/MM/YYYY')}
													</TableCell>
													<TableCell align="right" sx={{ py: 2, px: 3, fontWeight: 600, color: '#111827' }}>
														{formatCurrency(item.cost)}
													</TableCell>
													<TableCell sx={{ py: 2, px: 3, color: '#6b7280' }}>{item.description}</TableCell>
												</TableRow>
											))}
											<TableRow sx={{ bgcolor: '#22c55e', '& .MuiTableCell-root': { color: 'white', fontWeight: 600, borderBottom: 'none' } }}>
												<TableCell sx={{ py: 2.5, px: 3 }}>TOTAL PEMELIHARAAN</TableCell>
												<TableCell sx={{ py: 2.5, px: 3 }}></TableCell>
												<TableCell align="right" sx={{ py: 2.5, px: 3 }}>
													{formatCurrency(reportData.maintenances.total)}
												</TableCell>
												<TableCell sx={{ py: 2.5, px: 3 }}></TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
							</Card>
					)}
				</>
			)}

			{!reportData && (
				<Alert severity="info" sx={{ mt: 3 }}>
					Pilih bulan dan tahun untuk menampilkan laporan bulanan
				</Alert>
			)}
		</Box>
	);
}
