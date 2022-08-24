// Controller untuk Admin

// import library
const express = require('express');
const jwt_decode = require('jwt-decode');
const orderConstants = require('../internal/constants/order')

// middleware jwt
const verifyToken = require('../middlewares/verifyToken');

// import use case
const order_uc = require('../usecase/order');
const item_uc = require('../usecase/item')

// init router
const router = express.Router();

// menambah item
router.post('/item/add', verifyToken, async (req, res, next) => {
    let token = req.headers["authorization"];
    if(!token) {
        res.status(401).send("you must log in first ");
        return;        
    }
    let decoded = jwt_decode(token)
    let id = decoded;
    // cek hanya admin yg bisa menambah item
    if (id !== 1) {
        res.status(401).send("Acces Denied");
        return; 
    }

    let item = req.body
    let res_data = {
        status: 'failed',
        message: '',
        data: null
    }
    
    // cek item yg sudahh ada
    let item_res = await item_uc.getItemByName(item.name)
    if (item_res !== null) {
        res_data.message = 'item already exist'
        return res.status(400).json(res_data)
    }

    // masukan data item
    let create_res = await item_uc.createItem(item)
    if(create_res.is_success !== true) {
        res_data.message = 'something went wrong'
        return res.status(400).json(res_data)
    }
    res_data.status = 'ok'
    res_data.message = 'success'
    res_data.data = create_res.item

    res.json(res_data)
})

// mengubah item
router.put('/item/update/:id', async function (req, res) {
    let token = req.headers["authorization"];
    if(!token) {
        res.status(401).send("you must log in first ");
        return;        
    }
    let decoded = jwt_decode(token)
    let id_user = decoded;
    // cek hanya admin yg bisa merubah item
    if (id_user !== 1) {
        res.status(401).send("Acces Denied");
        return; 
    }

    let id = parseInt(req.params['id']);
    let item = req.body

    let res_data = {
        status: 'failed',
        message: '',
        data: null
    }
    
    if (id !== item.id) {
        res.status(400).send("Item not found");
        return;
    }
    let update_res = await item_uc.updateItem(item, id)
    res_data.status = 'ok'
    res_data.message = 'success'
    res_data.data = update_res.item

    res.json(res_data)
})

// menghapus items
router.delete('/item/delete/:id', function (req, res) {
    let token = req.headers["authorization"];
    if(!token) {
        res.status(401).send("you must log in first ");
        return;        
    }
    let decoded = jwt_decode(token)
    let id_user = decoded;
    // cek hanya admin yg bisa merubah item
    if (id_user !== 1) {
        res.status(401).send("Acces Denied");
        return; 
    }

    let id = parseInt(req.params['id'])

    let res_data = {
        status: 'failed',
        message: '',
        data: null
    }
    
    let delete_res = item_uc.deleteItem(id)

    res_data.status = 'ok'
    res_data.message = 'success'
    res_data.data = delete_res.item
    
    res.json(res_data)
})


// melihat order 
router.get('/order', async (req, res) => {
    let token = req.headers["authorization"];
    if(!token) {
        res.status(401).send("you must log in first ");
        return;        
    }
    let decoded = jwt_decode(token)
    let id = decoded;

    // cek hanya admin 
    if (id !== 1) {
        res.status(401).send("Acces Denied");
        return; 
    }

    let res_data = {
        status: 'ok',
        message: 'success',
        data: null
    }
    if (req.query['status'] === 'completed') {
        res_data.data = await order_uc.listOrderComplete()
    } else {
        res_data.data = await order_uc.listOrderExPending()
    }
    res.json(res_data)
})


//  mengubah status order
router.patch('/order/update', async (req, res) => {
    let token = req.headers["authorization"];
    if(!token) {
        res.status(401).send("you must log in first ");
        return;        
    }
    let decoded = jwt_decode(token)
    let id = decoded;

    // cek hanya admin 
    if (id !== 1) {
        res.status(401).send("Acces Denied");
        return; 
    }

    let res_data = {
        status: 'ok',
        message: 'success',
        data: null
    }

    let order_id = req.body.id
    let status = orderConstants[req.body.status]
    if (status === undefined) {
        res_data.status = 'failed'
        res_data.message = 'invalid status'
        return res.status(400).json(res_data)
    } 
    await order_uc.changeOrderStatus(order_id, status)
    res.json(res_data)
})


module.exports = router