const express = require('express');
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
const app = express();

app.get('/', (req, res) => {
    res.send('hola');
});

app.listen(2000, () => {
    console.log('server iniciado');
});

function Login(){
    return(
        <div className='d-flex justify-content-center aling-items-center bg-primary'>
            <div className='p-3 bg-white w-25'>
                <form action="">
                    <div className='mb-3'>
                        <label htmlFor='mail'>Correo</label>
                        <input type='mail'placeholder='Ingrese Correo' className='form-control'></input>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='pass'>Contraseña</label>
                        <input type='pass'placeholder='Ingrese Contraseña' className='form-control'></input>
                    </div>
                    <button className='btn btn-success'>Login</button>
                </form>
            </div>
        </div>
    )
}
//prueba para el commit
// xd
export default Login;
