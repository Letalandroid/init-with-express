// Dependencies:
    // For server: express, morgan, dotenv
    const express = require('express');
    const morgan = require('morgan');
    require('./models/example.js');

const path = require('path');
const exphbs = require('express-handlebars');
const override = require('method-override');

// DB Connection
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB Connected')).catch(err => console.log(err));

// App setup
const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(override('_method'));
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    defaultLayout: 'main',
    extname: '.hbs'
    }));
app.set('view engine', '.hbs');

const port = process.env.PORT || 3000;

// Routes
app.listen(port, () => console.log(`Listening on port ${port}`));

const Example1 = require('./models/example');
app.get('/', async (_req, res) => {

    try {
        const example1DB = await Example1.find().lean();

        res.render('index', {
            personas: example1DB
        });


    } catch (error) {
        console.log(error);
    }

})

app.post('/', async (req, res) => {

    const { name } = req.body;
    const nuevaNota = new Example1({ name }).save();

    nuevaNota.then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    });

    res.redirect('/');

})

app.delete('/delete/:id', async (req, res) => {

        await Example1.findByIdAndDelete(req.params.id);
        res.redirect('/');

})

app.get('/edit/:id', async (req, res) => {

    const name = await Example1.findById(req.params.id).lean();

    res.render('edit', { name });

})

app.put('/edit/:id', async (req, res) => {

    const { name } = req.body;
    await Example1.findByIdAndUpdate(req.params.id, { name });
    res.redirect('/');

})