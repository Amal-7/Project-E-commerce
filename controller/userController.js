var userHelper = require('../helpers/user-helpers');
var otp = require('../config/verfication');
const session = require('express-session');
const { response } = require('express');
const { womenProducts } = require('../helpers/user-helpers');
const client = require('twilio')(otp.accountId, otp.authToken);



module.exports = {
    home:async (req, res, next) => {

        let user = req.session.user
        let menProducts = await userHelper.menProducts()
        let womenProducts =await userHelper.womenProducts()
        if (user) {
            let cartCount =await userHelper.cartProdCount(user._id);
            res.render('index', { user, menProducts, womenProducts, cartCount })

        }
        else {
            res.render('index', { menProducts, womenProducts })
        }


    },
    loginPage: (req, res, next) => {
        if (req.session.userLoggedIn) {
            res.redirect('/');
        } else {
            res.render('user/login')
        }

    },
    userSignup: (req, res, next) => {
        if (req.session.userLoggedIn) {
            res.redirect('/');
        } else {
            userHelper.doSignup(req.body).then((userdata) => {
                let status = userdata.status

                if (status) {
                    let regUser = userdata.user
                    res.render('user/login', { regUser, forSignin: true })
                }
                else {
                    let user = userdata.user;
                    res.render('user/login', { user, forSignin: true })

                }

            })
        }
    },
    userLogin: (req, res, next) => {
        if (req.session.userLoggedIn) {
            res.redirect('/');
        } else {
            userHelper.doLogin(req.body).then((data) => {
                let status = data.status;
                if (status) {
                    req.session.userLoggedIn = true;
                    req.session.user = data.user

                    res.redirect('/')
                }
                else {
                    let blocked = data.blocked;
                    let errMsg = data.errMsg;
                    res.render('user/login', { errMsg, blocked })
                }
            })
        }
    },
    userLogout: (req, res, next) => {
        req.session.userLoggedIn = false;
        req.session.user = null
        res.redirect('/')
    },

    userProfile:async(req,res)=>{
        let user  = req.session.user
        let address =await userHelper.defaultAddress(user._id)
        res.render('user/myprofile',{user,address})
    },

    
    editProfile:(req,res)=>{
        let user = req.session.user
        userHelper.editProfile(req.body,user._id).then((response)=>{
            if(response.status){
                res.redirect('/my-profile')
            }else{
                let errorMsg =response.errorMsg
                console.log(errorMsg);
                res.render('user/myprofile',{errorMsg,user})

            }

        })
    }


    ,
    logOtp: (req, res, next) => {
        let status = req.session.userLoggedIn;
        if (status) {
            res.redirect('/')
        }
        else {
            let status = req.session.status
            res.render('user/otp-login', { status });

        }
    },
    numVerify: (req, res, next) => {
        if (req.session.userLoggedIn) {
            res.redirect('/');
        } else {
            userHelper.verifyNum(req.body).then((data) => {
                if (data.userNum) {
                    console.log(req.body.mobile)

                    req.session.mobile = req.body.mobile;
                    req.session.user = data.user
                    client.verify.services(otp.serviceId)
                        .verifications.create({
                            to: `+91${req.body.mobile}`,
                            channel: 'sms',
                        }).then((data) => {
                            res.render('user/otp-verify')
                        })
                } else {
                    req.session.status = data.status
                    res.redirect('/otp-login');
                }
            })
        }

    },
    otpVerify: (req, res, next) => {
        if (req.session.userLoggedIn) {
            res.redirect('/');
        } else {

            client.verify.services(otp.serviceId)
                .verificationChecks.create({
                    to: `+91${req.session.mobile}`,
                    code: req.body.otp
                }).then((data) => {
                    console.log(data)
                    if (data.valid) {
                        req.session.userLoggedIn = true;
                        res.redirect('/');
                    }
                    else {
                        let errMsg = 'Invalid OTP'
                        res.render('user/otp-verify', { errMsg })
                    }
                })

        }

    },
    forgotPassword:(req,res)=>{
        let status = req.session.userLoggedIn;
        if (status) {
            res.redirect('/')
        }
        else {
            let status = req.session.status
     
            res.render('user/forgot-password',{ status })

        }
    
    },

    numVerifyReset: (req, res, next) => {
        if (req.session.userLoggedIn) {
            res.redirect('/');
        } else {
            userHelper.verifyNum(req.body).then((data) => {
                if (data.userNum) {
                    console.log(req.body.mobile)

                    req.session.mobile = req.body.mobile;
                    req.session.user = data.user
                    client.verify.services(otp.serviceId)
                        .verifications.create({
                            to: `+91${req.body.mobile}`,
                            channel: 'sms',
                        }).then((data) => {
                            res.render('user/forgot-otp-verify')
                        })
                } else {
                    req.session.status = data.status
                    res.redirect('/forgot-password');
                }
            })
        }

    }
    ,

    resetOtpVerify: (req, res, next) => {
        if (req.session.userLoggedIn) {
            res.redirect('/');
        } else {

            client.verify.services(otp.serviceId)
                .verificationChecks.create({
                    to: `+91${req.session.mobile}`,
                    code: req.body.otp
                }).then((data) => {
                   
                    if (data.valid) {
                        
                        res.render('user/reset-password');
                    }
                    else {
                        let errMsg = 'Invalid OTP'
                        res.render('user/forgot-otp-verify', { errMsg })
                    }
                })

        }

    } ,

    resetPassword:(req,res)=>{
        userHelper.resetPassword(req.session.user._id,req.body).then((status)=>{
            console.log(response);
           let errorMsg = status
           res.render('user/login',{errorMsg})
        })
    } ,


    products:async(req, res) => {
        let user = req.session.user
        let products =await userHelper.getAllProducts()
        if(user){
            let cartCount =await userHelper.cartProdCount(user._id)

           
    
                res.render('user/allProducts', { user, products,cartCount })
           
        }else{
            res.render('user/allProducts', {  products})
        }
       
    },
    product:async (req, res) => {
        let cartCount;
        let user = req.session.user
        if(user){
         cartCount =await userHelper.cartProdCount(user._id)

        }

        userHelper.getProduct(req.params.id).then((product) => {
            res.render('user/product', { user, product,cartCount })
        })
    },
    addToCart: (req, res) => {
        userHelper.addToCart(req.params.id, req.session.user._id).then((product) => {
            res.json(product)
        })
    },
    cart: async(req, res) => {
        let user = req.session.user
        let cartCount =await userHelper.cartProdCount(user._id)
        let cartPrice =await userHelper.cartTotal(user._id)
        
        
        userHelper.cartData(user._id).then((cartItems) => {
            cartItems.cartPrice = cartPrice
           
        
            res.render('user/cart', { user, cartItems,cartCount})
        })
    },

    changeProdQty:(req,res)=>{
        userHelper.changeProdQty(req.body).then((response)=>{


            res.json(response)
        })
    }

    ,
    cartItemDlt: (req, res) => {
        let user = req.session.user
        userHelper.dltFromCart(user._id, req.params.id).then((response) => {
            res.redirect('/cart')
        })
    },
    checkOut:async(req,res)=>{
        let user = req.session.user
        let cartCount =await userHelper.cartProdCount(user._id)
        let cartPrice =await userHelper.cartTotal(user._id)
        
        let address = await userHelper.defaultAddress(user._id)
        console.log(address);
        if(cartPrice==0){
            res.redirect('/cart')
        }else{       
            userHelper.cartData(user._id).then((cartItems) => {
                cartItems.cartPrice = cartPrice       
                res.render('user/checkout', { user, cartItems,cartCount,address})
            })
       }
    },
    placeOrder:async(req,res)=>{
        let user = req.session.user
        let cartPrice =await userHelper.cartTotal(user._id)
        let products = await userHelper.cartProductList(user._id)
        userHelper.placeOrder(req.body,user._id,cartPrice,products.products).then((response)=>{
          let orderID = response.products.orderID
            res.render('user/order-confirmation',{user,cartPrice,orderID})
        })
       
    },
    myOrders:async(req,res)=>{
        let user = req.session.user
        userHelper.orders(user._id).then((orderList)=>{
            res.render('user/myorders',{user,orderList})
        })
    },
    orderDetails:async(req,res)=>{
        let user = req.session.user
        userHelper.orderDetails(req.params.id).then((orderData)=>{
         
          
            res.render('user/order-details',{user,orderData})
        })
    },
    orderCancel:(req,res)=>{
        let user = req.session.user
        let orderID = req.params._id
        userHelper.cancelOrder(req.params.id).then(()=>{
            res.redirect('/my-orders')
        })
    },

    addAddress:(req,res)=>{
        let user = req.session.user
        res.render('user/new-address',{user})
    },

    newAddress:(req,res)=>{
        userHelper.addNewAddress(req.body).then(()=>{
            res.redirect('/checkout')
        })
    }
    ,
    
    changeAddress:(req,res)=>{
        let user = req.session.user
        userHelper.userAddresses(user._id).then((addresses)=>{
        res.render('user/change-address',{user,addresses})

        })
    },

    changeAddressTo:(req,res)=>{
        let user =req.session.user
        userHelper.toDefaultAddress(user._id,req.params.id).then((response)=>{
            res.redirect('/checkout')
        })
    }
}
