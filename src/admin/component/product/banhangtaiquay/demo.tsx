<Form layout="vertical">
{/* Chọn phương thức thanh toán */}
<Form.Item label="Phương thức thanh toán">
  <Button.Group style={{ display: "flex", width: "100%" }}>
    <Button
      style={{
        flex: 1,
        borderRadius: "20px 0 0 20px",
        backgroundColor:
          selectedMethod === "Tiền mặt" ? "#3498db" : "#d9d9d9",
        color: selectedMethod === "Tiền mặt" ? "#fff" : "#000",
        fontWeight: selectedMethod === "Tiền mặt" ? "bold" : "normal",
        border: "none",
      }}
      onClick={() => handleButtonClick("Tiền mặt")}
    >
      Tiền mặt
    </Button>
  </Button.Group>
</Form.Item>
<Form.Item label="Số tiền khách thanh toán">
  <Input
    type="text"
    value={
      currentInvoice?.tienSauGiam &&
      !isNaN(currentInvoice?.tienSauGiam)
        ? (
            currentInvoice?.tienSauGiam + (ship || 0)
          ).toLocaleString() + " VND"
        : "0.0 VND"
    }
    placeholder="Nhập số tiền thanh toán"
  />
</Form.Item>
<Divider />
<Divider />
<Text strong>
  {/* Khách thanh toán: {partialPayment.toLocaleString()} VND */}
  Khách thanh toán:
  {
    // Check if the value is stored in localStorage and whether a shipping cost exists
    localStorage.getItem(currentInvoice?.id) === null
      ? "0.0 VND" // If no value in localStorage, show "0.0 VND"
      : (
          (parseFloat(localStorage.getItem(currentInvoice?.id)) ||
            0) + (ship || 0)
        ) // Add ship if exists
          .toLocaleString() + " VND" // Format with commas and append " VND"
  }
</Text>
<br />
<br />
<Text strong style={{ color: "red" }}>
  Tiền trả lại khách:  {Math.abs(localStorage.getItem(currentInvoice?.id) - currentInvoice?.tienSauGiam + (ship||0)).toLocaleString() } VND
</Text>
</Form>