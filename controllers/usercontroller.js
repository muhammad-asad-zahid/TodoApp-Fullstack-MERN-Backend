

const userGet = (req, res)=>{
    res.send('hello from user get')
}

const userlogin = (req,res)=>{
    res.send('hello form login user')
}

module.exports = {userGet , userlogin}