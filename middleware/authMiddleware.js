const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.protect = async (req, res, next) => {
    let token;

    // 1. Headerda token bormi? (Authorization: Bearer kjsdhkjsdh...)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // "Bearer " so'zini olib tashlab, tokenni o'zini olamiz
            token = req.headers.authorization.split(' ')[1];

            // 2. Tokenni tekshiramiz (bizning JWT_SECRET bilan shifrlanganmi?)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Adminni bazadan topamiz va req.user ga biriktiramiz
            req.user = await Admin.findById(decoded.id).select('-password');

            next(); // O'tkazib yuboramiz
        } catch (error) {
            console.error(error);
            return res.status(401).json({ success: false, message: "Token noto'g'ri, ruxsat yo'q!" });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Token yo'q, ruxsat etilmagan!" });
    }
};