import { Logout, Savings, People, AccessTime, Inventory2, Build, Payments, Assessment, LocalShipping, Dashboard } from '@mui/icons-material';
import {
	Box,
	Divider,
	Drawer,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	useMediaQuery
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const drawerWidth = 280;

const navItems = [
	{ to: '/', label: 'Dashboard', icon: <Dashboard /> },
	{ to: '/collectors', label: 'Pengepul Susu', icon: <People /> },
	{ to: '/collections', label: 'Koleksi Susu', icon: <Inventory2 /> },
	{ to: '/shipments', label: 'Pengiriman', icon: <LocalShipping /> },
	{ to: '/employees', label: 'Karyawan', icon: <Savings /> },
	{ to: '/attendances', label: 'Absensi', icon: <AccessTime /> },
	{ to: '/incomes', label: 'Pemasukan', icon: <Payments /> },
	{ to: '/maintenances', label: 'Pemeliharaan', icon: <Build /> },
	{ to: '/expenses', label: 'Pengeluaran', icon: <Payments /> },
	{ to: '/reports', label: 'Laporan Bulanan', icon: <Assessment /> }
];

export default function DashboardLayout() {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery('(min-width:1200px)');
	const { logout } = useAuth();
	const location = useLocation();

	const activePath = useMemo(() => location.pathname, [location.pathname]);

	const drawer = (
		<Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#ffffff', height: '100%' }}>
			{/* Modern Header with Brand */}
			<Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
					<Box sx={{
						width: 48,
						height: 48,
						mr: 2,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<img src="/logo.png" alt="Logo" style={{ width: 48, height: 48, objectFit: 'contain' }} />
					</Box>
					<Box>
						<Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', lineHeight: 1.2 }}>
							Koperasi Susu
						</Typography>
						<Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500 }}>
							Banyu Makmur
						</Typography>
					</Box>
				</Box>
			</Box>

			{/* Navigation Menu - Scrollable */}
			<Box sx={{ flexGrow: 1, px: 2, py: 1, pb: { xl: 10, xs: 2 }, overflowY: 'auto', overflowX: 'hidden' }}>
				<Typography variant="caption" sx={{
					px: 2,
					py: 1,
					color: '#9ca3af',
					fontWeight: 600,
					fontSize: '0.75rem',
					textTransform: 'uppercase',
					letterSpacing: '0.05em'
				}}>
					Menu Utama
				</Typography>
				<List sx={{ pt: 1 }}>
					{navItems.map((item) => {
						const isActive = activePath === item.to || (item.to !== '/' && activePath.startsWith(item.to));
						return (
							<ListItemButton
								key={item.to}
								component={Link}
								to={item.to}
								sx={{
									borderRadius: 2,
									mb: 0.5,
									mx: 1,
									transition: 'all 0.2s ease-in-out',
									...(isActive ? {
										bgcolor: '#dcfce7',
										color: '#22c55e',
										'&:hover': {
											bgcolor: '#bbf7d0'
										},
										'& .MuiListItemIcon-root': {
											color: '#22c55e'
										}
									} : {
										color: '#6b7280',
										'&:hover': {
											bgcolor: '#f8fafc',
											color: '#1f2937'
										},
										'& .MuiListItemIcon-root': {
											color: '#9ca3af'
										}
									})
								}}
							>
								<ListItemIcon sx={{
									minWidth: 40,
									transition: 'color 0.2s ease-in-out'
								}}>
									{item.icon}
								</ListItemIcon>
								<ListItemText
									primary={item.label}
									primaryTypographyProps={{
										fontWeight: isActive ? 600 : 500,
										fontSize: '0.875rem'
									}}
								/>
							</ListItemButton>
						);
					})}
				</List>
			</Box>

			{/* Logout Section: fixed di bawah sidebar pada desktop, normal di mobile */}
			<Divider sx={{ my: 2, display: { xs: 'none', xl: 'block' } }} />
			<Box
				sx={{
					position: { xl: 'fixed', xs: 'static' },
					left: 0,
					bottom: 0,
					width: { xl: drawerWidth, xs: '100%' },
					zIndex: 1201,
					bgcolor: '#fff',
					borderTop: '1px solid #e5e7eb',
					p: 2,
					boxShadow: { xl: '0 -2px 8px rgba(0,0,0,0.03)', xs: 'none' },
					display: { xl: 'block', xs: 'none' }
				}}
			>
				<ListItemButton
					onClick={logout}
					sx={{
						borderRadius: 2,
						color: '#ef4444',
						p: 2,
						'&:hover': {
							bgcolor: '#fef2f2'
						}
					}}
				>
					<ListItemIcon sx={{ color: '#ef4444', minWidth: 40 }}>
						<Logout />
					</ListItemIcon>
					<ListItemText
						primary="Keluar"
						primaryTypographyProps={{
							fontWeight: 500,
							fontSize: '0.875rem'
						}}
					/>
				</ListItemButton>
			</Box>
			{/* Logout Section untuk mobile/tablet */}
			<Box sx={{ display: { xs: 'block', xl: 'none' }, mt: 2 }}>
				<Divider sx={{ my: 2 }} />
				<ListItemButton
					onClick={logout}
					sx={{
						borderRadius: 2,
						color: '#ef4444',
						p: 2,
						'&:hover': {
							bgcolor: '#fef2f2'
						}
					}}
				>
					<ListItemIcon sx={{ color: '#ef4444', minWidth: 40 }}>
						<Logout />
					</ListItemIcon>
					<ListItemText
						primary="Keluar"
						primaryTypographyProps={{
							fontWeight: 500,
							fontSize: '0.875rem'
						}}
					/>
				</ListItemButton>
			</Box>
		</Box>
	);

	return (
		<Box sx={{
			display: 'flex',
			minHeight: '100vh',
			bgcolor: '#f8fafc',
			margin: 0,
			padding: 0,
			position: 'relative'
		}}>
			<Drawer
				variant={isDesktop ? 'permanent' : 'temporary'}
				open={isDesktop ? true : open}
				onClose={() => setOpen(false)}
				ModalProps={{ keepMounted: true }}
				sx={{
					width: drawerWidth,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
						borderRight: '1px solid #e5e7eb',
						boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
						overflowY: 'auto',
						overflowX: 'hidden',
						height: '100vh'
					}
				}}
			>
				{drawer}
			</Drawer>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					width: { xl: `calc(100% - ${drawerWidth}px)` },
					minHeight: '100vh',
					bgcolor: '#f8fafc'
				}}
			>
				<Outlet />
			</Box>
		</Box>
	);
}
