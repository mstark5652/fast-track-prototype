
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.disable('etag');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));

// app.use('/', require(path.join(__dirname, 'routes', 'app-views')));

app.get('/', (req, res, next) => {
    return res.render('index');
});


// Basic Error Handler
app.use((err, req, res, next) => {
    console.error("Server error:");
    console.error(err);

    res.status(500).send(err.response || "Something broke");
});

if (module == require.main) {
    const server = app.listen(8080, () => {
        const port = server.address().port;
        console.log(`App listening on localhost:${port}`);
    });
}

module.exports = app;

