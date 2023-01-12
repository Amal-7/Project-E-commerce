var express = require('express');
var router = express.Router();
const adminController = require('../controller/adminController');
const multer = require('multer');
const auth = require('../controller/authentication')

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    
    cb(null,'./public/product-images')
  },
  filename:(req,file,cb)=>{
    console.log(file);
    cb(null,Date.now()+ '-'+Math.round(Math.random()*1E9)+'.jpg')
  }

})

//multer set up
const upload = multer({storage:storage})

/* GET users listing. */
router.get('/', adminController.adminLogin);
router.post('/login',adminController.adminCheck);
router.get('/logout',adminController.adminLogout);
router.get('/view-users',adminController.viewUser);
router.get('/user-status/:id',adminController.userStatus);
router.get('/category',adminController.viewCategory);
router.post('/create-category',adminController.createCategory);
router.get('/edit-category/:id',adminController.editCategory);
router.get('/delete-category/:id',adminController.deleteCategory);
router.post('/edit-category',adminController.categoryEdit);
router.get('/products',adminController.viewProducts);
router.get('/add-product',adminController.newProduct);
router.post('/add-product',upload.array('images',4),adminController.addProduct);
router.get('/delete-product/:id',adminController.deleteProduct);
router.get('/edit-product/:id',adminController.getProduct);
router.post('/edit-product',upload.fields([
  {name:'image0',maxCount:1},
  {name:'image1',maxCount:1},
  {name:'image2',maxCount:1},
  {name:'image3',maxCount:1},

]),auth.admin,adminController.editProduct);

router.get('/orders',auth.admin,adminController.getOrders);
router.get('/order-details/:id',auth.admin,adminController.orderDetails);
router.post('/change-status/:id',auth.admin,adminController.changeStatus);








module.exports = router;
