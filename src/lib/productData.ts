import productTypica from "@/assets/product-typica.jpg";
import productPeru from "@/assets/product-peru.jpg";
import productComboTet from "@/assets/product-combo-tet.jpg";
import productMuaDomHoa from "@/assets/product-mua-dom-hoa.jpg";
import productProudVietnam from "@/assets/product-proud-vietnam.jpg";

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  badge: string;
  category: "espresso" | "handbrew" | "all";
  size: string;
  description: string;
  origin: {
    country: string;
    region: string;
    farmer: string;
    altitude: string;
    farm: string;
    variety: string;
    process: string;
  };
  flavorNotes: string;
  story: string;
  traceability: {
    id: number;
    date: string;
    stage: string;
    description: string;
    note: string;
  }[];
}

export const products: Product[] = [
  {
    id: "1",
    slug: "typica-mejorado-colombia",
    name: "Typica Mejorado Colombia",
    price: 540000,
    image: productTypica,
    badge: "New Arrival",
    category: "handbrew",
    size: "200g",
    description:
      "Sergio Dario Aranda Gomez là con trai trong gia đình có truyền thống trồng cà phê, anh là thế hệ thứ ba đến từ San Adolfo, Huila. Từ khi 22 tuổi, anh bắt đầu làm việc tại một nhà máy chế biến cà phê. Học cách nếm cà phê và phân tích chuyên sâu vào hương vị cà phê.",
    origin: {
      country: "Colombia",
      region: "Acevedo, Huila",
      farmer: "Sergio Dario Aranda Gomez",
      altitude: "1600 MASL",
      farm: "Finca Anaya",
      variety: "Typica Mejorado",
      process: "Washing with Yeast Inoculation",
    },
    flavorNotes: "Dưa đỏ, dưa hấu, đu đủ. Rất ngọt ngào và tinh tế.",
    story:
      "Finca Anaya: Nằm ở San Adolfo, Acevedo, Huila, trang trại Anaya đã được gia đình Aranda Gomez trồng trọt và chăm sóc suốt hơn 3 thập kỷ. Trang trại có diện tích 4.5 hecta, tọa lạc giữa hai dãy núi xinh đẹp của tỉnh Huila. Tại trang trại Anaya, họ trồng nhiều giống cà phê khác nhau như Pink Bourbon, Pacamara, Geisha, Castillo và Red Bourbon.",
    traceability: [
      { id: 1, date: "10/01/2026", stage: "Gieo hạt", description: "Gieo giống Typica Mejorado tại vùng Huila, Colombia ở độ cao 1600m.", note: "Giống được tuyển chọn kỹ lưỡng từ Finca Anaya" },
      { id: 2, date: "15/03/2026", stage: "Chăm sóc", description: "Cây con phát triển tốt dưới tán cây che bóng tự nhiên. Bón phân hữu cơ định kỳ.", note: "Không sử dụng thuốc trừ sâu hóa học" },
      { id: 3, date: "20/06/2026", stage: "Thu hoạch", description: "Thu hoạch thủ công, chỉ hái quả chín hoàn toàn. Phân loại tại vườn.", note: "Tỷ lệ chín đạt 95%" },
      { id: 4, date: "25/06/2026", stage: "Sơ chế", description: "Washing with Yeast Inoculation – lên men có kiểm soát với cây men tuyển chọn, theo dõi pH, Brix và nhiệt độ.", note: "Quy trình chế biến tiên tiến đảm bảo chất lượng" },
      { id: 5, date: "15/07/2026", stage: "Đóng gói", description: "Rang và đóng gói tại Việt Nam. Kiểm tra chất lượng cupping score 86+.", note: "Đạt tiêu chuẩn Specialty Coffee" },
      { id: 6, date: "20/07/2026", stage: "Giao hàng", description: "Giao đến tay khách hàng qua hệ thống vận chuyển nhanh toàn quốc.", note: "Bảo quản trong bao bì nitrogen flush" },
    ],
  },
  {
    id: "2",
    slug: "peru-el-rejo-sidra",
    name: "PERU EL REJO SIDRA",
    price: 320000,
    image: productPeru,
    badge: "New Arrival",
    category: "handbrew",
    size: "200g",
    description:
      "Cà phê đến từ vùng El Rejo, Peru với giống Sidra quý hiếm. Được trồng ở độ cao lý tưởng và chế biến theo phương pháp natural, mang lại hương vị trái cây phức tạp.",
    origin: {
      country: "Peru",
      region: "El Rejo, Cajamarca",
      farmer: "Hợp tác xã El Rejo",
      altitude: "1800 MASL",
      farm: "El Rejo Community",
      variety: "Sidra",
      process: "Natural Process",
    },
    flavorNotes: "Mận chín, chocolate đen, cam bergamot. Hậu vị dài và sạch.",
    story:
      "Vùng El Rejo thuộc Cajamarca, Peru nổi tiếng với điều kiện thổ nhưỡng và khí hậu lý tưởng cho cà phê specialty. Giống Sidra - một biến thể hiếm của Bourbon - được trồng bởi các hộ nông dân nhỏ trong hợp tác xã.",
    traceability: [
      { id: 1, date: "05/01/2026", stage: "Gieo hạt", description: "Gieo giống Sidra tại vùng cao nguyên El Rejo, Peru.", note: "Giống Sidra quý hiếm" },
      { id: 2, date: "20/03/2026", stage: "Chăm sóc", description: "Chăm sóc hữu cơ, tưới nước tự nhiên từ suối núi.", note: "Canh tác bền vững" },
      { id: 3, date: "15/07/2026", stage: "Thu hoạch", description: "Thu hoạch thủ công bởi nông dân địa phương.", note: "Năng suất 2.8 tấn/ha" },
      { id: 4, date: "20/07/2026", stage: "Sơ chế", description: "Natural process – phơi nguyên quả trên giàn cao.", note: "14 ngày phơi nắng" },
      { id: 5, date: "10/08/2026", stage: "Đóng gói", description: "Rang medium tại Việt Nam, đóng gói chân không.", note: "Cupping score 85+" },
      { id: 6, date: "15/08/2026", stage: "Giao hàng", description: "Giao hàng toàn quốc trong 2-3 ngày.", note: "Đảm bảo tươi mới" },
    ],
  },
  {
    id: "3",
    slug: "mua-dat-hua-combo-tet",
    name: "MÙA ĐẤT HỨA COMBO TẾT",
    price: 850000,
    image: productComboTet,
    badge: "New Arrival",
    category: "all",
    size: "Set 3 gói",
    description:
      "Bộ sưu tập cà phê đặc biệt dành cho mùa Tết – tuyển chọn 3 loại cà phê specialty hảo hạng từ các vùng trồng nổi tiếng. Hộp quà sang trọng, ý nghĩa.",
    origin: {
      country: "Đa quốc gia",
      region: "Colombia, Peru, Việt Nam",
      farmer: "Nhiều nông hộ",
      altitude: "1400-1800 MASL",
      farm: "Đa trang trại",
      variety: "Blend đặc biệt",
      process: "Đa phương pháp",
    },
    flavorNotes: "Đa dạng: từ trái cây nhiệt đới đến chocolate, caramel.",
    story:
      "Combo Tết Mùa Đất Hứa là bộ sưu tập cà phê specialty cao cấp, tuyển chọn từ những vùng trồng tốt nhất thế giới. Mỗi gói cà phê kể một câu chuyện riêng về vùng đất và con người.",
    traceability: [
      { id: 1, date: "01/2026", stage: "Tuyển chọn", description: "Tuyển chọn 3 loại cà phê specialty từ Colombia, Peru và Việt Nam.", note: "Cupping score trung bình 86+" },
      { id: 2, date: "06/2026", stage: "Thu hoạch", description: "Thu hoạch từ các trang trại đối tác theo tiêu chuẩn specialty.", note: "Chỉ hái quả chín" },
      { id: 3, date: "07/2026", stage: "Sơ chế", description: "Mỗi loại được chế biến theo phương pháp phù hợp nhất.", note: "Kiểm soát chất lượng nghiêm ngặt" },
      { id: 4, date: "11/2026", stage: "Rang & Đóng gói", description: "Rang và đóng gói tại Việt Nam với hộp quà cao cấp.", note: "Thiết kế hộp quà Tết sang trọng" },
      { id: 5, date: "12/2026", stage: "Giao hàng", description: "Giao hàng toàn quốc, đảm bảo đến trước Tết.", note: "Miễn phí giao hàng đơn từ 500k" },
    ],
  },
  {
    id: "4",
    slug: "mua-dom-hoa",
    name: "MÙA ĐƠM HOA",
    price: 500000,
    image: productMuaDomHoa,
    badge: "New Arrival",
    category: "handbrew",
    size: "200g",
    description:
      "Cà phê lấy cảm hứng từ mùa hoa cà phê nở rộ trên cao nguyên. Hương vị tươi mới, nhẹ nhàng như những cánh hoa trắng tinh khôi giữa đại ngàn.",
    origin: {
      country: "Việt Nam",
      region: "M'Drak, Đắk Lắk",
      farmer: "Nguyễn Văn Việt",
      altitude: "600 MASL",
      farm: "Trang trại gia đình",
      variety: "Liberica & Robusta Blend",
      process: "Honey Process",
    },
    flavorNotes: "Hoa nhài, mật ong, vani. Nhẹ nhàng và thanh thoát.",
    story:
      "Mùa Đơm Hoa được tạo nên từ những hạt cà phê thu hoạch đúng mùa hoa cà phê nở rộ. Chế biến theo phương pháp Honey để giữ lại vị ngọt tự nhiên.",
    traceability: [
      { id: 1, date: "15/01/2026", stage: "Gieo hạt", description: "Gieo giống tại M'Drak, Đắk Lắk.", note: "Đất phù sa giàu dinh dưỡng" },
      { id: 2, date: "28/02/2026", stage: "Chăm sóc", description: "Chăm sóc hữu cơ, tưới nhỏ giọt tiết kiệm.", note: "Không hóa chất" },
      { id: 3, date: "20/05/2026", stage: "Ra hoa", description: "Cây ra hoa trắng muốt, ong tự nhiên thụ phấn.", note: "Tỷ lệ ra hoa 92%" },
      { id: 4, date: "15/08/2026", stage: "Thu hoạch", description: "Thu hoạch thủ công chọn lọc từng quả.", note: "Năng suất 3.2 tấn/ha" },
      { id: 5, date: "01/09/2026", stage: "Sơ chế", description: "Honey process – giữ lớp nhầy tự nhiên khi phơi.", note: "Độ ẩm hạt 12.5%" },
      { id: 6, date: "15/09/2026", stage: "Đóng gói", description: "Rang và đóng gói tươi mới.", note: "Giao trong 24h sau rang" },
    ],
  },
  {
    id: "5",
    slug: "proud-of-vietnam-blend",
    name: "PROUD OF VIETNAM BLEND",
    price: 480000,
    image: productProudVietnam,
    badge: "New Arrival",
    category: "espresso",
    size: "200g",
    description:
      "Blend đặc biệt tôn vinh cà phê Việt Nam – kết hợp tinh hoa từ Robusta Đắk Lắk và Arabica Cầu Đất. Đậm đà bản sắc, tự hào Việt Nam.",
    origin: {
      country: "Việt Nam",
      region: "Đắk Lắk & Lâm Đồng",
      farmer: "Đa nông hộ",
      altitude: "600-1500 MASL",
      farm: "Đa trang trại",
      variety: "Robusta & Arabica Blend",
      process: "Washed & Natural",
    },
    flavorNotes: "Chocolate đen, hạt phỉ, caramel. Đậm đà, cân bằng.",
    story:
      "Proud of Vietnam Blend là sự kết hợp hoàn hảo giữa Robusta chất lượng cao từ Đắk Lắk và Arabica thơm ngát từ Cầu Đất, Lâm Đồng. Mỗi hạt cà phê kể câu chuyện về sự kiên cường và tự hào của nông dân Việt Nam.",
    traceability: [
      { id: 1, date: "01/2026", stage: "Tuyển chọn", description: "Tuyển chọn Robusta Đắk Lắk và Arabica Cầu Đất chất lượng cao nhất.", note: "Cupping score 83+ cho từng loại" },
      { id: 2, date: "03/2026", stage: "Chăm sóc", description: "Canh tác bền vững tại cả hai vùng trồng.", note: "Tiêu chuẩn UTZ Certified" },
      { id: 3, date: "08/2026", stage: "Thu hoạch", description: "Thu hoạch song song tại Đắk Lắk và Lâm Đồng.", note: "Chọn quả chín 90%+" },
      { id: 4, date: "09/2026", stage: "Sơ chế", description: "Robusta: Natural process. Arabica: Washed process.", note: "Phơi 12-14 ngày" },
      { id: 5, date: "10/2026", stage: "Phối trộn & Đóng gói", description: "Phối trộn tỷ lệ vàng 60/40, rang và đóng gói.", note: "Profile rang medium-dark" },
      { id: 6, date: "10/2026", stage: "Giao hàng", description: "Sẵn sàng giao đến tay khách hàng.", note: "Tươi mới từ lò rang" },
    ],
  },
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};
