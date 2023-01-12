module.exports ={
    admin:(req,res,next)=>{
        if(req.session.adminLoggedIn){
            next()
        }else{
            res.redirect('/admin')
        }
    },
    user:(req,res,next)=>{
        if(req.session.userLoggedIn){
            next()
        }else{
            res.redirect('/')
        }
    }
}