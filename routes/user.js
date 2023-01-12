var express = require('express');
var router = express.Router();
const userController = require('../controller/userController');
const auth = require('../controller/authentication');
const userHelpers = require('../helpers/user-helpers');


/* GET home page. */
router.get('/', userController.home);
router.get('/login',userController.loginPage);
router.post('/signup',userController.userSignup);
router.post('/login',userController.userLogin);
router.get('/logout',userController.userLogout);
router.get('/my-profile',auth.user,userController.userProfile);

router.post('/edit-profile',auth.user,userController.editProfile)
router.get('/otp-login',userController.logOtp);
router.post('/otp-login',userController.numVerify);
router.post('/otp-verify',userController.otpVerify);
router.get('/forgot-password',userController.forgotPassword);
router.post('/forgot-password',userController.numVerifyReset);
router.post('/forgot-otp-verify',userController.resetOtpVerify);
router.post('/reset-password',userController.resetPassword);


router.get('/products',userController.products);
router.get('/product/:id',userController.product);
router.get('/addToCart/:id',userController.addToCart);
router.get('/cart',auth.user,userController.cart);
router.post('/change-product-qty',userController.changeProdQty);
router.get('/cartItemDlt/:id',auth.user,userController.cartItemDlt);
router.get('/checkout',auth.user,userController.checkOut);
router.post('/checkout',auth.user,userController.placeOrder);
router.get('/my-orders',auth.user,userController.myOrders);
router.get('/order-details/:id',auth.user,userController.orderDetails);
router.get('/cancel-order/:id',auth.user,userController.orderCancel);
router.get('/new-address',auth.user,userController.addAddress)
router.post('/add-address',auth.user,userController.newAddress)
router.get('/change-address',auth.user,userController.changeAddress)
router.get('/change-address-to/:id',auth.user,userController.changeAddressTo)











module.exports = router;
