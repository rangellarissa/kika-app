import './message.scss';

import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { Obra } from '../../types/types';
import { useLocation } from "react-router-dom";

const Message = () => {
    const location = useLocation();
    const currentImage = location.state?.currentImage;
    const [obra, setObra] = useState<Obra[]>();
    console.log(currentImage);
    const [nome, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    
    useEffect(() => {
        async function fetchData() {
            const response = await fetch('https://kika-api.vercel.app/api/obra');
            const jsonData = await response.json();
            setObra(jsonData);
        }
        fetchData();

    }, []);

    function handleClick() {
        console.log('enviar')
    }
    
    if(!obra){
    return null;
    };

    return (
        <div className="messagePage">
            <div className="messagePage__content" >
                <div className="messagePage__content--header">
                    <h1>Fale com a galeria</h1>
                    <p>Deseja falar com a galeria?</p>
                </div>
                <div className='messagePage__content--form'>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '500px' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            required
                            id="filled-required"
                            label="Email"
                            variant="filled"
                            placeholder="Digite seu email"
                        />
                        <TextField
                            required
                            id="filled-required"
                            label="Nome Completo"
                            variant="filled"
                            placeholder="Digite seu nome completo"
                        />
                        <TextField
                            id="filled-number"
                            label="Telefone"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                            helperText='número com DDD'
                        />
                        <div className="messagePage__content--form--image">
                            <TextField
                                id="filled-multiline-static"
                                label="Mensagem"
                                multiline
                                rows={10}
                                placeholder="Digite aqui sua mensagem"
                                variant="filled"
                            />
                            <img src={currentImage}></img>
                        </div>
                    </Box>
                </div>
                <Button 
                    size="small" 
                    variant="text" 
                    onClick={handleClick}
                >
                    Enviar
                </Button>
            </div>
        </div>
    );
};

export default Message