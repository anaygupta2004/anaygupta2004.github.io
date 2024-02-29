import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

export default function NamesForm() {
    const [names, setNames] = useState('');

    const sendNames = () => {
        fetch('https://3.137.205.228:443', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ names: names }),
        })
        .then(response => response.text())
        .then(data => {
            alert('Success:\n' + data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Enter Names (comma-separated)
            </Typography>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <TextField
                    label="Names"
                    variant="outlined"
                    value={names}
                    onChange={(e) => setNames(e.target.value)}
                    fullWidth
                />
                <Button variant="contained" color="primary" onClick={sendNames} sx={{ m: 1 }}>
                    Send
                </Button>
            </Box>
        </Container>
    );
}
