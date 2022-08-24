// import library
const express = require('express')

// middleware jwt
const verifyToken = require('../middlewares/verifyToken');
const jwt_decode = require('jwt-decode');

// import use case
const order_uc = require('../usecase/order')


const order_const = require('../internal/constants/order')

// init router
const router = express.Router()

router.get('/', verifyToken , async (req, res) => {
    let token = req.headers["authorization"];
    let decoded = jwt_decode(token)
    let id = decoded;

    let res_data = {
        status: 'ok',
        message: 'success',
        data: null
    }
    res_data.data  = await order_uc.getPendingOrderByUserId(id)
    res.json(res_data)
})

router.post('/add',verifyToken, async (req, res) => {
    
    let token = req.headers["authorization"];
    let decoded = jwt_decode(token)
    let id = decoded;

    let items = req.body.items
    let order = await order_uc.getPendingOrderByUserId(id)

    let res_data = {
        status: 'failed',
        message: 'something went wrong',
        data: null
    }
    
    if(order === null) {
        let create_res = await order_uc.createOrder(id, items)
        if (create_res.is_success !== true) {
           return res.status(400).json(res_data)
        }
    } else {
        await order_uc.addOrderDetails(order.id, items)
    }
    order = await order_uc.getPendingOrderByUserId(id)

    res_data.status = 'ok'
    res_data.message = 'success'
    res_data.data = order

    res.json(res_data)
})

router.patch('/submit',verifyToken, async (req, res) => {
    // update order ststus
    let token = req.headers["authorization"];
    let decoded = jwt_decode(token)
    let id = decoded;

    let res_data = {
        status: 'failed',
        message: '',
    }
    let order_data = await order_uc.getPendingOrderByUserId(id);
    if(order_data === null) {
        res_data.message = 'order empty'
        return res.status(400).json(res_data);
    }

    // update status ke 
    await order_uc.changeOrderStatus(order_data.id, order_const.ORDER_SUBMITTED);

    res_data.status = 'ok'
    res_data.message = 'success'

    res.json(res_data)

})

module.exports = router