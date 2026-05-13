# Quá trình thiết lập Frontend (Project Setup Workflow)

Tài liệu này ghi chú lại toàn bộ các bước đã thực hiện để thiết lập dự án React/Vite từ đầu, cấu hình Tailwind CSS, tích hợp Shadcn/UI và xây dựng bộ khung Layout cơ bản.

## 1. Khởi tạo dự án
- **Lệnh thực hiện:** `npx create-vite@latest frontend --template react`
- **Mô tả:** Tạo một dự án ReactJS (Javascript) sử dụng trình đóng gói Vite để tối ưu tốc độ build.
- **Lệnh dọn dẹp:** Xóa `App.css` mặc định, làm sạch `index.css`, xóa nội dung mặc định trong `App.jsx`.

## 2. Thiết lập kiến trúc thư mục
Đã tạo cấu trúc thư mục rỗng có tính mở rộng cao bên trong thư mục `src/`:
- `assets/` (Chứa hình ảnh, biểu tượng tĩnh)
- `components/` (Chứa các thành phần UI chung và bố cục)
  - `common/`
  - `layout/`
  - `ui/` (Khu vực dành riêng cho Shadcn/ui)
- `config/`, `constants/`, `context/`, `hooks/`, `services/`, `utils/`
- `pages/` (Chứa các trang chính của ứng dụng)
- `routes/`, `store/`, `types/`

## 3. Cấu hình Absolute Path (Alias)
Để Import component dễ dàng hơn với cú pháp `@/...` thay vì `../../../`:
- Tạo file `jsconfig.json` định nghĩa `baseUrl: "."` và `paths: {"@/*": ["./src/*"]}`.
- Cập nhật `vite.config.js` thêm module `path` và trường `resolve.alias`.

## 4. Tích hợp Tailwind CSS
- **Lệnh cài đặt:** `npm install -D tailwindcss@3 postcss@8 autoprefixer@10`
- **Khởi tạo:** `npx tailwindcss init -p` (Tạo `tailwind.config.js` và `postcss.config.js`).
- Cập nhật `index.css`: Thêm các directives `@tailwind base; @tailwind components; @tailwind utilities;`.

## 5. Cài đặt Shadcn/UI & Các thư viện hỗ trợ
- Khởi tạo Shadcn/UI bằng lệnh: `npx shadcn@latest init` (Điều này tự động thêm CSS variables vào `index.css` và `components.json`).
- Cài đặt các Component UI cần thiết từ Shadcn (dựa trên phân tích thiết kế Figma):
  ```bash
  npx shadcn@latest add button input card badge progress table tabs slider form label select checkbox
  ```
- Cài đặt thêm thư viện `lucide-react` để hiển thị Icon.

## 6. Cấu hình Điều hướng (Routing)
- **Lệnh cài đặt:** `npm install react-router-dom`
- Mục đích: Xử lý việc chuyển hướng SPA (Single Page Application) cho 3 trang chính (Trang chủ, Lập kế hoạch, Quản lý tài chính).

## 7. Xây dựng bộ khung Layout chính (Layout Components)
- **`Sidebar.jsx`**: Thanh menu bên trái. Tích hợp logo, các thẻ `<Link>` điều hướng có đánh dấu trạng thái Active dựa trên URL hiện tại, và nút đăng xuất.
- **`Header.jsx`**: Thanh công cụ cố định trên cùng chứa thanh tìm kiếm `<Input>`, biểu tượng thông báo `<Bell>` và khối hiển thị Avatar / tên người dùng.
- **`MainLayout.jsx`**: Component tổng bọc ngoài cùng có cấu trúc Flexbox chia lưới. Dành một vùng `<Outlet />` linh động để React Router render nội dung thay đổi theo đường dẫn URL.

## 8. Cấu hình App.jsx Root
Cập nhật file `App.jsx` để bọc toàn bộ ứng dụng bằng `<BrowserRouter>`, thiết lập các định tuyến `<Route>` lồng nhau bên trong `<MainLayout />`. Tạo các component rỗng làm "chỗ ném" (placeholder) cho nội dung trang sẽ code sau.

---

*Lưu ý: Mọi code giao diện hiện tại có thể được chạy kiểm tra trên trình duyệt bằng lệnh `npm run dev` ở thư mục `frontend`.*
