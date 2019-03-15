const express = require('express');
const path=require('path');
const parser = require('busboy-body-parser');
const saveFile = require('save-file');

const PORT = process.env.PORT || 5000

// Express App
const app = express(); 
 
app.use('/', express.static(path.join(__dirname , 'public_static')));

app.use(parser());

app.post('/downloadWAV', async (req,res,next) => {
  await saveFile(req.files.audio.data, req.files.audio.name);
  res.send(JSON.stringify('parsing data'));
})

app.listen(PORT,() => console.log(`Server started on ${PORT} port.`));