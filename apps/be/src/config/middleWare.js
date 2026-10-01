const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const cookieParser = require("cookie-parser");


const allowedOrigins = [
  "https://smart-restaurant.id.vn",
  "https://d1qu7ng7kw13po.cloudfront.net",
  "https://final-project-smart-restaurant.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const setUpMiddleWare = (app) => {
   app.use(
  cors({
    origin: (origin, cb) => {
      // Tạm thời cho phép tất cả các domain/IP để không bị chặn CORS
      return cb(null, true);
    },
    credentials: true,
  })
);
    app.use(express.json()); // Đọc dữ liệu JSON gửi lên
    app.use(morgan('dev')); // Log request
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true })); // Giúp hiểu Form data (nếu cần)
}

module.exports = setUpMiddleWare;