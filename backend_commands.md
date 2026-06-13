# Hướng dẫn khởi chạy dự án Backend

Tài liệu này tổng hợp các lệnh Terminal phổ biến và cần thiết để cài đặt, cấu hình và khởi chạy dự án Backend (sử dụng **FastAPI**, **Alembic**, **Docker Compose** và **Python**).

---

## 1. Chuẩn bị Môi trường (Virtual Environment)
Đầu tiên, di chuyển vào thư mục `backend` và kích hoạt môi trường ảo:

* **Di chuyển vào thư mục backend:**
  ```bash
  cd backend
  ```
* **Tạo môi trường ảo `venv` (nếu chưa có):**
  ```bash
  python3 -m venv venv
  ```
* **Kích hoạt môi trường ảo (`venv`):**
  * Trên **macOS/Linux**:
    ```bash
    source venv/bin/activate
    ```
  * Trên **Windows** (PowerShell):
    ```powershell
    .\venv\Scripts\Activate.ps1
    ```
  * Trên **Windows** (Command Prompt):
    ```cmd
    .\venv\Scripts\activate.bat
    ```
* **Cài đặt các thư viện dependencies:**
  ```bash
  pip install -r requirements.txt
  ```

---

## 2. Khởi chạy các dịch vụ bổ trợ (Docker Compose)
Dự án sử dụng **PostgreSQL** và **Redis** thông qua Docker. Hãy chạy các lệnh sau để khởi động chúng:

* **Khởi động Postgres và Redis (chạy ngầm):**
  ```bash
  docker-compose up -d
  ```
  *(hoặc `docker compose up -d` tùy phiên bản Docker)*
* **Kiểm tra trạng thái các container đang chạy:**
  ```bash
  docker ps
  ```
* **Xem logs từ database hoặc cache (hữu ích khi debug kết nối):**
  ```bash
  docker-compose logs -f
  ```
* **Dừng các dịch vụ Docker:**
  ```bash
  docker-compose down
  ```

---

## 3. Di chuyển cơ sở dữ liệu (Database Migrations với Alembic)
Sau khi database Postgres đã hoạt động, bạn cần đồng bộ các bảng cơ sở dữ liệu:

* **Chạy migration đưa database lên phiên bản mới nhất:**
  ```bash
  alembic upgrade head
  ```
* **Tự động tạo file migration mới (chạy sau khi bạn thay đổi các Model trong `app/models/`):**
  ```bash
  alembic revision --autogenerate -m "tên_mô_tả_thay_đổi"
  ```
* **Quay lại (Rollback) 1 phiên bản migration gần nhất:**
  ```bash
  alembic downgrade -1
  ```
* **Xem lịch sử các bản migration:**
  ```bash
  alembic history --verbose
  ```

---

## 4. Chạy ứng dụng FastAPI
Sau khi chuẩn bị xong cơ sở dữ liệu và môi trường, tiến hành chạy server:

* **Chạy Backend ở chế độ Development (Tự động tải lại khi sửa code):**
  ```bash
  uvicorn app.main:app --reload
  ```
  Hoặc sử dụng cổng khác (ví dụ cổng `8080`):
  ```bash
  uvicorn app.main:app --reload --port 8080
  ```
* **Truy cập vào trang tài liệu API (Swagger UI):**
  Mở trình duyệt truy cập: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) (hoặc cổng mà bạn cấu hình).

---

## 5. Một số lệnh hữu ích khác
* **Cập nhật file `requirements.txt` khi cài thêm thư viện mới:**
  ```bash
  pip freeze > requirements.txt
  ```
* **Tắt môi trường ảo `venv`:**
  ```bash
  deactivate
  ```
