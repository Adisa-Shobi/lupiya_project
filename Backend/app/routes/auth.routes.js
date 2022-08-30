const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");
module.exports = function (app) {
    console.log("Authentication function called")
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        // res.header("Access-Control-Allow-Credentials", true);
        // res.header("Access-Control-Allow-Methods", "POST");
        next();
    });
    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsername,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );
    app.post("/api/auth/signin", controller.signin);
    app.post("/api/auth/signout", controller.signout);
    app.post("/api/auth/update", [ authJwt.verifyToken ], controller.updateFullname);
    app.post("/api/auth/deactivate", [ authJwt.verifyToken ], controller.deactivate)
};