import './message.scss';

import { Alert, Box, Button, FormGroup, Input, Snackbar, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { Obra } from '../../types/types';
import emailjs from '@emailjs/browser';
import { useLocation } from "react-router-dom";

const Message = () => {
    const location = useLocation();
    const currentImage = location.state?.currentImage;
    const workName = location.state?.workName;

    const [open, setOpen] = useState(false);
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleClose = () => setOpen(false);

    function validateEmail(input: string) {
        let error
        let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      
        if (input.match(validRegex) || input==='' ) {
        
          error = false;
      
        } else {      
           error = true;
        }
        return error
    }

    function sendEmail(e: any){
        e.preventDefault();

        if (nome === '' || email === '' || mensagem === ''){
            alert("Preencha todos os campos");
            return;
        }

        if (validateEmail(email)){
            setEmail('');
            alert("Preencha um email válido");
            return;
        };

        const templateParams = {
            from_name: nome,
            message: mensagem,
            email: email,
            image_url: currentImage,
            subject: workName,
            from_number: telefone,
        }
        
        emailjs.send('service_ldf1096', 'template_xhftvkg', templateParams, 'TxaQDVB72z6zI1ORc')
        .then((response) => {
            console.log('email enviado', response.status, response.text, templateParams);
            setNome('');
            setEmail('');
            setMensagem('');
            setTelefone('');
        }, (error) => {
            console.log('Erro: ', error)
        })
        setOpen(true);
    }

    return (
        <div className="messagePage">
            <div className="messagePage__content" >
                <div className="messagePage__content--header">
                    <h1>Fale com a galeria</h1>
                    <p>Deseja falar com a galeria?</p>
                </div>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { 
                            m: 1, 
                            width: '70vw' 
                        },
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={sendEmail}
                    className="messagePage__content--form"
                >

                    <TextField
                        error={validateEmail(email)}
                        required
                        id="filled-required"
                        label="Email"
                        variant="filled"
                        placeholder="Digite seu email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <TextField
                        required
                        id="filled-required"
                        label="Nome Completo"
                        variant="filled"
                        placeholder="Digite seu nome completo"
                        onChange={(e) => setNome(e.target.value)}
                        value={nome}
                    />
                    <TextField
                        id="filled-number"
                        label="Telefone"
                        type="number"
                        variant="filled"
                        helperText='número com DDD'
                        onChange={(e) => setTelefone(e.target.value)}
                        value={telefone}
                    />
                    <div className="messagePage__content--form--image">
                        <TextField
                            id="filled-multiline-static"
                            label="Mensagem"
                            multiline
                            rows={10}
                            placeholder="Digite aqui sua mensagem"
                            variant="filled"
                            onChange={(e) => setMensagem(e.target.value)}
                            value={mensagem}
                            />
                        <img src={currentImage}></img>
                    </div>
                    <Input 
                        type="submit" 
                        value="Enviar"
                        style={{
                            margin: '10px',
                            color: 'white',
                            backgroundColor: 'black',
                            padding: '0px 10px',
                        }} 
                    />
                </Box>
            </div>
            <Snackbar 
                open={open} 
                autoHideDuration={2000} 
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Email enviado com sucesso!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Message