import { Box, Typography } from "@mui/material";
import { Image, Obra } from "../../types/types";

type ImageModalProps = {
    titulo: string;
    ano: string;
    tecnica: string;
    disponivel: boolean;
    dimensoes: string;
    imageURL: string
};

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const ImageModal = (props: ImageModalProps) => {
    return (
        <Box sx={style}>
            <img src={props.imageURL}/>
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
    )
}

export default ImageModal;