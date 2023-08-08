import './imageModal.scss';

import { Backdrop, Box, Button, Fade, IconButton, Modal, Typography } from "@mui/material";

import { Close } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

export type ImageModalProps = {
    titulo: string;
    ano: string;
    tecnica: string;
    disponivel: boolean;
    dimensoes: string;
    imageURL: string
    open: boolean;
    onClose: () => void;
};

const style = {
    position: 'absolute' as 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.dark',
    border: 'none',
    p: 4,
};

const ImageModal = (props: ImageModalProps) => {
    const navigate = useNavigate();

    function handleClick() {
        const currentImage = props.imageURL;
        const workName = props.titulo;
        navigate('/message', { state: { currentImage, workName } });
    }
    
    return (
        <div className="image-modal">
            <Modal 
                open={props.open}
                onClose={props.onClose}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={props.open}>
                    <div className="image-modal__content">
                        <IconButton 
                            aria-label="delete" 
                            onClick={props.onClose} 
                            className="image-modal__content--button">
                            <Close className="image-modal__content--button--icon"/>
                        </IconButton>
                            <Box sx={style} className='image-modal__content--box'>                  
                                <img src={props.imageURL} style={{height: '70vh', width: 'auto', maxWidth: '100vw'}}/>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }} color='white'>
                                    {props.titulo}, {props.ano}
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }} color='white'>
                                    {props.tecnica}
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }} color='white'>
                                    {props.dimensoes}
                                </Typography>
                            </Box>
                        {props.disponivel && 
                            <div className='image-modal__content--available'>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }} color='white'>
                                    disponível
                                </Typography>
                                <Button 
                                    size="small" 
                                    variant="text" 
                                    onClick={handleClick}
                                >
                                    falar com a galeria
                                </Button>
                            </div>
                        }
                    </div>
                </Fade>

            </Modal>
        </div>
    )
}

export default ImageModal;