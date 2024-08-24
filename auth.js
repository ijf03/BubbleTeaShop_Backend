const jwt = require('jsonwebtoken');
const secret = "TeaTimeDrinks";

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        userName: user.userName,
        isAdmin: user.isAdmin
    };
    return jwt.sign(data, secret, {});
};

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;
    console.log(token);

    if (typeof token === "undefined") {
        return res.status(401).send({ auth: "Unauthorized" });
    } else {
        token = token.slice(7, token.length);

        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                return res.send({
                    auth: "Failed",
                    message: err.message
                });
            } else {
                req.user = decodedToken;
                next();
            }
        });
    }
};

module.exports.verifyAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        return res.status(401).send({
            auth: "Unauthorized",
            message: "Forbidden Action"
        });
    }
};
