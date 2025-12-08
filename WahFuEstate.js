const express = require('express')

const app = express()

app.get('/',(req,res)=>{
    res.sendFile('./index.html',{root:__dirname})
})

app.get('/home',(req,res)=>{
    res.redirect('/',{root:__dirname})
})

app.get('/future',(req,res)=>{
    res.sendFile('./future.html',{root:__dirname})
})
app.get('/history',(req,res)=>{
    res.sendFile('./history.html',{root:__dirname})
})
app.get('/spot',(req,res)=>{
    res.sendFile('./spot.html',{root:__dirname})
})
app.get('/story',(req,res)=>{
    res.sendFile('./history.html',{root:__dirname})
})
app.get('/comment',(req,res)=>{
    res.sendFile('./comment.html',{root:__dirname})
})
app.get('/error',(req,res)=>{
    res.status(404).sendFile('./error.html',{root:__dirname})
    res.set({
        'Content-Type': 'text/html',
        'Refresh': '5;url=/'
    })
})
app.listen(3000)