const express = require('express');
const nunjucks = require('nunjucks');
const moment = require('moment');

const app = express();

nunjucks.configure('views', { autoescape: true, express: app, watch: true });

app.set('view engine', 'njk');
app.use(express.urlencoded({ extended: false }));

const md = (req, res, next) => {
  const { age } = req.params;

  if (!age) {
    return res.redirect('/');
  }

  return next();
};

app.get('/', (req, res) => res.render('index'));

app.post('/check', (req, res) => {
  moment.locale('pt-BR');
  const { bday } = req.body;
  const age = moment(Date.now()).diff(moment(bday, 'YYYY/MM/DD'), 'years', false);

  if (age >= 18) {
    return res.redirect(`/major/${age}`);
  } if (age >= 0 && age < 18) {
    return res.redirect(`/minor/${age}`);
  }
  return res.redirect('back');
});

app.get('/major/:age', md, (req, res) => {
  const { age } = req.params;

  return res.render('major', { age });
});

app.get('/minor/:age', md, (req, res) => {
  const { age } = req.params;

  return res.render('minor', { age });
});

app.listen(3000);
