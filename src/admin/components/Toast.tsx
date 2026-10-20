import { Alert, Snackbar } from '@mui/material'

export type ToastState = { message: string; severity: 'success' | 'error' } | null

const Toast = ({ toast, onClose }: { toast: ToastState; onClose: () => void }) => (
    <Snackbar open={!!toast} autoHideDuration={5000} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        {toast ? <Alert severity={toast.severity} onClose={onClose}>{toast.message}</Alert> : undefined}
    </Snackbar>
)

export default Toast
