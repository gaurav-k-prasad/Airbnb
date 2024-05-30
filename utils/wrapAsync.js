module.exports = function wrapAsync(fn) {
	return function (req, res, next) {
		fn(req, res, next).catch((err) => {
			console.log(err);
            next(err)
        });
	};
}
