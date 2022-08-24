const orderConstants = require('../internal/constants/order')
const item_uc = require('../usecase/item')
const {Order,Orderdetail} = require('../models')
const Op = require("sequelize").Op;

let getPendingOrderByUserId = async (user_id) => {
    let order = null;
    try {
        order = await Order.findOne({
            where: {
                user_id: user_id,
                status: orderConstants.ORDER_PENDING
            }
        });
    } catch (e) {
        console.log(e);
    }
    if(order === null) {
        return order;
    }
    return {
        ...order.dataValues,
        details: await getDetailOrder(order.id)
    };
}

let getDetailOrder = async (order_id) => {
    let details = [];
    try {
        details = await Orderdetail.findAll({
            where: {order_id: order_id}
        });
    } catch (e) {
        console.log(e);
    }
    return details;
}

let createOrder = async (user_id, items) => {
    let is_success = false
    let order = {
        user_id: user_id,
        status: orderConstants.ORDER_PENDING
    }
    let res_order = null
    try {
        res_order = await Order.create(order)
        is_success = true
    } catch (e) {
        console.log(e)
    }
    order = await getPendingOrderByUserId(user_id)
    await addOrderDetails(order.id, items)
    return {
        is_success: is_success,
        order: order
    }
}

let addOrderDetails =  async (order_id, items) => {
    for (let i = 0; i < items.length; i++) {
        if (items[i].qty <= 0) {
            continue;
        }
        let item = null;
        item = await item_uc.getItemById(items[i].id);
        if (item !== null) {
            let detail = {
                order_id: order_id,
                item_id: item.id,
                qty: items[i].qty
            }
            try{
                await Orderdetail.create(detail);
            } catch (e) {
                console.log(e);
            }
        }
    }
}

let changeOrderStatus = async (order_id, status) => {
    await Order.update({
        status: status
    }, {
        where: {id: order_id}
    }) 
}

let listOrderExPending = async () => {
    let orders = await Order.findAll({
        where: {
            [Op.and]: [
                {
                    status: {
                        [Op.ne]: orderConstants.ORDER_PENDING
                    }
                },
                {
                    status: {
                        [Op.ne]: orderConstants.ORDER_COMPLETED
                    }
                }
            ]
        }
    })

    if (orders === null) {
        return []
    }

    return orders
}

let listOrderComplete = async () => {
    let orders = await Order.findAll({
        where: {
            [Op.or]: [
                {
                    status: orderConstants.ORDER_COMPLETED
                },
                {
                    status: orderConstants.ORDER_CANCELED
                },
            ]
        }
    })

    if (orders === null) {
        return []
    }

    return orders
}



module.exports =  {
    getPendingOrderByUserId: getPendingOrderByUserId,
    getDetailOrder: getDetailOrder,
    createOrder: createOrder,
    addOrderDetails : addOrderDetails,
    changeOrderStatus : changeOrderStatus,
    listOrderExPending : listOrderExPending,
    listOrderComplete: listOrderComplete  
}
