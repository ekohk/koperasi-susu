import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
    Snackbar,
    Alert,
    AlertTitle,
    Slide,
    Fade,
    IconButton,
    Box,
    Typography
} from '@mui/material';
import {
    CheckCircle,
    Error as ErrorIcon,
    Warning,
    Info,
    Close
} from '@mui/icons-material';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
    type: NotificationType;
    title?: string;
    message: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface NotificationContextType {
    showNotification: (options: NotificationOptions) => void;
    showSuccess: (message: string, title?: string) => void;
    showError: (message: string, title?: string) => void;
    showWarning: (message: string, title?: string) => void;
    showInfo: (message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

function SlideTransition(props: any) {
    return <Slide {...props} direction="down" />;
}

const typeConfig = {
    success: {
        icon: CheckCircle,
        color: '#22c55e',
        bgColor: '#dcfce7',
        borderColor: '#bbf7d0'
    },
    error: {
        icon: ErrorIcon,
        color: '#ef4444',
        bgColor: '#fef2f2',
        borderColor: '#fecaca'
    },
    warning: {
        icon: Warning,
        color: '#f59e0b',
        bgColor: '#fef3c7',
        borderColor: '#fde68a'
    },
    info: {
        icon: Info,
        color: '#3b82f6',
        bgColor: '#eff6ff',
        borderColor: '#dbeafe'
    }
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notification, setNotification] = useState<NotificationOptions | null>(null);
    const [open, setOpen] = useState(false);

    const showNotification = useCallback((options: NotificationOptions) => {
        setNotification(options);
        setOpen(true);
    }, []);

    const showSuccess = useCallback((message: string, title?: string) => {
        showNotification({ type: 'success', message, title });
    }, [showNotification]);

    const showError = useCallback((message: string, title?: string) => {
        showNotification({ type: 'error', message, title });
    }, [showNotification]);

    const showWarning = useCallback((message: string, title?: string) => {
        showNotification({ type: 'warning', message, title });
    }, [showNotification]);

    const showInfo = useCallback((message: string, title?: string) => {
        showNotification({ type: 'info', message, title });
    }, [showNotification]);

    const handleClose = useCallback((event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }, []);

    const config = notification ? typeConfig[notification.type] : typeConfig.info;
    const IconComponent = config.icon;

    return (
        <NotificationContext.Provider value={{
            showNotification,
            showSuccess,
            showError,
            showWarning,
            showInfo
        }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={notification?.duration || 4000}
                onClose={handleClose}
                TransitionComponent={SlideTransition}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        padding: 0,
                        backgroundColor: 'transparent',
                        boxShadow: 'none'
                    }
                }}
            >
                <Fade in={open} timeout={300}>
                    <Box
                        sx={{
                            minWidth: 320,
                            maxWidth: 450,
                            bgcolor: config.bgColor,
                            border: `1px solid ${config.borderColor}`,
                            borderRadius: 3,
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            backdropFilter: 'blur(8px)',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        {/* Animated border */}
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            bgcolor: config.color,
                            animation: 'slideIn 0.3s ease-out'
                        }} />

                        <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            {/* Icon with pulse animation */}
                            <Box sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                animation: 'pulse 1.5s ease-in-out infinite'
                            }}>
                                <IconComponent sx={{ color: config.color, fontSize: 20 }} />
                            </Box>

                            {/* Content */}
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                {notification?.title && (
                                    <Typography variant="subtitle2" sx={{
                                        fontWeight: 600,
                                        color: '#1f2937',
                                        mb: 0.5,
                                        fontSize: '0.875rem'
                                    }}>
                                        {notification.title}
                                    </Typography>
                                )}
                                <Typography variant="body2" sx={{
                                    color: '#374151',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.4
                                }}>
                                    {notification?.message}
                                </Typography>

                                {/* Action button */}
                                {notification?.action && (
                                    <Box sx={{ mt: 2 }}>
                                        <button
                                            onClick={() => {
                                                notification.action?.onClick();
                                                handleClose();
                                            }}
                                            style={{
                                                background: config.color,
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '6px 12px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                        >
                                            {notification.action.label}
                                        </button>
                                    </Box>
                                )}
                            </Box>

                            {/* Close button */}
                            <IconButton
                                size="small"
                                onClick={handleClose}
                                sx={{
                                    color: '#9ca3af',
                                    width: 24,
                                    height: 24,
                                    '&:hover': {
                                        bgcolor: 'rgba(0, 0, 0, 0.05)',
                                        color: '#6b7280'
                                    }
                                }}
                            >
                                <Close fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </Fade>
            </Snackbar>

            {/* CSS animations */}
            <style>
                {`
                    @keyframes slideIn {
                        from { width: 0; }
                        to { width: 100%; }
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                `}
            </style>
        </NotificationContext.Provider>
    );
};