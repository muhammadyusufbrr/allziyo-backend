const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Admin yaratish (Bir marta ishlatiladi yoki Postman orqali)
exports.register = async (req, res) => {
    const { username, password } = req.body;

    // Parolni shifrlash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
        username,
        password: hashedPassword
    });

    res.status(201).json({ success: true, message: "Admin yaratildi" });
};

// 2. Tizimga kirish (Login)
exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Adminni topish
    const admin = await Admin.findOne({ username });
    if (!admin) {
        return res.status(400).json({ success: false, message: "Login yoki parol xato" });
    }

    // Parolni tekshirish
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: "Login yoki parol xato" });
    }

    // Token yaratish (Admin Panel shu token bilan ishlaydi)
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '1d'
    });

    res.status(200).json({ success: true, token, admin: { username: admin.username } });
};