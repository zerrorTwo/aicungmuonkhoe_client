import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ModalOverlay from "./ModalOverlay";
import { showToast } from "../../utils/toast";

interface LinkedAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  userEmail?: string;
}

const LinkedAccountModal: React.FC<LinkedAccountModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userEmail = "lechinghia404@gmail.com",
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (email) {
      onSubmit(email);
      setEmail("");
    } else {
      showToast.warning("Vui lòng nhập email/số điện thoại");
    }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-[hsl(158,64%,52%)] mb-4">
          Thêm tài khoản bạn muốn liên kết
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Lời mời của bạn sẽ được hiển thị dưới tên của bạn (SĐT của bạn) tới
          SĐT/Email mà bạn muốn liên kết.
        </p>

        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-700">
            Email của bạn
          </Label>
          <Input value={userEmail} className="mt-1 bg-gray-50" readOnly />
        </div>

        <div className="mb-6">
          <Label className="text-sm font-medium">
            Nhập SĐT/email bạn muốn liên kết{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Nhập SĐT/email bạn muốn liên kết"
            className="mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button
          className="cursor-pointer w-full bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,45%)] text-white"
          onClick={handleSubmit}
        >
          Gửi lời mời
        </Button>
      </div>
    </ModalOverlay>
  );
};

export default LinkedAccountModal;
