import { Router } from 'express'
const router = Router()

import * as orderController from './order.controller.js'
import { auth } from '../../middlewares/auth.middleware.js'
import { systemRoles } from '../../utils/system-roles.js'
import expressAsyncHandler from 'express-async-handler'

router.post('/',
 auth([systemRoles.USER]), 
 expressAsyncHandler(orderController.createOrder))

 router.post('/fromCartToOrder',
 auth([systemRoles.USER]), 
 expressAsyncHandler(orderController.convertFromCartToOrder))


router.put('/:orderId',
    auth([systemRoles.DELIEVER_ROLE]), 
    expressAsyncHandler(orderController.deliverOrder))


router.post('/pay/:orderId',
        auth([systemRoles.USER]),
        expressAsyncHandler(orderController.payOrderWithStripe))

router.post('/webhook' , expressAsyncHandler(orderController.stripeWebHookLocal))


router.post('/refund/:orderId',
        expressAsyncHandler(orderController.refundOrder))


export default router