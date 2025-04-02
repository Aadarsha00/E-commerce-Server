"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderConfirmationEmail = void 0;
const sendEmail_utils_1 = require("./sendEmail.utils");
const sendOrderConfirmationEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { to, orderDetails } = options;
    const html = `
<h1>Your order placed successfully</h1>
<p>OrderId:${orderDetails.orderId}</p>
<h1>Order:</h1>
<ol>
${orderDetails.items
        .map((item) => `<li>${item.product.productName}- ${item.quantity} * ${item.product.productPrice} </li>`)
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
    yield (0, sendEmail_utils_1.sendEmail)(mailOptions);
});
exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail;
