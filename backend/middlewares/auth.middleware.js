import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "dev-secret-key";

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                statusCode: 401,
                message: "Không tìm thấy Access Token hoặc sai định dạng.",
                content: null,
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, jwtSecret);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            statusCode: 401,
            message: "Token không hợp lệ hoặc đã hết hạn.",
            content: null,
        });
    }
};

export const checkAdmin = (req, res, next) => {
    if (!req.user || req.user.maLoaiNguoiDung !== "QuanTri") {
        return res.status(403).json({
            statusCode: 403,
            message: "Từ chối truy cập. Yêu cầu quyền QuanTri.",
            content: null,
        });
    }

    next();
};
