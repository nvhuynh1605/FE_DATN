import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Form, Input, InputNumber, Button, Radio, message, Select } from "antd";
import { createOrderCOD } from "../../api/ApiOrder";
import { FaPaypal } from "react-icons/fa";

const { Option } = Select;

const PaymentModal = ({ isVisible, onClose, defaultMethod, productData, type, onOrderSuccess  }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(defaultMethod || "cod");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [form] = Form.useForm();
  const MAX_QUANTITY = productData?.quantity;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await axios.get('https://provinces.open-api.vn/api/p/');
      setProvinces(response.data);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(
            `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
          );
          setDistricts(response.data.districts);
          setWards([]); // Reset wards when province changes
        } catch (error) {
          console.error("Lỗi khi gọi API quận/huyện:", error);
          setDistricts([]); // Đảm bảo districts không gây lỗi render
        }
      };
  
      fetchDistricts();
    } else {
      setDistricts([]); // Nếu không có tỉnh nào được chọn, xóa danh sách quận/huyện
      setWards([]); // Xóa luôn danh sách xã/phường
    }
  }, [selectedProvince]);
  

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        const response = await axios.get(
          `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
        );
        setWards(response.data.wards);
      };
      fetchWards();
    }
  }, [selectedDistrict]);

  useEffect(() => {
    setSelectedPaymentMethod(defaultMethod || "cod");
  }, [defaultMethod]);

  const handleCancel = () => {
    form.resetFields();
    setSelectedPaymentMethod(defaultMethod || "cod"); 
    onClose();
  };

  const handlePaymentCOD = () => {
    form
    .validateFields()
    .then((values) => {
      if (values.quantity > MAX_QUANTITY) {
        message.error(`Số lượng không được vượt quá ${MAX_QUANTITY}!`);
        return;
      }

      const selectedProvinceName = provinces.find(province => province.code === values.province)?.name;
      const selectedDistrictName = districts.find(district => district.code === values.district)?.name;
      const selectedWardName = wards.find(ward => ward.code === values.ward)?.name;

      const fullAddress = `${values.sub_address}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`;

      const { fullName, note, quantity, phoneNum } = values;

      const product = {
        name: productData?.name,
        product_id: productData?._id,
        currentPrice: productData?.currentPrice,
      };

      let products = []
      if (type === "cart") {
        products = [...productData]
      } else {
        products = [{ ...product, buyQuantity: quantity }];
      }

      console.log(products);

      const orderData = {
        products,
        amount: products.reduce((acc, item) => acc + item.currentPrice * item.buyQuantity, 0),
        fullName,
        address: fullAddress,
        note,
        phoneNum,
        userId: userId
      };
      createOrderCOD(orderData)
        .then((order) => {
          if (onOrderSuccess) {
            onOrderSuccess();
          }
          message.success("Đặt hàng thành công!");
        })
        .catch((error) => {
          message.error("Đã xảy ra lỗi khi tạo đơn hàng.");
        });

      form.resetFields();
      onClose();
    })
    .catch((error) => {
      console.error("Validation failed:", error);
    });
  };

  const handlePaymentPaypal = () => {
    form
      .validateFields()
      .then((values) => {
        if (values.quantity > MAX_QUANTITY) {
          message.error(`Số lượng không được vượt quá ${MAX_QUANTITY}!`);
          return;
        }

        const selectedProvinceName = provinces.find(province => province.code === values.province)?.name;
        const selectedDistrictName = districts.find(district => district.code === values.district)?.name;
        const selectedWardName = wards.find(ward => ward.code === values.ward)?.name;

        const fullAddress = `${values.sub_address}-${selectedWardName}-${selectedDistrictName}-${selectedProvinceName}`;

        const { fullName, note, quantity, phoneNum } = values;
        localStorage.setItem(
          "paymentInfo",
          JSON.stringify({ fullName, address: fullAddress, note, phoneNum })
        );
  
        const product = {
          name: productData?.name,
          product_id: productData?._id,
          currentPrice: parseFloat((productData?.currentPrice / 22000)?.toFixed(2)),
        };

        let products = []
        if (type === "cart") {
          products = productData.map((item) => ({
            name: item.name,
            product_id: item._id,
            currentPrice: parseFloat((item.currentPrice / 22000).toFixed(2)),
            buyQuantity: item.buyQuantity,
          }));
        } else {
          products = [{ ...product, buyQuantity: quantity }];
        }
    
        axios
          .post("http://localhost:3001/api/create-payment", { products })
          .then((response) => {
            const { approvalUrl } = response.data;
            if (approvalUrl) {
              window.location.href = approvalUrl;
            } else {
              console.error("Không nhận được approvalUrl:", response.data);
            }
          })
          .catch((error) => {
            console.error(
              "Lỗi khi tạo giao dịch:",
              error.response ? error.response.data : error.message
            );
          });
  
        form.resetFields();
        onClose();
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  };
  
  const handlePaymentChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  return (
    <Modal
      title="Thông Tin Thanh Toán"
      visible={isVisible}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <Form form={form} layout="vertical">
        {type !== "cart" && (
          <Form.Item
            name="quantity"
            label="Số Lượng"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng!" },
              { type: "number", min: 1, message: "Số lượng phải lớn hơn 0!" },
            ]}
            className="w-1/3"
          >
            <InputNumber
              min={1}
              max={MAX_QUANTITY}
              style={{ width: "100%" }}
              onBlur={(e) => {
                if (e.target.value > MAX_QUANTITY) {
                  message.error("Số lượng không được vượt quá so luong con lai trong kho!");
                }
              }}
            />
          </Form.Item>
        )}
        <div className="flex flex-row gap-4">
          <Form.Item
            name="fullName"
            label="Họ tên người nhận"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]} 
            className="w-1/2"
          >
            <Input placeholder="Nhập họ tên"  />
          </Form.Item>
          <Form.Item
            name="phoneNum"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            className="w-1/2"
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </div>
        <div className="flex flex-row gap-3">
          <Form.Item
            label="Tỉnh/Thành"
            name="province"
            rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành' }]}
            className="w-1/3"
          >
            <Select
              placeholder="Chọn tỉnh/thành"
              onChange={(value) => setSelectedProvince(value)}
              allowClear
            >
              {provinces.map((province) => (
                <Option key={province.code} value={province.code}>
                  {province.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Quận/Huyện"
            name="district"
            rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
            className="w-1/3"
          >
            <Select
              placeholder="Chọn quận/huyện"
              onChange={(value) => setSelectedDistrict(value)}
              allowClear
              disabled={!districts.length}
            >
              {districts.map((district) => (
                <Option key={district.code} value={district.code}>
                  {district.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Xã/Phường"
            name="ward"
            className="w-1/3"
          >
            <Select
              placeholder="Chọn xã/phường"
              allowClear
              disabled={!wards.length}
            >
              {wards.map((ward) => (
                <Option key={ward.code} value={ward.code}>
                  {ward.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Form.Item
          name="sub_address"
          label="Địa Chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item name="note" label="Ghi Chú">
          <Input.TextArea placeholder="Nhập ghi chú (nếu có)" rows={3} />
        </Form.Item>
        <Form.Item
          name="paymentMethod"
          label="Phương Thức Thanh Toán"
          initialValue={defaultMethod || "cod"}
          rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán!" }]}
        >
          <Radio.Group onChange={handlePaymentChange} value={selectedPaymentMethod}>
            <Radio value="cod">Thanh toán sau khi nhận hàng</Radio>
            <Radio value="paypal">Thanh toán bằng PayPal</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
      <div className="flex flex-col justify-center mt-4">
        {selectedPaymentMethod === "cod" && (
          <Button
            type="default"
            onClick={handlePaymentCOD}
            style={{ width: "100%" }}
          >
            Thanh toán sau khi nhận hàng
          </Button>
        )}
        {selectedPaymentMethod === "paypal" && (
          <Button
            type="primary"
            onClick={handlePaymentPaypal}
            style={{ width: "100%" }}
          >
            <FaPaypal />Thanh toán bằng PayPal
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;
