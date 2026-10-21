export const DISPUTE_REASONS = [
  {
    id: 'NOT_AS_DESCRIBED',
    title: 'Hàng không đúng mô tả',
    desc: 'Ngoại hình trầy xước nặng hơn cam kết, pin chai hơn % đã báo, máy đã qua sửa chữa/thay linh kiện.'
  },
  {
    id: 'DAMAGED_TRANSIT',
    title: 'Hàng bị hư hỏng, cấn móp do vận chuyển',
    desc: 'Hộp bị móp méo, màn hình bể nứt, rách seal hoặc gãy vỡ linh kiện khi bóc kiện hàng.'
  },
  {
    id: 'MISSING_ACCESSORIES',
    title: 'Thiếu phụ kiện hoặc quà tặng kèm',
    desc: 'Không có củ sạc, cáp zin, box phụ kiện như thỏa thuận niêm yết.'
  },
  {
    id: 'COUNTERFEIT_SUSPECT',
    title: 'Nghi ngờ hàng giả, hàng nhái (Fake)',
    desc: 'Số Serial/IMEI không trùng khớp Apple/hãng, phụ kiện tráo đổi hàng lô.'
  },
  {
    id: 'NON_DELIVERY',
    title: 'Kiện hàng rỗng hoặc chưa nhận được',
    desc: 'Shipper báo đã giao nhưng thực tế người mua chưa hề nhận được bưu phẩm.'
  }
];

export const RESOLUTION_OPTIONS = [
  {
    id: 'FULL_REFUND_RETURN',
    title: 'Trả hàng & Hoàn tiền 100%',
    desc: 'Người mua gửi trả lại hàng cho người bán. Tiền Escrow được hoàn trả 100% sau khi người bán nhận lại máy.'
  },
  {
    id: 'PARTIAL_REFUND_KEEP',
    title: 'Giữ lại hàng & Hoàn tiền một phần (Thương lượng)',
    desc: 'Người mua giữ lại máy, người bán đồng ý bù một khoản chi phí (ví dụ tiền ép kính, thay pin mới).'
  },
  {
    id: 'EXCHANGE',
    title: 'Đổi máy tương đương',
    desc: 'Người bán gửi sản phẩm thay thế cùng cấu hình và chất lượng tương đương.'
  }
];
