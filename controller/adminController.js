const layout = 'admin-layout';
const adminHelper = require('../helpers/admin-helpers');


module.exports = {
    adminLogin:(req,res,next)=>{
        if(req.session.adminLoggedIn){
            let status = req.session.adminLoggedIn;
            res.render('admin/index',{layout,status});
        }else{
            let logErr =req.session.logErr;
            res.render('admin/login',{layout,logErr});
            req.session.logErr=false;
        }
    },
    adminCheck:(req,res,next)=>{
        adminHelper.adminLogin(req.body).then((data)=>{
            let status = data.status;
            let adminData = data.user;
            if(status){
                req.session.adminLoggedIn = true;
                req.session.admin = adminData;
                res.redirect('/admin');
            }
            else{
                let logErr = 'Please enter a valid email id/password'
                req.session.logErr=logErr
                res.redirect('/admin')
            }
        })
    },
    adminLogout:(req,res,next)=>{
        req.session.adminLoggedIn=false
        req.session.admin = null
        res.redirect('/admin')
    },
    viewUser:(req,res,next)=>{
        let status = req.session.adminLoggedIn;
        if(status){
            adminHelper.getUsers().then((users)=>{
                
                res.render('admin/view-user',{layout,status,users});
            })
            
        }else{
            res.redirect('/admin')
        }
        
    },
    userStatus:(req,res,next)=>{
        let userId = req.params.id       
        adminHelper.userStatus(userId).then((user)=>{
            res.redirect('/admin/view-users')
        })
    },
    viewCategory:(req,res,next)=>{
        let status = req.session.adminLoggedIn;
        if(status){
            adminHelper.viewCateg().then((categories)=>{
                res.render('admin/product-category',{layout,status,categories})
            })
        }
        else{
            res.redirect('/admin')
        }
       
    },
    createCategory:(req,res,next)=>{
        adminHelper.addCategory(req.body).then((category)=>{
            res.redirect('/admin/category')
        })
    },
    editCategory:(req,res,next)=>{
        let status = req.session.adminLoggedIn;
        if(status){
        let categId = req.params.id;
        adminHelper.categoryEdit(categId).then((category)=>{
           res.render('admin/edit-category',{layout,status,category})
        })
       }else{
        res.redirect('/admin')
       }
    },
    deleteCategory:(req,res,next)=>{
        let categId = req.params.id;
        console.log(categId)
        adminHelper.categoryDelete(categId).then((response)=>{
            res.redirect('/admin/category')
        })
    },
    categoryEdit:(req,res,next)=>{
        let data = req.body;
        adminHelper.editCategory(data).then((response)=>{
            res.redirect('/admin/category')
        })
    },
    viewProducts:(req,res,next)=>{
        let status = req.session.adminLoggedIn;
        if(status){
            adminHelper.getProducts().then((products)=>{
            res.render('admin/products',{layout,status,products})

            })

        }
        else{
            res.redirect('/admin')
        }
    },
    newProduct:(req,res,next)=>{
        let status = req.session.adminLoggedIn;
        if(status){
            adminHelper.viewCateg().then((categories)=>{
                res.render('admin/add-product',{layout,status,categories})
            })
        }
        else{
            res.redirect('/admin')
        }
    },
    addProduct:(req,res,next)=>{
        let status = req.session.adminLoggedIn;
        if(status){
            const files = req.files
            console.log(files);
            const fileName = files.map((file)=>{
                return file.filename
            })
            let productData = req.body
            productData.price= parseInt(productData.price);
            productData.quantity = parseInt(productData.quantity);
            console.log(req.body);
            productData.productImages = fileName

            adminHelper.addProduct(productData).then((result)=>{
            res.redirect('/admin/products');

            });
        }
        else{
            res.redirect('/admin')
        }
    },
    deleteProduct:(req,res,next)=>{
        let status = req.session.adminLoggedIn;
        if(status){
            adminHelper.deleteProduct(req.params.id).then((response)=>{
                res.redirect('/admin/products');
            })

        }else{
            res.redirect('/admin')
        }
    },
    getProduct:(req,res,next)=>{
        let status = req.session.adminLoggedIn;
        if(status){
            adminHelper.productDetails(req.params.id).then((product)=>{
                adminHelper.viewCateg().then((categories)=>{
                    res.render('admin/edit-product',{layout,status,product,categories});
                })
                
            })

        }else{
            res.redirect('/admin')
        }
    },
    editProduct:(req,res,next)=>{   
       
      let data = req.body
      data.price =parseInt(data.price)
      data.quantity = parseInt(data.quantity)
     let img = req.files
      
      adminHelper.updateProduct(data,img).then((response)=>{
        res.redirect('/admin/products')
    })
          
    },
    getOrders:(req,res)=>{
        let status =req.session.adminLoggedIn
        adminHelper.orderList().then((orderList)=>{
           
            res.render('admin/orders',{layout,status,orderList})
        })
    },
     
    orderDetails:(req,res)=>{
        let status = req.session.adminLoggedIn
        adminHelper.orderDetails(req.params.id).then((order)=>{
           res.render('admin/order-details',{layout,order,status})
        })
    },

    changeStatus:(req,res)=>{
        let status = req.session.adminLoggedIn
      
        adminHelper.orderStatusChange(req.params.id,req.body.status).then((response)=>{
            res.redirect('/admin/orders')
        })
    }


    
}