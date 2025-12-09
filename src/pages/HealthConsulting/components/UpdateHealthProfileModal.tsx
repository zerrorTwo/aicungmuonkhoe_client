import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, InputNumber, Radio } from 'antd';
import { 
  User, 
  Calendar, 
  Ruler, 
  Weight, 
  Activity, 
  Briefcase, 
  Clock, 
  ChevronDown,
  Save,
  X
} from 'lucide-react';
import dayjs from 'dayjs';

interface UpdateHealthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any; // Dữ liệu ban đầu để fill vào form
  onUpdate: (values: any) => void;
  accounts: any[]; // List danh sách thành viên để chọn
}

export const UpdateHealthProfileModal: React.FC<UpdateHealthProfileModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onUpdate,
  accounts
}) => {
  const [form] = Form.useForm();

  // Reset form khi mở modal hoặc data thay đổi
  useEffect(() => {
    if (isOpen && initialData) {
      form.setFieldsValue({
        ...initialData,
        DOB: initialData.DOB ? dayjs(initialData.DOB) : null,
      });
    } else if (isOpen) {
      form.resetFields();
    }
  }, [isOpen, initialData, form]);

  const handleAccountChange = (value: string) => {
    const selectedAccount = accounts.find((acc) => acc.value === value);
    console.log("🚀 ~ handleAccountChange ~ selectedAccount:", selectedAccount)
    if (selectedAccount?.original) {
      const { original: data } = selectedAccount;
      // Helper to map gender name to ID string
      const getGenderValue = (name?: string) => {
        if (!name) return '3'; // Default to Other
        const upper = name.toUpperCase();
        if (upper === 'NAM' || upper === 'MALE') return '1';
        if (upper === 'NỮ' || upper === 'FEMALE') return '2';
        return '3';
      };

      form.setFieldsValue({
        fullName: data.FULL_NAME,
        DOB: data.DOB ? dayjs(data.DOB) : null,
        gender: getGenderValue(data.GENDER?.NAME),
        height: data.HEIGHT,
        weight: data.WEIGHT,
        job: data.JOB,
        exerciseFreq: data.EXERCISE_FREQUENCY,
        durationWorkday: data.DATE_WORKDAY,
        durationRestday: data.DATE_OFF,
      });
    }
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onUpdate(values);
      onClose();
    });
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      closeIcon={null}
      className="update-profile-modal"
      styles={{ 
        content: { 
          padding: 0, 
          borderRadius: '24px', 
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
        } 
      }}
    >
      {/* --- Header --- */}
      <div className="bg-white px-8 py-6 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
        <div>
            <h2 className="text-xl font-bold text-slate-800 m-0">Cập nhật thông tin</h2>
            <p className="text-slate-400 text-sm m-0 mt-1">Điều chỉnh chỉ số để nhận tư vấn chính xác nhất</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full">
            <X size={24} />
        </button>
      </div>

      {/* --- Body Form --- */}
      <div className="p-8 bg-[#FAFAFA] max-h-[70vh] overflow-y-auto custom-scrollbar">
        <Form
          form={form}
          layout="vertical"
          size="large"
          className="flex flex-col gap-2"
        >
          {/* Section 1: Định danh */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-4">
            <div className="flex items-center gap-2 mb-4 text-emerald-600 font-medium text-sm uppercase tracking-wide">
                <User size={16} /> Thông tin định danh
            </div>
            
            <Form.Item 
                name="healthId" 
                label={<span className="font-semibold text-slate-700">Chọn thành viên</span>}
                rules={[{ required: true, message: 'Vui lòng chọn thành viên' }]}
            >
              <Select 
                options={accounts} 
                placeholder="Chọn người cần cập nhật"
                suffixIcon={<ChevronDown size={16} />}
                className="font-medium"
                onChange={handleAccountChange}
              />
            </Form.Item>

            <Form.Item 
                name="fullName" 
                label={<span className="font-semibold text-slate-700">Tên hiển thị</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
            >
              <Input prefix={<User size={18} className="text-slate-400 mr-2"/>} placeholder="Nhập tên hiển thị" />
            </Form.Item>

             <Form.Item 
                name="job" 
                label={<span className="font-semibold text-slate-700">Bạn là?</span>}
                rules={[{ required: true, message: 'Vui lòng chọn nghề nghiệp' }]}
            >
              <Select 
                placeholder="Học sinh / Sinh viên / Nhân viên văn phòng..."
                suffixIcon={<Briefcase size={16} className="text-slate-400"/>}
                options={[
                    { value: 'student', label: 'Học sinh / Sinh viên' },
                    { value: 'office', label: 'Nhân viên văn phòng' },
                    { value: 'worker', label: 'Lao động tự do' },
                    { value: 'athlete', label: 'Vận động viên' },
                ]}
              />
            </Form.Item>
          </div>

          {/* Section 2: Chỉ số cơ thể */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-4">
            <div className="flex items-center gap-2 mb-4 text-blue-600 font-medium text-sm uppercase tracking-wide">
                <Activity size={16} /> Chỉ số cơ thể
            </div>

            <div className="grid grid-cols-2 gap-5">
                <Form.Item 
                    name="DOB" 
                    label={<span className="font-semibold text-slate-700">Ngày sinh</span>}
                    rules={[{ required: true, message: 'Chọn ngày sinh' }]}
                >
                <DatePicker 
                    format="DD/MM/YYYY" 
                    className="w-full" 
                    placeholder="Chọn ngày"
                    suffixIcon={<Calendar size={18} className="text-slate-400"/>}
                />
                </Form.Item>

                <Form.Item 
                    name="gender" 
                    label={<span className="font-semibold text-slate-700">Giới tính</span>}
                    rules={[{ required: true }]}
                >
                <Select placeholder="Chọn" suffixIcon={<User size={16} className="text-slate-400"/>}>
                    <Select.Option value="1">Nam</Select.Option>
                    <Select.Option value="2">Nữ</Select.Option>
                    <Select.Option value="3">Khác</Select.Option>
                </Select>
                </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <Form.Item 
                    name="height" 
                    label={<span className="font-semibold text-slate-700">Chiều cao</span>}
                    rules={[{ required: true, message: 'Nhập chiều cao' }]}
                >
                  <InputNumber 
                    className="w-full !rounded-xl" 
                    min={0} 
                    max={300}
                    placeholder="0"
                    controls={false}
                    addonBefore={<Ruler size={16} className="text-slate-400"/>}
                    addonAfter="cm"
                  />
                </Form.Item>

                <Form.Item 
                    name="weight" 
                    label={<span className="font-semibold text-slate-700">Cân nặng</span>}
                    rules={[{ required: true, message: 'Nhập cân nặng' }]}
                >
                   <InputNumber 
                    className="w-full !rounded-xl" 
                    min={0} 
                    max={300} 
                    placeholder="0"
                    controls={false}
                    addonBefore={<Weight size={16} className="text-slate-400"/>}
                    addonAfter="kg"
                  />
                </Form.Item>
            </div>
          </div>

          {/* Section 3: Vận động */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-orange-600 font-medium text-sm uppercase tracking-wide">
                <Activity size={16} /> Thói quen vận động
            </div>

            <Form.Item 
                name="exerciseFreq" 
                label={<span className="font-semibold text-slate-700">Tần suất tập luyện</span>}
                rules={[{ required: true }]}
            >
                <Select placeholder="Chọn tần suất">
                <Select.Option value="DAILY">Hàng ngày</Select.Option>
                <Select.Option value="WEEKLY">Hàng tuần</Select.Option>
                <Select.Option value="BIWEEKLY">Hai tuần một lần</Select.Option>
                <Select.Option value="TRIWEEKLY">Ba tuần một lần</Select.Option>
                <Select.Option value="MONTHLY">Hàng tháng</Select.Option>
                <Select.Option value="BIMONTHLY">Hai tháng một lần</Select.Option>
                <Select.Option value="QUARTERLY">Ba tháng một lần</Select.Option>
                <Select.Option value="EVERY_FOUR_MONTHS">Bốn tháng một lần</Select.Option>
                <Select.Option value="EVERY_FIVE_MONTHS">Năm tháng một lần</Select.Option>
                <Select.Option value="SEMIANNUALLY">Sáu tháng một lần</Select.Option>
                <Select.Option value="ANNUALLY">Hàng năm</Select.Option>
                <Select.Option value="NONE">Không</Select.Option>
                </Select>
            </Form.Item>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
    <label className="block font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <Clock size={16} className="text-slate-500"/> Thời gian mỗi lần vận động
    </label>
    <div className="grid grid-cols-2 gap-4">
        
        {/* --- KHỐI NGÀY LÀM VIỆC --- */}
        <div className="bg-white p-2 rounded-lg border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <span className="text-xs text-slate-400 block mb-1">Ngày làm việc</span>
            <div className="flex items-center">
                {/* Đưa Form.Item vào đây, bọc trực tiếp InputNumber */}
                <Form.Item 
                    name="durationWorkday" 
                    noStyle // Giữ noStyle để không bị vỡ layout flex
                    rules={[{ required: true, message: 'Nhập phút' }]}
                >
                    <InputNumber 
                        variant="borderless" 
                        className="!p-0 !w-full font-bold text-slate-700 text-lg" 
                        placeholder="0"
                        controls={false}
                        min={0}
                    />
                </Form.Item>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">phút</span>
            </div>
        </div>

        {/* --- KHỐI NGÀY NGHỈ --- */}
        <div className="bg-white p-2 rounded-lg border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <span className="text-xs text-slate-400 block mb-1">Ngày nghỉ</span>
            <div className="flex items-center">
                 {/* Đưa Form.Item vào đây */}
                <Form.Item 
                    name="durationRestday" 
                    noStyle
                    rules={[{ required: true, message: 'Nhập phút' }]}
                >
                     <InputNumber 
                        variant="borderless" 
                        className="!p-0 !w-full font-bold text-slate-700 text-lg" 
                        placeholder="0"
                        controls={false}
                        min={0}
                    />
                </Form.Item>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">phút</span>
            </div>
        </div>
        
    </div>
</div>
          </div>
        </Form>
      </div>

      {/* --- Footer Actions --- */}
      <div className="bg-white p-6 border-t border-slate-100 flex gap-4">
        <Button 
            size="large" 
            className="flex-1 rounded-xl h-12 font-medium bg-slate-100 hover:bg-slate-200 border-none text-slate-600"
            onClick={onClose}
        >
            Bỏ qua
        </Button>
        <Button 
            type="primary" 
            size="large" 
            className="flex-1 rounded-xl h-12 font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 border-none flex items-center justify-center gap-2"
            onClick={handleSubmit}
        >
            <Save size={18} />
            Cập nhật hồ sơ
        </Button>
      </div>
    </Modal>
  );
};