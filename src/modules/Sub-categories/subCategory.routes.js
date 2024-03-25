import { Router } from "express";
const router = Router();
import * as subCategoryController from "./subCategory.controller.js";
import expressAsyncHandler from "express-async-handler";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { endPointsRoles } from "../Category/category.endpoints.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";

router.post(
  "/:categoryId",
  auth(endPointsRoles.ADD_CATEGORY),
  multerMiddleHost({
    extensions: allowedExtensions.image,
  }).single("image"),
  expressAsyncHandler(subCategoryController.addSubCategory)
);

//! assignment
//? get subcategory by id  localhost/category/:categoryId
router.get('/:subCategoryId', expressAsyncHandler(subCategoryController.getSubCategoryById))
//? delete subCategory localhost/subCategory/:subCategoryId
router.delete("/:subCategoryId", expressAsyncHandler(subCategoryController.deleteSubCategory));


export default router;
