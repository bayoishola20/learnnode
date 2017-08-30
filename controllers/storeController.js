exports.myMiddleware = (req, res, next) => {
    req.name = 'bayo';
    // res.cookie('name', 'bayo is awesome', {maxAge: 50000});
    if(req.name === 'bayo') {
        throw Error("What's that?");
    }
    next();
}

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index');
}