const { z } = require('zod');

const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string({ required_error: "Tên khách hàng là bắt buộc" }).trim().min(2, "Tên quá ngắn"),
    customerPhone: z.string({ required_error: "Số điện thoại là bắt buộc" })
      .regex(/(0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
    customerAddress: z.string({ required_error: "Địa chỉ là bắt buộc" }).trim().min(5, "Địa chỉ quá ngắn"),
    customerNote: z.string().optional(),
    subtotal: z.number().int().nonnegative("Subtotal phải là số nguyên dương"),
    shippingFee: z.number().int().nonnegative("Shipping fee phải là số nguyên dương"),
    totalAmount: z.number().int().nonnegative("Total amount phải là số nguyên dương"),
    items: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number().int().nonnegative(),
        quantity: z.number().int().positive(),
        image: z.string().optional()
      })
    ).min(1, "Đơn hàng phải có ít nhất 1 sản phẩm")
  })
});

module.exports = { createOrderSchema };
