const Listing = require("../models/listing");
const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res,next)=> {
    return res.render("./users/signup.ejs");
};

module.exports.signup =  async(req,res,next)=> {
    try{
        let { username , email , password } =  req.body;
        const newUser =  new User({email,username});
        const registeredUser  =  await User.register(newUser , password);
        console.log(registeredUser);
        
        // signup ke baad automatically login karne ke liye
        req.login(registeredUser,(err)=>{
            if(err) {
                return next(err);
            } 
            req.flash("sucess", "Welcome to Wanderlust!");
            return res.redirect("/listings");
        });
        
    } catch(e) {
        req.flash("error",e.message);
        return res.redirect("./signup");
    }
    // try and catch ki help se only error message show karne ke bajaye only alert flash hota hain error ka 
};

module.exports.renderLoginForm = (req,res) => {
    res.render("./users/login.ejs");
};

module.exports.login = async(req , res) => {
    req.flash("sucess" ,"Welcome to WanderLustyou are logged in !");
    let redirectUrl =  res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=> {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("sucess","you are Log Out now!");
        return res.redirect("/listings");
    });
};


