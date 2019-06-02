let express = require('express'),
  ejs = require('ejs'),
  photos = require('./photos');
let app = express();
let port = process.env.PORT;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => res.render('home', { photos: photos }));

app.listen(port, () => console.log(`server connected on port: ${port}`));
