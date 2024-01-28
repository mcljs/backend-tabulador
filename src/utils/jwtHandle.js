import jwt from 'jsonwebtoken';

const secret = 'secret';

export function jwtSing(payload) {
  return jwt.sign(payload, secret, {
    expiresIn: '24h',
  });
}

export function jwtVerify(token) {
  return jwt.verify(token, secret);
}

export function verifyHandle(req, res, next) {
  let token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.headers['authorization'] ||
    req.headers['Authorization'];

    try {
    token= token.split(' ')[1]

  
    
    const decoded = jwt.verify(token, secret);    
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
}