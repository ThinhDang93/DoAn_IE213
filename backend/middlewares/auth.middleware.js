import jwt from 'jsonwebtoken';

// Middleware xác thực Token
export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                statusCode: 401,
                message: "Không tìm thấy Access Token hoặc sai định dạng.",
                content: null
            });
        }

        const token = authHeader.split(' ')[1];
        
        // Giải mã và xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gắn thông tin payload vào request để các Controller phía sau sử dụng
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            statusCode: 401,
            message: "Token không hợp lệ hoặc đã hết hạn.",
            content: null
        });
    }
};

// Middleware kiểm tra quyền Quản Trị
export const checkAdmin = (req, res, next) => {
    // Yêu cầu middleware verifyToken phải được chạy trước để có req.user
    if (!req.user || req.user.maLoaiNguoiDung !== 'QuanTri') {
        return res.status(403).json({
            statusCode: 403,
            message: "Từ chối truy cập. Yêu cầu quyền QuanTri.",
            content: null
        });
    }
    next();
};