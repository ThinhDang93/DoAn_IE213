import express from 'express';
import cors from 'cors';

import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const app = express();

// Áp dụng middleware
app.use(cors());
app.use(express.json());

// Trình xử lý định tuyến dự phòng cho các endpoint không tồn tại (Lỗi 404)
app.use((req, res) => {
    res.status(404).json({
        statusCode: 404,
        message: "Endpoint not found",
        content: null
    });
});

export default app;