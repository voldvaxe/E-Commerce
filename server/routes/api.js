const router = require("express").Router();
const auth = require("../middleware/auth");
const authIsAdmin = require("../middleware/authIsAdmin");
const authIsNotAdmin = require("../middleware/authIsNotAdmin");
const upload = require("../middleware/image_uploading");
const adminCtrl = require("../controllers/adminCtrl");
const commentCtrl = require("../controllers/commentCtrl");
const categoryCtrl = require("../controllers/categoryCtrl");
const customerCtrl = require("../controllers/customerCtrl");
const paymentCtrl = require("../controllers/paymentCtrl");
const productCtrl = require("../controllers/productCtrl");

//admin Router

router.post("/admin/register", adminCtrl.register);

router.post("/admin/login", adminCtrl.login);

router.get("/admin/logout", adminCtrl.logout);

router.get("/admin/refresh_token", adminCtrl.refreshToken);

//category router

router
  .route("/category")
  .get(categoryCtrl.getCategories)
  .post(auth, authIsAdmin, upload.single("image"), categoryCtrl.createCategory);

router
  .route("/category/:id")
  .delete(auth, authIsAdmin, categoryCtrl.deleteCategory)
  .put(auth, authIsAdmin, upload.single("image"), categoryCtrl.updateCategory);

//comment router
router
  .route("/comment")
  .get(commentCtrl.getComments)
  .post(auth, authIsNotAdmin, commentCtrl.createComment);

//customer router
router.post(
  "/customer/register",
  upload.single("image"),
  customerCtrl.register
);

router.get("/customer/getInfo", auth, authIsNotAdmin, customerCtrl.getInfo);

router.post("/customer/login", customerCtrl.login);

router.get("/customer/logout", customerCtrl.logout);

router.get("/customer/refresh_token", customerCtrl.refreshToken);

//payment router

router.get("/pay", auth, authIsNotAdmin, paymentCtrl.pay);

router.get("/success", paymentCtrl.success);

router.get("/cancel", paymentCtrl.cancel);

//product router

router
  .route("/product")
  .get(productCtrl.getProducts)
  .post(
    auth,
    authIsAdmin,
    upload.array("images", 10),
    productCtrl.createProduct
  );

router
  .route("/product/:id")
  .post(auth, authIsNotAdmin, productCtrl.addProductToCart)
  .delete(auth, authIsAdmin, productCtrl.deleteProduct)
  .put(
    auth,
    authIsAdmin,
    upload.array("images", 10),
    productCtrl.updateProduct
  );

module.exports = router;
