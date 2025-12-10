
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname));

app.use('/assets', express.static(path.join(__dirname, 'asset')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Redirect
app.get('/home',(req,res)=>{
    res.redirect('/')
})

app.get('/future',(req,res)=>{
    res.sendFile(path.join(__dirname, 'future.html'));
})
app.get('/history',(req,res)=>{
    res.sendFile(path.join(__dirname, 'history.html'));
})
app.get('/spot',(req,res)=>{
    res.sendFile(path.join(__dirname, 'spot.html'));
})
app.get('/story',(req,res)=>{
    res.sendFile(path.join(__dirname, 'story.html'));
})


app.use((req,res)=>{
res.status(404).sendFile(path.join(__dirname, 'error.html'))
res.set({
        'Content-Type': 'text/html',
        'Refresh': '5;url=/'
    })
}) 


app.listen(3000)
