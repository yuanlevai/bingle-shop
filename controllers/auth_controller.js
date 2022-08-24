// import library
const express = require('express')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const salt = 'rahasia';

// import use case
const user_uc = require('../usecase/user')

const router = express.Router()

// router untuk login
router.post('/login', async (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let res_data = {
        status: 'failed',
        message: 'incorrect username or password',
        data: null,
    }
    // dapatkan data username
    let user = await user_uc.getUserByUsername(username)
    if(user === null) {
        return res.status(400).json(res_data)
    }
    // cek password
    if(bcrypt.compareSync(password, user.password) !== true) {
        return res.status(400).json(res_data)
    }

    res_data.status = 'ok'
    res_data.message = 'success'
    res_data.data = user

    // return res.json(res_data);
    // return token jwt 
    const jwtToken = jwt.sign(res_data.data.id, salt);

    return res.json({
        token: jwtToken}); 

})

router.post('/register', async (req, res) => {
    let user = {
        name: req.body.name,
        username: req.body.username,
        is_admin: false
    }
    let password = bcrypt.hashSync(req.body.password, 10)
    let res_data = {
        status: 'failed',
        message: '',
        data: null
    }
    // cek username
    let user_res = await user_uc.getUserByUsername(user.username)
    if (user_res !== null) {
        res_data.message = 'username already exist'
        return res.status(400).json(res_data)
    }
    // insert data user
    user.password = password
    let create_res = await user_uc.createUser(user)
    if(create_res.is_success !== true) {
        res_data.message = 'something wrong'
        return res.status(400).json(res_data)
    }

    res_data.status = 'ok'
    res_data.message = 'success'
    res_data.data = create_res.user

    res.json(res_data)
})

module.exports = router
