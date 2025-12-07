import { Button, IconButton } from '@mui/material';
import { ReactNode } from 'react';

interface ModernButtonProps {
	children: ReactNode;
	variant?: 'contained' | 'outlined' | 'text';
	startIcon?: ReactNode;
	endIcon?: ReactNode;
	onClick?: () => void;
	color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
	disabled?: boolean;
}

export default function ModernButton({
	children,
	variant = 'contained',
	startIcon,
	endIcon,
	onClick,
	color = 'primary',
	disabled = false
}: ModernButtonProps) {
	const getButtonStyles = () => {
		const baseStyles = {
			borderRadius: 2,
			textTransform: 'none' as const,
			fontWeight: 600
		};

		if (variant === 'contained') {
			return {
				...baseStyles,
				bgcolor: '#22c55e',
				'&:hover': {
					bgcolor: '#16a34a'
				}
			};
		}

		if (variant === 'outlined') {
			return {
				...baseStyles,
				borderColor: '#22c55e',
				color: '#22c55e',
				'&:hover': {
					borderColor: '#16a34a',
					bgcolor: '#f0fdf4'
				}
			};
		}

		return baseStyles;
	};

	return (
		<Button
			variant={variant}
			startIcon={startIcon}
			endIcon={endIcon}
			onClick={onClick}
			disabled={disabled}
			sx={getButtonStyles()}
		>
			{children}
		</Button>
	);
}

export function ModernIconButton({
	children,
	onClick,
	color = 'primary',
	size = 'small'
}: {
	children: ReactNode;
	onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	color?: 'primary' | 'success' | 'error' | 'warning';
	size?: 'small' | 'medium' | 'large';
}) {
	const getIconButtonStyles = () => {
		const colorMap = {
			primary: { color: '#3b82f6', hover: '#eff6ff' },
			success: { color: '#22c55e', hover: '#f0fdf4' },
			error: { color: '#ef4444', hover: '#fef2f2' },
			warning: { color: '#f59e0b', hover: '#fef3c7' }
		};

		const colors = colorMap[color];

		return {
			color: colors.color,
			'&:hover': { bgcolor: colors.hover }
		};
	};

	return (
		<IconButton size={size} onClick={onClick} sx={getIconButtonStyles()}>
			{children}
		</IconButton>
	);
}