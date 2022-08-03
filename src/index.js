const express = require('express')
const app = express();

app.set('port', process.env.PORT || 3002);

app.use(express.json());

const routeRoter = require('./routes/user.js')
app.use("/api", routeRoter)

app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});