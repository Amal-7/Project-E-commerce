var express = require('express');
var router = express.Router();
const {home,loginPage,userLogin,userSignup,userLogout,userProfile,editProfile,logOtp,numVerify,otpVerify,
    forgotPassword,numVerifyReset,resetOtpVerify,resetPassword,product,
    products,addToCart,cart,changeProdQty,cartItemDlt,checkOut,placeOrder,myOrders,orderDetails,orderCancel,addAddress,newAddress,changeAddress,changeAddressTo} = require('../controller/userController');
const {user} = require('../controller/authentication');



/* GET home page. */
router.get('/', home);

/* user login */ 
router.route('/login')
    .get(loginPage)
    .post(userLogin);

/* user sign up */ 
router.post('/signup',userSignup);

/* user logout */ 
router.get('/logout',userLogout);

/* user profile */ 
router.get('/my-profile',user,userProfile);

router.post('/edit-profile',user,editProfile)

/* otp login */ 
router.route('/otp-login')
   .get(logOtp)
   .post(numVerify);

/* otp-verification*/    
router.post('/otp-verify',otpVerify);

/*forgot password*/ 
router.route('/forgot-password')
    .get(forgotPassword)
    .post(numVerifyReset);

/*otp verification forgot password*/ 
router.post('/forgot-otp-verify',resetOtpVerify);

/*reset password*/ 
router.post('/reset-password',resetPassword);

/*all products*/ 
router.get('/products',products);

/*single product */ 
router.get('/product/:id',product);

/*add to cart*/ 
router.get('/addToCart/:id',addToCart);

/* Cart Details*/ 
router.route('/cart')
    .get(user,cart)
    .patch(changeProdQty);

/*cart item delete*/ 
router.delete('/cartItemDlt/:id',user,cartItemDlt);

/*checkout*/ 
router.route('/checkout')
    .get(user,checkOut)
    .post(user,placeOrder);

/* order details*/ 
router.get('/my-orders',user,myOrders);
router.get('/order-details/:id',user,orderDetails);

/*cancel order*/ 
router.get('/cancel-order/:id',user,orderCancel);

/* Add new address*/ 
router.route('/new-address')
    .get(user,addAddress)
    .post(user,newAddress);

/* changing default address*/ 
router.get('/change-address',user,changeAddress)
router.get('/change-address-to/:id',user,changeAddressTo)











module.exports = router;
