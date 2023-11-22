const jwt = require('jsonwebtoken');

const JWT_SECRET = "dFD88qIdFQ8AypcEj1VSeoEEC+t5rccNFY1h2v3RRQSjATKccq1GpApFG1Rm1krf01HogjYMh6m384ZOn6eGuQ=="

const requestMiddleware = (req,res,next) => {
    console.log(`
        PATH::${req.path} 
        BODY::${JSON.stringify(req.body)}`);
    next();
}

const checkPerson = (req,res,next) => {
    if(req.body.person != 'bipul'){
        return res.status(401).json({message: 'You are not authorized'})
    }
    req.person = 'bipul';
    next();
}

const validateToken = (req,res,next) => {
    const header = req.headers.authorization 
    // check token and startsWith
    if(!header || !header.startsWith('Bearer ')){
        return res.status(403).send('No token')
    }
    // split with space
    const token = header.split(' ')[1];
    // check if there is token or not
    if(!token){
        return res.status(403).send('No token available')
    }
    // verify and next
    try {
        const decodedToken = jwt.verify(token,JWT_SECRET);
        req.user = decodedToken.username
        req.token = token
        next();
    } catch (error) {
        res.status(401).send('Invalid token')
    }
}

module.exports = {requestMiddleware, checkPerson,validateToken};