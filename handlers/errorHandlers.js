// WRAP AROUND FXNS TO CATCH ERRORS INSTEAD OF TRY CATCH
exports.catchErrors = (fn) => {
    return function(req, res, next) {
        return fn(req, res, next).catch(next);
    };
};

// FILE NOT FOUND ERROR HANDLER - 404
exports.notFound = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
};

// DEVELOPMENT ERROR HANDLER
exports.developmentErrors = (err, req, res, next) => {
    err.stack = err.stack || '';
    const errorDetails = {
        message: err.message,
        status: err.status,
        // stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
    };
    res.status(err.status || 500);
    res.format({
        // Based on the `Accept` http header
        'text/html': () => {
        res.render('error', errorDetails);
        }, // Form Submit, Reload the page
        'application/json': () => res.json(errorDetails) // Ajax call, send JSON back
    });
};

// PRODUCTION ERROR HANDLER
exports.productionErrors = (err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
};