const usersModel = require("../models/users");
const taksModel = require("../models/tasks");
const statusModel = require("../models/statuses");
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

const dotenv = require('dotenv');

dotenv.config();

// statusModel.create({
 //    title: 'standart'
//}, function(err, data) {
 //   console.log(data);
// });

 //statusModel.create({
  //   title: 'important'
 //}, function(err, data) {
 //    console.log(data);
 //});

const generateAccessToken = (username) => {
    return jwt.sign({username}, process.env.TOKEN_SECRET, { expiresIn: '1d'});
}

const hashPass = async (pass) => {
    if (!pass && !pass.trim())
    {
        return;
    }

    pass = pass.trim();
    const res = await argon2.hash(pass);

    return res;
}

exports.statuses = function (req, res) {
    switch (req.query.action)
    {
        case 'get_statuses':
            statusModel.find({}, function(err, data) {
                res.json({
                    statuses: data
                })
            });
            break;
        default:
            break;
    }
}

exports.tasks = function (req, res) {
    console.log(req.query);
    switch (req.query.action)
    {
        case 'get_all':
            console.log(req.query.user_id);
            taksModel.find({
                user_owner: req.query.user_id
            }, function(err, data){
                res.json({
                    'tasks': data ? data : []
                });
            });
            break;
        case 'get_one':
            taksModel.findById(req.query.id, function(err, data) {
                res.json({
                    info: data
                });
            });
            break;
        case 'edit_one':
            taksModel.findByIdAndUpdate(req.query.id, {
                title: req.query.title.trim(),
                desc: req.query.desc.trim(),
                status_id: req.query.status_id,
                date_edit: new Date().toISOString()
            }, function(err, data) {
                res.json({
                    data: data,
                    err: err,
                    status: 'updated'
                });
            });
            break;
        case 'create_new':
            taksModel.create({
                title: req.query.title.trim(),
                desc: req.query.desc.trim(),
                date_created: new Date().toISOString(),
                date_edit: req.query.date_edit ? req.query.date_edit : new Date().toISOString(),
                status_id: req.query.status_id,
                user_owner: req.query.user_id
            }, function(err, data) {
                res.json({
                    status: 'created'
                });
            });
            break;
        case 'remove':
            taksModel.findOneAndDelete({
                _id: req.query.id
            }, function (err, data) {
                res.json({
                    status: 'removed'
                });
            });
            break;
        default:
            break;
    }
}

exports.users = function (req, res) {
    switch (req.body.action)
    {
        case 'login':
            usersModel.findOne({
                email: req.body.email.trim()
            }, async function(err, data) {
                if (data)
                {
                    try {        
                        if (await argon2.verify(data.password, req.body.password.trim())) {
                            res.json({
                                'login': data.login,
                                'user_id': data.id,
                                'token': generateAccessToken(req.body.email.trim())
                            });
                        }
                        else {
                            res.json({
                                'message': 'Password or Email was wrong'
                            })
                        }
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
                else {
                    res.json({
                        'message': 'Password or Email was wrong'
                    });
                }
            });
            break;
        case 'reg_user':
            let find_match = false;
            usersModel.findOne({
                email: req.body.email.trim()
            }, function(err, data) {
                if (data)
                {
                    res.json({
                        'message': 'Email already used'
                    });
                }
                else {
                    usersModel.findOne({
                        login: req.body.login.trim()
                    }, function(err2, data2) {
                        if (data2)
                        {
                            res.json({
                                'message': 'Login already used'
                            });
                        }
                        else {
                            hashPass(req.body.password.trim()).then(val => {
                                usersModel.create({
                                    login: req.body.login.trim(),
                                    email: req.body.email.trim(),
                                    password: val
                                }, function(err, data) {
                                    res.json({
                                        'user_id': data.id,
                                        'token' : generateAccessToken(req.body.email.trim())
                                    });
                                });
                            });
                        }
                    });
                }
            });
            break;
        case 'verify':
            res.json({
                'info': jwt.verify(req.body.token, process.env.TOKEN_SECRET, (err, user) => {
                    if (err)
                    {
                        return err;
                    }
                    return user;
                })
            })
            break;
        default:
            res.sendStatus(400);
            break;
    }
}