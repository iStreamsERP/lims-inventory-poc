// services/paymentService.js
import PhonePe from 'phonepe-pg';

export const initiatePhonePePayment = async (orderData) => {
  const phonepe = new PhonePe({
    merchantId: process.env.PHONEPE_MERCHANT_ID,
    saltKey: process.env.PHONEPE_SALT_KEY,
    saltIndex: process.env.PHONEPE_SALT_INDEX,
    env: 'PRODUCTION' // Use 'TEST' for sandbox
  });

  const paymentData = {
    merchantTransactionId: orderData.transactionId,
    amount: orderData.amount * 100, // in paise
    merchantUserId: orderData.userId,
    callbackUrl: `${window.location.origin}/payment-callback`,
    mobileNumber: orderData.phone,
  };

  try {
    const response = await phonepe.paymentInitiate(paymentData);
    return response.data.instrumentResponse.redirectInfo.url;
  } catch (error) {
    throw new Error('Payment initiation failed');
  }
};