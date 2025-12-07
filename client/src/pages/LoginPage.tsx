import { Box, Button, Card, CardContent, CircularProgress, Container, TextField, Typography, Fade, Slide } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/auth/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showError, showSuccess } from '../utils/sweetalert';

export default function LoginPage() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<{ username: string; password: string }>();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      await login(data.username, data.password);
      navigate('/');
    } catch (e: any) {
      showError(e.message || 'Gagal masuk ke sistem', 'Login Gagal');
    } finally {
      setLoading(false);
    }
  });

  return (
    <Box sx={{
      minHeight: '100vh',
      height: '100%',
      bgcolor: '#f8fafc',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0.1) 100%)',
        zIndex: 0,
        pointerEvents: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'float 20s ease-in-out infinite',
        }
      }} />

      <Container maxWidth="sm" sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1
      }}>
        <Fade in timeout={600}>
          <Card sx={{
            width: '100%',
            borderRadius: 4,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)'
          }}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              {/* Logo and Title Section */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  bgcolor: '#dcfce7',
                  border: '2px solid #22c55e',
                  animation: 'pulse 2s infinite'
                }}>
                  <img
                    src="/logo.png"
                    alt="Logo Koperasi Susu"
                    style={{
                      width: 56,
                      height: 56,
                      objectFit: 'contain'
                    }}
                  />
                </Box>
                <Typography variant="h4" sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: '#1f2937',
                  letterSpacing: '-0.025em'
                }}>
                  Koperasi Susu
                </Typography>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: '#22c55e',
                  mb: 1,
                  fontSize: '1.125rem'
                }}>
                  Banyu Makmur
                </Typography>
                <Typography variant="body2" sx={{
                  color: '#6b7280',
                  fontWeight: 500
                }}>
                  Silakan login untuk melanjutkan
                </Typography>
              </Box>

              {/* Form Section */}
              <Slide direction="up" in={showForm} timeout={600}>
                <Box component="form" onSubmit={onSubmit}>
                  <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    {...register('username', { required: 'Username wajib diisi' })}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.2)'
                        }
                      }
                    }}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    {...register('password', { required: 'Password wajib diisi' })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.2)'
                        }
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 3,
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: '#22c55e',
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.2)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: '#16a34a',
                        boxShadow: '0 10px 15px -3px rgba(34, 197, 94, 0.3)',
                        transform: 'translateY(-1px)'
                      },
                      '&:active': {
                        transform: 'translateY(0)'
                      },
                      '&:disabled': {
                        bgcolor: '#9ca3af',
                        transform: 'none'
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        <span>Memproses...</span>
                      </Box>
                    ) : (
                      'Login'
                    )}
                  </Button>

                  {/* Forgot Password Link */}
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button
                      onClick={() => navigate('/forgot-password')}
                      disabled={loading}
                      sx={{
                        textTransform: 'none',
                        color: '#22c55e',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        '&:hover': {
                          bgcolor: 'rgba(34, 197, 94, 0.1)'
                        }
                      }}
                    >
                      Lupa Password?
                    </Button>
                  </Box>

                  {/* Register Link */}
                  <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                      Belum punya akun?
                    </Typography>
                    <Button
                      onClick={() => navigate('/register')}
                      disabled={loading}
                      variant="outlined"
                      fullWidth
                      sx={{
                        textTransform: 'none',
                        borderColor: '#22c55e',
                        color: '#22c55e',
                        fontWeight: 600,
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: 'rgba(34, 197, 94, 0.1)',
                          borderColor: '#16a34a'
                        }
                      }}
                    >
                      Daftar Sekarang
                    </Button>
                  </Box>

                </Box>
              </Slide>
            </CardContent>
          </Card>
        </Fade>
      </Container>

      {/* CSS Animation Keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
    </Box>
  );
}
