const loginM = (req,res,next)=>{
   console.log('login middle waer');
   
    next();
}

module.exports = loginM;