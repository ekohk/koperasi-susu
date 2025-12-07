import Swal from 'sweetalert2';

/**
 * SweetAlert2 Utility Functions
 * Provides consistent styling and behavior for all alerts in the application
 */

// Custom styling for all alerts
const customSwalOptions = {
  confirmButtonColor: '#22c55e',
  cancelButtonColor: '#ef4444',
  customClass: {
    popup: 'rounded-xl',
    confirmButton: 'px-6 py-2.5 rounded-lg font-medium',
    cancelButton: 'px-6 py-2.5 rounded-lg font-medium',
  },
};

/**
 * Show success message
 * @param message - Main message text
 * @param title - Optional title (default: 'Berhasil!')
 */
export const showSuccess = (message: string, title: string = 'Berhasil!') => {
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    ...customSwalOptions,
  });
};

/**
 * Show error message
 * @param message - Error message text
 * @param title - Optional title (default: 'Terjadi Kesalahan')
 */
export const showError = (message: string, title: string = 'Terjadi Kesalahan') => {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'OK',
    ...customSwalOptions,
  });
};

/**
 * Show warning message
 * @param message - Warning message text
 * @param title - Optional title (default: 'Peringatan')
 */
export const showWarning = (message: string, title: string = 'Peringatan') => {
  return Swal.fire({
    icon: 'warning',
    title,
    text: message,
    confirmButtonText: 'OK',
    ...customSwalOptions,
  });
};

/**
 * Show info message
 * @param message - Info message text
 * @param title - Optional title (default: 'Informasi')
 */
export const showInfo = (message: string, title: string = 'Informasi') => {
  return Swal.fire({
    icon: 'info',
    title,
    text: message,
    confirmButtonText: 'OK',
    ...customSwalOptions,
  });
};

/**
 * Show confirmation dialog
 * @param message - Confirmation message text
 * @param title - Optional title (default: 'Konfirmasi')
 * @returns Promise<boolean> - true if confirmed, false if cancelled
 */
export const showConfirm = async (
  message: string,
  title: string = 'Konfirmasi'
): Promise<boolean> => {
  const result = await Swal.fire({
    icon: 'question',
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    ...customSwalOptions,
  });

  return result.isConfirmed;
};

/**
 * Show delete confirmation dialog
 * @param itemName - Name of item to delete (optional)
 * @returns Promise<boolean> - true if confirmed, false if cancelled
 */
export const showDeleteConfirm = async (itemName?: string): Promise<boolean> => {
  const message = itemName
    ? `Apakah Anda yakin ingin menghapus ${itemName}?`
    : 'Apakah Anda yakin ingin menghapus data ini?';

  const result = await Swal.fire({
    icon: 'warning',
    title: 'Konfirmasi Hapus',
    html: `
      <p class="text-gray-600">${message}</p>
      <p class="text-sm text-red-600 mt-2">Tindakan ini tidak dapat dibatalkan!</p>
    `,
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    customClass: customSwalOptions.customClass,
  });

  return result.isConfirmed;
};

/**
 * Show loading spinner
 * @param message - Loading message text (default: 'Memproses...')
 */
export const showLoading = (message: string = 'Memproses...') => {
  Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

/**
 * Close any open SweetAlert
 */
export const closeAlert = () => {
  Swal.close();
};

/**
 * Show toast notification (non-blocking)
 * @param message - Toast message
 * @param icon - Icon type (success, error, warning, info)
 */
export const showToast = (
  message: string,
  icon: 'success' | 'error' | 'warning' | 'info' = 'success'
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  return Toast.fire({
    icon,
    title: message,
  });
};
