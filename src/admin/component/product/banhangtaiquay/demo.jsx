{/* <Tabs type="card" defaultActiveKey="1" onChange={getOrderById}>
{invoices.length > 0 ? (
  invoices.map((invoice) => (
    <TabPane tab={`Hóa đơn ${invoice.id}`} key={invoice.id}>
      <div>
        <Button type="primary">Danh sách</Button>
        <Table
          columns={invoiceColumns}
          dataSource={invoiceDetails}
          pagination={false}
          bordered
          loading={loading}
        />
      </div>
    </TabPane>
  ))
) : (
  <TabPane tab="Hóa đơn" key={currentInvoice?.id}>
    <Text
      type="danger"
      style={{
        marginTop: "24px",
        display: "block",
        textAlign: "center",
      }}
    >
      Chưa có hóa đơn nào! Hãy tạo hóa đơn.
    </Text>
  </TabPane>
)}
</Tabs> */}