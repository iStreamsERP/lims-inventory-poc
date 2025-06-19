import React from "react";

const RefundPolicyPage = () => {
  return (
    <div className="p-4 text-sm leading-relaxed">
      <h1 className="mb-4 text-lg font-semibold underline">Refund and Cancellation policy</h1>

      <p className="mb-2">
        {" "}
        This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service that you have purchased through the
        Platform. Under this policy:
      </p>
      <ol className="list-decimal space-y-2 pl-6">
        <li>
          Cancellations will only be considered if the request is made <span className="font-bold">7 days</span> of placing the order. However,
          cancellation requests may not be entertained if the orders have been communicated to such sellers / merchant(s) listed on the Platform and
          they have initiated the process of shipping them, or the product is out for delivery. In such an event, you may choose to reject the product
          at the doorstep.
        </li>
        <li>
          In case of any refunds approved by <span className="font-bold">iStreams Software Solutions,</span> it will take{" "}
          <span className="font-bold">5-7 business days</span> for the refund to get credited to your original payment method.
        </li>
      </ol>
    </div>
  );
};

export default RefundPolicyPage;
