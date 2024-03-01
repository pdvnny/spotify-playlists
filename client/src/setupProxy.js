const proxy = require('http-proxy-middleware').createProxyMiddleware;

module.exports = function(app) {
    app.use(proxy(`/auth/**`, {
        target: 'http://localhost:8888'
    }));

    // app.use(proxy(`/league/**`, {
    //     target: 'http://localhost:8888'
    // }));

    app.use(proxy(`/api/**`, {
        target: 'http://localhost:8888'
    }));
};

/*  EXPLANATION

Allows us to configure a way to have /auth/* requests sent to
the backend.

I'm not sure how this stuff works in production. I had a note
that says "this proxy should not affect anything in production", which
I assume might mean that in a production environment the backend
and frontend aren't supposed to have different addresses *shrug*.
*/
