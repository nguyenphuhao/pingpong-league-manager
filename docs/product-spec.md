# Product Design

## **1. Tầm nhìn & Mục tiêu**

Xây dựng hệ thống **Web/PWA** để quản lý giải bóng bàn, giảm tải thủ công, minh bạch, dễ dùng cho người lớn tuổi (>40).

Hỗ trợ:

- Đôi ghép đôi tự động (High–Low).
- Giải đơn.
- Giải đôi tự đăng ký.
- Giải đồng đội.

Hệ thống thông báo thông minh: ưu tiên Web Push, SMS tối giản.

---

## **2. Vai trò**

- **Admin:** Full access, phân quyền.
- **Organizer (BTC):** Tạo giải, cấu hình round, điều lệ, lịch, nhập kết quả, báo cáo.
- **Referee:** Điều phối bàn, nhập điểm, WO/No-show/Pause.
- **Treasurer:** Quản lý lệ phí, sổ quỹ.
- **Member:** Hồ sơ, điểm, hạng.
- **Player:** Member tham gia Event.
- **Captain:** Quản lý lineup team.
- **Viewer:** Xem thông tin, lịch, BXH, kết quả.

---

## **3. Tính năng chính**

### **3.1. Đăng nhập**

- SMS OTP, số điện thoại duy nhất.
- Rate-limit OTP.
- Merge account khi đổi số.

### **3.2. Hồ sơ & phân hạng**

- Hồ sơ Member: Họ tên, năm sinh, CLB, số ĐT, avatar.
- **Điểm (Rating Points):** tích luỹ từ giải đấu → dùng để phân hạng.
- **Hạng (Grade):** A/B/C được gán tự động dựa trên điểm:
    - Ví dụ: A ≥ 2000, B 1200–1999, C < 1200 (có thể cấu hình).
- Organizer có thể chỉnh tay điểm nếu cần.

### **3.3. Tạo giải & điều lệ**

- Tạo Tournament với nhiều Event.
- Config chung: phí, cutoff, số bàn, seed.
- **Round Config (per Stage/Round):**
    - Loại vòng: Vòng bảng / 1/16 / 1/8 / Tứ kết / BK / CK.
    - Cấu hình riêng:
        - best-of (3,5,7).
        - Thời lượng ước lượng 1 trận.
        - Cutoff time.
        - Tie-break rules (nếu khác).
    - Ví dụ:
        - Vòng bảng → best-of-3.
        - Tứ kết → best-of-5.
        - Chung kết → best-of-7.
- Điều lệ: template, xuất PDF, có versioning.

### **3.4. Đăng ký**

- Player đăng ký event.
- Doubles: auto-pair High–Low theo điểm, hoặc tự đăng ký cặp.
- Team: Captain tạo đội, invite.
- Treasurer quản lý phí: Paid/Unpaid.
- SMS xác nhận.

### **3.5. Bốc thăm**

- Auto-pair High–Low = chia 2 dải điểm, ghép i–i.
- Seed bảng RR theo điểm/hạng.
- Nhánh KO + Consolation.
- Bốc thăm online tích hợp app: public seed + timestamp.
- Xuất PDF biên bản.

### **3.6. Lịch & điều phối**

- Engine lập lịch theo số bàn, Round Config (best-of/time).
- Tránh trùng người.
- Bảng điều phối realtime (Scheduled/On Court/Done).
- Banner cutoff.
- Nút đổi bàn, in phiếu.

### **3.7. Trận & kết quả**

- Trạng thái: Scheduled → On Court → Paused → Done.
- Nhập điểm set-by-set.
- **WO:** bỏ trước giờ.
- **No-show:** vắng quá giờ.
- **Retired:** bỏ giữa trận.
- **Pause:** tạm dừng, có ghi chú.
- Vòng bảng: WO/No-show tính thắng mặc định (BO3=2–0, BO5=3–0).
- KO: chỉ advance người thắng.

### **3.8. Huỷ & thay thế**

- **Standby Pool:** danh sách dự phòng (người đăng ký muộn/dư).
- Organizer có thể gán thay vào cặp khi 1 người huỷ **trước On Court**.
- Nếu huỷ khi đang On Court → đối thủ thắng (Retired).
- Log substitution, SMS thông báo đến các bên.

### **3.9. BXH & tiến trình**

- BXH mặc định theo *Điểm trận → Hiệu số điểm → Đối đầu → Bốc thăm*, nhưng cho phép cấu hình lại thứ tự tiêu chí.
- Auto đẩy vào KO.
- Organizer có thể khoá vòng.

### **3.10. Thu phí & báo cáo**

- Quản lý phí đăng ký, Paid/Unpaid, phương thức.
- Xuất phiếu thu, sổ quỹ.
- Báo cáo: danh sách, lịch, BXH, kết quả, thu chi.

### **3.11. Công bố**

- Public board: Lịch | Kết quả | BXH | Bracket | Search.
- TV/Kiosk view auto refresh.
- Thông báo:
    - Mặc định qua **Web Push**.
    - **SMS** chỉ cho: Đăng ký hội viên mới, Đăng ký giải thành công.
    - Có **UI Notification Center** trong app để user xem lại toàn bộ thông báo đã được Engine gửi.
- Giấy khen auto (nhất/nhì/ba).

### **3.12. Đồng đội (phase sau)**

- Captain view lineup theo tie (S1,S2,D1).
- Nhập kết quả từng rubber.
- Giới hạn số A/đội.
