
import { Router } from "express";
import * as userController from './user.controller.js'
import expressAsyncHandler from "express-async-handler";
const router = Router();


//!assignment


//?=========================== Update User data ==============================
router.put('/updateAccount', expressAsyncHandler(userController.updateAccount));
//?=========================== Delete User Account ==============================
router.delete('/deleteAccount', expressAsyncHandler(userController.deleteAccount));
//?=========================== Get user profile data ==============================
router.get('/getUserData', expressAsyncHandler(userController.getUserData));
//?=========================== change password ==============================
router.put('/changePassword', expressAsyncHandler(userController.changePassword)) 




//?=========================== forget password ==============================
router.post('/forgetPassword', expressAsyncHandler(userController.forgetPassword));
//?============================ reset password ===============================
router.post('/resetPassword/:token', expressAsyncHandler(userController.resetPassword));







export default router;