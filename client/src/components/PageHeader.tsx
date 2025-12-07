import { Box, Typography, Button } from '@mui/material';
import { ReactNode } from 'react';

interface PageHeaderProps {
	title: string;
	description?: string;
	actions?: ReactNode;
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
	return (
		<Box sx={{ mb: 4, p: { xs: 3, md: 4 }, bgcolor: 'white', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
				<Box>
					<Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 0.5 }}>
						{title}
					</Typography>
					{description && (
						<Typography variant="body2" sx={{ color: '#6b7280' }}>
							{description}
						</Typography>
					)}
				</Box>
				{actions && (
					<Box sx={{ display: 'flex', gap: 1.5 }}>
						{actions}
					</Box>
				)}
			</Box>
		</Box>
	);
}