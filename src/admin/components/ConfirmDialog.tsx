import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

type ConfirmDialogProps = {
    open: boolean
    title: string
    message: string
    confirmLabel?: string
    busy?: boolean
    onConfirm: () => void
    onCancel: () => void
}

const ConfirmDialog = ({ open, title, message, confirmLabel = 'Excluir', busy, onConfirm, onCancel }: ConfirmDialogProps) => (
    <Dialog open={open} onClose={busy ? undefined : onCancel}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <button className="admin__button" onClick={onCancel} disabled={busy}>Cancelar</button>
            <button className="admin__button admin__button--delete" onClick={onConfirm} disabled={busy}>
                {busy ? 'Aguarde...' : confirmLabel}
            </button>
        </DialogActions>
    </Dialog>
)

export default ConfirmDialog
