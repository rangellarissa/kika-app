import { Backdrop, Box, Button, Fade, IconButton, Modal, Typography } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";

type ImageModalProps = {
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
    width: '100vh',
    bgcolor: 'background.dark',
    border: 'none',
    p: 4,
};

const ImageModal = (props: ImageModalProps) => {

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
                    <div>
                        <IconButton aria-label="delete" onClick={props.onClose}>
                            <DeleteIcon />
                        </IconButton>
                        <Box sx={style} className='image-modal__box'>                  
                            <img src={props.imageURL} style={{height: '70vh', width: 'auto'}}/>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                `{props.titulo} + {props.ano}`
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                {props.tecnica}
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                {props.dimensoes}
                            </Typography>
                        </Box>
                    </div>
                </Fade>

            </Modal>
        </div>
    )
}

export default ImageModal;