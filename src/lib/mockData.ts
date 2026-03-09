export const farmer = {
  name: "Chú Việt",
  fullName: "Nguyễn Văn Việt",
  region: "M'Drak, Đắk Lắk",
  crop: "Cà phê Liberica",
  journey: "Mùa vụ 2026",
  bio: "Hơn 25 năm kinh nghiệm trồng cà phê hữu cơ tại vùng cao nguyên Đắk Lắk. Chú Việt luôn đặt chất lượng và sự bền vững lên hàng đầu.",
};

export const timelineEntries = [
  {
    id: 1,
    date: "15/01/2026",
    stage: "Gieo hạt",
    description: "Gieo giống Liberica từ vườn ươm tự nhiên. Đất được chuẩn bị từ phân hữu cơ ủ 3 tháng.",
    imageKey: "seedling" as const,
    note: "Thời tiết thuận lợi, độ ẩm 75%",
  },
  {
    id: 2,
    date: "28/02/2026",
    stage: "Chăm sóc",
    description: "Cây con phát triển tốt, đạt chiều cao 15cm. Tưới nước đều đặn bằng hệ thống tưới nhỏ giọt tiết kiệm.",
    imageKey: "seedling" as const,
    note: "Không sử dụng thuốc trừ sâu hóa học",
  },
  {
    id: 3,
    date: "20/05/2026",
    stage: "Ra hoa",
    description: "Cây bắt đầu ra hoa trắng, hương thơm nhẹ. Ong tự nhiên thụ phấn trong vườn.",
    imageKey: "harvest" as const,
    note: "Tỷ lệ ra hoa đạt 92%",
  },
  {
    id: 4,
    date: "15/08/2026",
    stage: "Thu hoạch",
    description: "Quả chín đỏ đều, thu hoạch thủ công chọn lọc từng quả. Chỉ hái quả chín hoàn toàn.",
    imageKey: "harvest" as const,
    note: "Năng suất ước tính 3.2 tấn/ha",
  },
  {
    id: 5,
    date: "01/09/2026",
    stage: "Chế biến",
    description: "Phơi nắng tự nhiên trên giàn tre truyền thống. Đảo đều 4 lần/ngày trong 14 ngày.",
    imageKey: "drying" as const,
    note: "Độ ẩm hạt đạt chuẩn 12.5%",
  },
];

export const stageColors: Record<string, string> = {
  "Gieo hạt": "badge-terracotta",
  "Chăm sóc": "badge-sage",
  "Ra hoa": "badge-terracotta",
  "Thu hoạch": "badge-terracotta",
  "Chế biến": "badge-sage",
};

export const stages = ["Gieo hạt", "Chăm sóc", "Ra hoa", "Thu hoạch", "Chế biến", "Đóng gói"];
