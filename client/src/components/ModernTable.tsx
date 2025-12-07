import { Card, CardContent, Table, TableHead, TableRow, TableCell } from '@mui/material';
import { ReactNode } from 'react';

interface ModernTableProps {
	children: ReactNode;
	sx?: any;
}

export default function ModernTable({ children, sx }: ModernTableProps) {
	return (
		<Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', bgcolor: '#ffffff' }}>
			<CardContent sx={{ p: 0 }}>
				<Table sx={{
					'& .MuiTableCell-head': {
						bgcolor: '#f9fafb',
						color: '#374151',
						fontWeight: 600,
						fontSize: '0.875rem',
						fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
						letterSpacing: '0.025em'
					},
					'& .MuiTableCell-body': {
						fontSize: '0.875rem',
						fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
						color: '#1f2937'
					},
					...sx
				}}>
					{children}
				</Table>
			</CardContent>
		</Card>
	);
}

export function ModernTableCell({ children, align = 'left', variant = 'default', ...props }: any) {
	const getVariantStyles = () => {
		switch (variant) {
			case 'name':
				return { fontWeight: 500, color: '#111827' };
			case 'amount':
				return { fontWeight: 600, color: '#22c55e' };
			case 'date':
				return { color: '#6b7280', fontSize: '0.875rem' };
			case 'description':
				return { color: '#6b7280' };
			case 'status':
				return { fontWeight: 500 };
			default:
				return { color: '#1f2937' };
		}
	};

	return (
		<TableCell
			align={align}
			sx={{
				py: 2,
				px: 3,
				fontSize: '0.875rem',
				fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
				...getVariantStyles(),
				...props.sx
			}}
			{...props}
		>
			{children}
		</TableCell>
	);
}

export function ModernTableRow({ children, ...props }: any) {
	return (
		<TableRow sx={{
			'&:hover': { bgcolor: '#f8fafc' },
			transition: 'background-color 0.2s ease-in-out'
		}} {...props}>
			{children}
		</TableRow>
	);
}