const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // /api 表示代理路径
  // target 表示目标服务器的地址
  app.use(
    "/localback",
    createProxyMiddleware({
      target: "http://47.101.143.43",
      // 跨域时一般都设置该值 为 true
      changeOrigin: true,
      pathRewrite: {
        "^/localback": "",
      },
    })
  );
};
