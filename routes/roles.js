var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');
let userModel = require('../schemas/users');

// R - GET all roles (exclude soft-deleted)
router.get('/', async function (req, res, next) {
    try {
        let data = await roleModel.find({ isDeleted: false });
        res.send(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// R - GET role by ID
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findOne({ _id: id, isDeleted: false });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send("Role not found");
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// C - CREATE new role
router.post('/', async function (req, res, next) {
    try {
        let newRole = new roleModel({
            name: req.body.name,
            description: req.body.description
        });
        console.log(newRole);
        await newRole.save();
        res.status(201).send(newRole);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// U - UPDATE role by ID
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (result) {
            res.send(result);
        } else {
            res.status(404).send("Role not found");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// D - SOFT DELETE role by ID
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (result) {
            res.send(result);
        } else {
            res.status(404).send("Role not found");
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// GET all users belong to a role
router.get('/:id/users', async function (req, res, next) {
    try {
        let id = req.params.id;

        // Kiểm tra role có tồn tại không
        let role = await roleModel.findOne({ _id: id, isDeleted: false });
        if (!role) {
            return res.status(404).send("Role not found");
        }

        // Lấy tất cả user có role = id và chưa bị xóa
        let users = await userModel.find({ role: id, isDeleted: false })
            .populate({
                path: 'role',
                select: 'name description'
            });

        res.send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;

