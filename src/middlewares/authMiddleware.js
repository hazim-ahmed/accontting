const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'غير مصرح لك، التوكن غير صالح' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'غير مصرح لك، لم يتم إرسال توكن' });
  }
};

const ownerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    res.status(403).json({ message: 'صلاحيات المالك مطلوبة' });
  }
};

module.exports = { protect, ownerOnly };
