import { sendEmail } from "./sendEmail.utils";

interface IOrderDetail {
  orderId: string;
  items: any[];
  totalAmount: number;
  createdAt: Date;
}

interface IOptions {
  to: string;
  orderDetails: IOrderDetail;
}

export const sendOrderConfirmationEmail = async (options: IOptions) => {
  const { to, orderDetails } = options;
  const html = `
<h1>Your order placed successfully</h1>
<p>OrderId:${orderDetails.orderId}</p>
<h1>Order:</h1>
<ol>
${orderDetails.items
  .map(
    (item) =>
      `<li>${item.product.productName}- ${item.quantity} * ${item.product.productPrice} </li>`
  )
  .join("")}
</ol>
<p> Total:Rs.${orderDetails.totalAmount.toFixed(2)}</p>
<p>Order date:${new Date(orderDetails.createdAt).toLocaleString()}</p>
<p>Thank You for choosing us. </p>
`;

  const mailOptions = {
    html,
    subject: "Order confirmation",
    to,
  };
  await sendEmail(mailOptions);
};
