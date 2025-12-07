import { Box, Card, CardContent, TextField, Typography, CircularProgress, Button, InputAdornment, IconButton } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Person, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { showSuccess, showError } from '../utils/sweetalert';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<{ username: string; newPassword: string; confirmPassword: string }>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const password = watch('newPassword');

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/reset-password', {
        username: data.username,
        newPassword: data.newPassword
      });

      if (response.data.success) {
        await showSuccess(response.data.message, 'Password Berhasil Direset');
        navigate('/login');
      }
    } catch (e: any) {
      showError(
        e.response?.data?.message || 'Gagal reset password',
        'Error'
      );
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
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
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
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
          top: '-150px',
          right: '-100px',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%)',
          bottom: '-200px',
          left: '-150px',
        }
      }} />

      <Card sx={{
        maxWidth: 450,
        width: '100%',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: 2,
        overflow: 'visible'
      }}>
        {/* Header dengan Icon */}
        <Box sx={{
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'white',
          position: 'relative'
        }}>
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}>
            <Lock sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Reset Password
          </Typography>
          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.9 }}>
            Masukkan username dan password baru Anda
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <form onSubmit={onSubmit}>
            <TextField
              label="Username"
              type="text"
              fullWidth
              margin="normal"
              {...register('username', {
                required: 'Username harus diisi',
                minLength: {
                  value: 3,
                  message: 'Username minimal 3 karakter'
                }
              })}
              error={!!errors.username}
              helperText={errors.username?.message}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#22c55e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#22c55e',
                  },
                },
              }}
            />

            <TextField
              label="Password Baru"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              {...register('newPassword', {
                required: 'Password harus diisi',
                minLength: {
                  value: 6,
                  message: 'Password minimal 6 karakter'
                }
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#22c55e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#22c55e',
                  },
                },
              }}
            />

            <TextField
              label="Konfirmasi Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              {...register('confirmPassword', {
                required: 'Konfirmasi password harus diisi',
                validate: (value) => value === password || 'Password tidak cocok'
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#22c55e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#22c55e',
                  },
                },
              }}
            />

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Lock />}
                sx={{
                  bgcolor: '#22c55e',
                  '&:hover': { bgcolor: '#16a34a' },
                  py: 1.5,
                  fontWeight: 600
                }}
              >
                {loading ? 'Mereset Password...' : 'Reset Password'}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/login')}
                disabled={loading}
                startIcon={<ArrowBack />}
                sx={{
                  borderColor: '#22c55e',
                  color: '#22c55e',
                  '&:hover': { borderColor: '#16a34a', bgcolor: 'rgba(34,197,94,0.1)' },
                  py: 1.5,
                  fontWeight: 600
                }}
              >
                Kembali ke Login
              </Button>
            </Box>
          </form>

          <Box sx={{
            mt: 4,
            p: 2.5,
            bgcolor: '#f0fdf4',
            borderRadius: 2,
            border: '1px solid #86efac',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#15803d', textAlign: 'center' }}>
              💡 <strong>Catatan:</strong> Password akan langsung diperbarui ke database
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
