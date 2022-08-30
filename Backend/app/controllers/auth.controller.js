const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        fullname: req.body.fullname,
        password: bcrypt.hashSync(req.body.password, 8),
        active: true
    });
    console.log("Request made to register user");
    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (req.body.roles) {
            Role.find({
                name: { $in: req.body.roles },
            },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    user.roles = roles.map((role) => role._id);
                    user.save((err) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }
                        res.send({ message: "User was registered successfully!" });
                    });
                }
            );
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                user.roles = [role._id];
                user.save((err) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.send({ message: "User was registered succesfully!" });
                });
            });
        };
    });
};
exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username,
    })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (!user) {
                return res.status(500).send({ message: "User not found." });
            }
            var isPasswordValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!isPasswordValid) {
                return res.status(401).send({ message: "Invalid Password!" });
            }
            if (!user.active) {
                return res.status(401).send({ message: "Account Deactivated!" });
            }
            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400, //24 hrs
            });
            var authorities = [];
            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }
            req.session.token = token;
            res.status(200).send({
                id: user._id,
                username: user.username,
                fullname: user.fullname,
                active: user.active,
                role: authorities,
            });
        });
};
exports.signout = async (req, res) => {
    try {
        req.session = null;
        return res.status(200).send({ message: "You've been signed out!" });
    } catch (err) {
        this.next(err);
    }
};
exports.updateFullname = (req, res) => {
    const filter = { username: req.body.username };
    const update = { fullname: req.body.fullname };
    User.findOneAndUpdate(filter, update, {
        returnOriginal: false
    }).populate('roles', '-__v').exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!user) {
            return res.status(500).send({ message: "User not found." });
        }
        var authorities = [];
        for (let i = 0; i < user.roles.length; i++) {
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
            id: user._id,
            username: user.username,
            fullname: user.fullname,
            role: authorities
        });
    });
};
exports.deactivate = (req, res) => {
    const filter = { username: req.body.username };
    const update = { active: false }
    User.findOne(filter).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!user) {
            return res.status(500).send({ message: "User not found." })
        }
        if (user.active) {
            User.findByIdAndUpdate(user._id, update, (err) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.status(200).send({message: "User deactivated Successfuly"});
            })
            
        }
    })

};

