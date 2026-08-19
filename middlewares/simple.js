const simplehello = (req, res, next)=>{
     console.log('hello fro middlewear');
     next();
}

module.exports = simplehello;