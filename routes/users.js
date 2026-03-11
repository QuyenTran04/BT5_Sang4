var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');


router.get('/', async function (req, res, next) {
    try {
        let queries = req.query;
        let usernameQ = queries.username ? queries.username : '';

        let data = await userModel.find({
            isDeleted: false,
            username: new RegExp(usernameQ, 'i')
        }).populate({
            path: 'role',
            select: 'name description'
        });

        res.send(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// R - GET user by ID
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findOne({ _id: id, isDeleted: false })
            .populate({
                path: 'role',
                select: 'name description'
            });

        if (result) {
            res.send(result);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// C - CREATE new user
router.post('/', async function (req, res, next) {
    try {
        let newUser = new userModel({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            status: req.body.status,
            role: req.body.role,
            loginCount: req.body.loginCount
        });
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// U - UPDATE user by ID
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (result) {
            res.send(result);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// D - SOFT DELETE user by ID
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (result) {
            res.send(result);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
});


router.post('/enable', async function (req, res, next) {
    try {
        let { email, username } = req.body;

        let result = await userModel.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: true },
            { new: true }
        );

        if (result) {
            res.send(result);
        } else {
            res.status(404).send("User not found or information is incorrect");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/disable', async function (req, res, next) {
    try {
        let { email, username } = req.body;

        let result = await userModel.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: false },
            { new: true }
        );

        if (result) {
            res.send(result);
        } else {
            res.status(404).send("User not found or information is incorrect");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;


