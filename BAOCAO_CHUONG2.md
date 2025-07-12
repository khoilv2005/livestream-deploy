# BÁO CÁO ĐỒ ÁN MÔN HỌC: LẬP TRÌNH MẠNG

## CHƯƠNG II: CƠ SỞ LÝ THUYẾT

### 2.1. Tổng quan về hệ thống Live Streaming

#### 2.1.1. Khái niệm Live Streaming
Live Streaming là việc phát trực tiếp video và audio qua Internet. Người dùng có thể xem nội dung ngay khi nó được phát ra, khác với video thường phải tải về trước khi xem.

#### 2.1.2. Các tính năng cơ bản của dự án
- **Phát stream trực tiếp**: Người dùng có thể tạo và phát stream
- **Xem stream**: Người dùng có thể xem các stream đang live
- **Chat real-time**: Tương tác qua chat trong khi xem stream
- **Quản lý người dùng**: Đăng ký, đăng nhập, follow/unfollow
- **Quản lý stream**: Bật/tắt chat, thiết lập stream

### 2.2. Kiến trúc tổng quan

#### 2.2.1. Mô hình 3-layer
```
[Frontend - Next.js] ↔ [Backend - API Routes] ↔ [Database - MySQL]
        ↓
[LiveKit - Media Server]
        ↓
[Clerk - Authentication]
```

**Frontend (Client):**
- Giao diện người dùng được xây dựng bằng React/Next.js
- Hiển thị danh sách stream, player video, chat

**Backend (Server):**
- API để xử lý logic nghiệp vụ
- Kết nối với database và các service khác

**Database:**
- Lưu thông tin user, stream, follow/block

**External Services:**
- LiveKit: Xử lý video streaming
- Clerk: Xử lý đăng nhập/đăng ký

### 2.3. Công nghệ sử dụng

#### 2.3.1. Frontend
**Next.js 15**
- Framework React cho việc xây dựng web app
- Hỗ trợ server-side rendering
- Routing tự động

**React 19**
- Library JavaScript để xây dựng giao diện
- Component-based development
- State management với hooks

**TypeScript**
- Ngôn ngữ lập trình mở rộng từ JavaScript
- Kiểm tra lỗi tại compile time
- Tăng độ tin cậy của code

**Tailwind CSS**
- Framework CSS utility-first
- Styling nhanh và responsive

#### 2.3.2. Backend & Database
**Prisma**
- ORM (Object-Relational Mapping) cho database
- Tạo schema và migrate database
- Type-safe database queries

**MySQL**
- Hệ quản trị cơ sở dữ liệu quan hệ
- Lưu trữ data của ứng dụng

#### 2.3.3. External Services
**LiveKit**
- Service streaming video
- Xử lý WebRTC connections
- Quản lý rooms và participants

**Clerk**
- Service authentication
- Quản lý đăng nhập/đăng ký
- Social login (Google, GitHub, etc.)

### 2.4. Cơ sở dữ liệu

#### 2.4.1. Các bảng chính

**Bảng User**
- Lưu thông tin người dùng
- id, username, imageUrl, bio
- Liên kết với Clerk để authentication

**Bảng Stream**
- Thông tin về stream của user
- name, thumbnailUrl, streamKey
- Trạng thái: isLive, isChatEnabled, etc.

**Bảng Follow**
- Quan hệ follow giữa các user
- followerId, followingId

**Bảng Block**
- Quan hệ block giữa các user
- blockerId, blockedId

#### 2.4.2. Quan hệ giữa các bảng
- User có 1 Stream (one-to-one)
- User có nhiều Follow (one-to-many)
- User có nhiều Block (one-to-many)

### 2.5. Streaming và Real-time Communication

#### 2.5.1. Video Streaming với LiveKit
- Sử dụng WebRTC để truyền video
- LiveKit xử lý connection và media server
- Stream được phát trong "rooms"

#### 2.5.2. Chat Real-time
- Sử dụng WebSocket cho chat
- Messages được gửi real-time đến tất cả viewers
- Có thể bật/tắt chat

### 2.6. Authentication và Security

#### 2.6.1. Clerk Authentication
- Xử lý đăng ký/đăng nhập users
- Tích hợp social login
- Tạo JWT tokens cho authentication

#### 2.6.2. Route Protection
- Một số trang cần đăng nhập mới vào được
- Middleware kiểm tra authentication
- API routes được bảo vệ

### 2.7. Luồng hoạt động chính

#### 2.7.1. Tạo và phát stream
1. User đăng nhập qua Clerk
2. Tạo stream room trong LiveKit
3. Lấy stream key và server URL
4. Sử dụng OBS để phát stream
5. Viewers có thể xem qua web

#### 2.7.2. Xem stream và chat
1. User vào trang stream
2. Kết nối đến LiveKit room
3. Hiển thị video stream
4. Kết nối WebSocket cho chat
5. Có thể gửi messages real-time

### 2.8. Deployment

#### 2.8.1. Platform
- Deploy lên Heroku
- Database MySQL trên cloud
- Static files trên CDN

#### 2.8.2. Environment Variables
- Cấu hình các service keys
- Database connection string
- API endpoints

---

**Kết luận Chương II:**

Chương này trình bày các công nghệ và kiến trúc cơ bản được sử dụng trong dự án live streaming. Dự án sử dụng các công nghệ web hiện đại như Next.js, React, và tích hợp với các service như LiveKit và Clerk để tạo ra một ứng dụng streaming hoàn chỉnh.
