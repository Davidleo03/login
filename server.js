const express = require('express');
const app = express();
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passportLocal = require('passport-local').Strategy;

app.use(express.urlencoded({extended: true}));

app.use(cookieParser('Secreto'));

app.use(session({
    secret : 'Secreto',
    resave : true,
    saveUninitialized : true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(function(username, password, done){
    if(username == 'David.12' && password == '123456') {
        return done(null, {id: 1, name: 'Cody'})
    }
    done(null, false);
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
})

passport.deserializeUser(function(id, done){
    done(null, {id: 1, name: 'Cody'})
})

app.set('view engine', 'ejs')

app.get('/', (req, res, next) => {
    if(req.isAuthenticated()) return next()

    res.redirect('/login');
},(req, res) => {
    res.render('index')
});

app.get('/login', (req, res) => {
    res.render('login')
});

app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.listen(3000, () => console.log('Server started'));
