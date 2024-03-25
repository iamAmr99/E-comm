import SubCategory from "../../../DB/Models/sub-category.model.js";
import Category from "../../../DB/Models/category.model.js";
import generateUniqueString from "../../utils/generate-Unique-String.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import slugify from "slugify";

//============================== add SubCategory ==============================//
export const addSubCategory = async (req, res, next) => {
  // 1- destructuring the request body
  const { name } = req.body;
  const { categoryId } = req.params;
  const { _id } = req.authUser;

  // 2- check if the subcategory name is already exist
  const isNameDuplicated = await SubCategory.findOne({ name });
  if (isNameDuplicated) {
    return next({ cause: 409, message: "SubCategory name is already exist" });
    // return next( new Error('Category name is already exist' , {cause:409}) )
  }

  // 3- check if the category is exist by using categoryId
  const category = await Category.findById(categoryId);
  if (!category) return next({ cause: 404, message: "Category not found" });

  // 4- generate the slug
  const slug = slugify(name, "-");

  // 5- upload image to cloudinary
  if (!req.file) return next({ cause: 400, message: "Image is required" });

  const folderId = generateUniqueString(4);
  const { secure_url, public_id } =
    await cloudinaryConnection().uploader.upload(req.file.path, {
      folder: `${process.env.MAIN_FOLDER}/Categories/${category.folderId}/SubCategories/${folderId}`,
    });

  // 6- generate the subCategory object
  const subCategory = {
    name,
    slug,
    Image: { secure_url, public_id },
    folderId,
    addedBy: _id,
    categoryId,
  };
  // 7- create the subCategory
  const subCategoryCreated = await SubCategory.create(subCategory);
  res
    .status(201)
    .json({
      success: true,
      message: "subCategory created successfully",
      data: subCategoryCreated,
    });
};

//!==================================== assignment ====================================

//?===================================== Get subCategory by id ====================================

export const getSubCategoryById = async (req, res, next) => {
  const { subCategoryId } = req.params;

  const subCategory = await SubCategory.findById(subCategoryId);

  if (!subCategory) {
    return res.status(404).json({
      success: false,
      message: 'SubCategory not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'SubCategory found',
    data: subCategory,
  });
};
//?===================================== delete subCategory ====================================

export const deleteSubCategory = async (req, res, next) => {
  const { subCategoryId } = req.params;

  // 1- check if the subCategory is exist by using subCategoryId
  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory)
    return next({ cause: 404, message: "SubCategory not found" });

  // 2- delete the subCategory
  await subCategory.deleteOne();

  // 3- delete cloudinary subcategory folder
  await cloudinaryConnection().api.delete_folder(
    `${process.env.MAIN_FOLDER}/Categories/${subCategory.categoryId}/SubCategories/${subCategory.folderId}`
  );

  res
    .status(200)
    .json({ success: true, message: "SubCategory deleted successfully" });
};
