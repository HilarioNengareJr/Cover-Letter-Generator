const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const generateCL = require('./utilities/generateCL');
const fs = require('fs');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

app.post('/', async (req, res) => {
  const userInput = req.body.inputData;

  const coverLetter = await generateCL(userInput);

  await fs.writeFile('cover-letter.txt', coverLetter, (error) => {
    if (error) {
      console.log(`Error Occurred: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Cover letter written');
      res.json({
        coverLetter: coverLetter
      });
    }
  });
});


module.exports = app;
