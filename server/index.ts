import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Middleware لبيانات الـ JSON
app.use(express.json());

// إعداد المسارات الثابتة (فقط للتطوير المحلي، Vercel سيتولى الملفات الثابتة عبر الـ Rewrites)
const staticPath = path.resolve(__dirname, "public");
if (process.env.NODE_ENV !== "production") {
  app.use(express.static(staticPath));
}

// مثال لمسار API (يمكنك إضافة مساراتك هنا)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// في بيئة Vercel، يتم التعامل مع الملفات الثابتة عبر vercel.json
// ولكن سنبقي على هذا المسار كاحتياط للتطوير المحلي
app.get("*", (_req, res) => {
  if (process.env.NODE_ENV !== "production") {
    res.sendFile(path.join(staticPath, "index.html"));
  } else {
    // في Vercel، إذا وصل الطلب إلى هنا ولم يكن API، سنتركه للـ Rewrites
    res.status(404).send("Not Found");
  }
});

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

export default app;
