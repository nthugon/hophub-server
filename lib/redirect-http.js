module.exports = function getRedirectHttp() {
    return function redirectHttp(req, res, next) {
        // if https, call next
        if(req.headers['x-forwarded-proto'] === 'https') next();
        // otherwise redirect to same url, but with https instead of http
        else res.redirect(`https://${req.hostname}${req.url}`);
    };
};

