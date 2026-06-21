const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(401).json({ message: 'رقم الهاتف أو كلمة المرور غير صحيحة' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'رقم الهاتف أو كلمة المرور غير صحيحة' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ message: 'رقم الهاتف مسجل مسبقاً' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      role: 'employee'
    });

    res.status(201).json({
      message: 'تم إنشاء حساب الموظف بنجاح',
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
};

const setupOwner = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    
    // Check if phone number is already registered
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ message: 'رقم الهاتف مسجل مسبقاً' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOwner = await User.create({
      name,
      phone,
      password: hashedPassword,
      role: 'owner'
    });

    res.status(201).json({ message: 'تم إنشاء حساب المالك بنجاح', user: newOwner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
};

module.exports = {
  login,
  createEmployee,
  setupOwner
};
