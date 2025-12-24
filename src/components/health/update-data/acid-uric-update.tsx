import CustomLabel from '@/components/ui/custom-label';
import { css } from '@emotion/react';
import { Button, Form } from 'antd';
import { isDesktop, isMobile } from 'react-device-detect';
import { VALIDATION_MESSAGE } from '@/constants/message.constant';
import dayjs, { type Dayjs } from 'dayjs';
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useMemo
} from 'react';
import UnitInput from '@/components/ui/unit-input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { watchUser } from '@/store/slices/authSlice';
import {
  createConclusion,
  getDetailConclusionByModelPagination,
  watchConclusionCreateStatus,
  watchConclusionLoading,
  watchConclusionPagination,
  resetConclusionStatus,
  updateConclusion,
  watchConclusionError
} from '@/store/slices/conclusionSlice';
import { clampDateToRange, getGender } from '@/utils/health';
import type { Range } from '@/components/range-picker';
import type { Conclusion } from '@/types/health';
import type { Sort, Item } from '@/types/common';
import { DATE_TIME_FORMAT } from '@/constants/common.constant';
import CustomDatePicker from '@/components/date-picker';

type AcidUricUpdateProps = {
  rangeDate: Range;
  item?: Conclusion;
  healthDocumentId?: string;
  createdBy?: string;
  onStartDateChange: (date: Dayjs) => void;
  onEndDateChange: (date: Dayjs) => void;
  filter?: Sort;
  items?: Item[];
};

type FormValues = {
  date: Dayjs;
  value: string;
  indicator: string;
  healthDocumentId: string;
};

export default function AcidUricUpdate({
  rangeDate,
  item,
  healthDocumentId,
  createdBy,
  onStartDateChange,
  onEndDateChange,
  filter,
  items
}: AcidUricUpdateProps) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(watchConclusionLoading);
  const user = useAppSelector(watchUser);
  const createSuccess = useAppSelector(watchConclusionCreateStatus);
  const conclusionPagination = useAppSelector(watchConclusionPagination);

  const [form] = Form.useForm<FormValues>();

  const validateStepRef = useRef(0);

  const [validateMessage, setValidateMessage] = useState<ReactNode>();
  const errorMessage = useAppSelector(watchConclusionError);

  const gender = useMemo(() => {
    return getGender(user);
  }, [user]);

  const handleFinish = async (values: FormValues) => {
    const { date, value, indicator } = values;

    const normalizedValue =
      typeof value === 'string' && value.includes(',')
        ? value.replace(',', '.')
        : value;

    const validateMess = validateInput(Number(normalizedValue));
    setValidateMessage(validateMess);

    if (validateMess && validateStepRef.current === 0) {
      validateStepRef.current = 1;
      return;
    }
    if (!item?.id) {
      await dispatch(
        createConclusion({
          model: 'AXIT_URIC',
          healthDocumentId,
          createdBy,
          dateTime: date.format(DATE_TIME_FORMAT),
          value: Number(normalizedValue),
          indicator
        })
      );
    } else {
      await dispatch(
        updateConclusion({
          ...item,
          date: date.format(DATE_TIME_FORMAT),
          value: Number(normalizedValue),
          indicator,
          createdBy: createdBy
        })
      );
    }
    await dispatch(
      getDetailConclusionByModelPagination({
        model: 'AXIT_URIC',
        limit: conclusionPagination.limitPage,
        id: healthDocumentId,
        activeTab: 'AXIT_URIC',
        sort: filter
      })
    );

    if (rangeDate.startDate && rangeDate.endDate) {
      const { startDate, endDate } = clampDateToRange(date, rangeDate);

      onStartDateChange(startDate!);
      onEndDateChange(endDate!);
    } else if (!rangeDate.startDate && !rangeDate.endDate) {
      const date = form.getFieldValue('date');
      onStartDateChange(date);
      onEndDateChange(date);
    }
  };

  const handleSubmit = () => {
    form.submit();
  };

  const validateInput = (value: number) => {
    if (value > 420) {
      return (
        <div>
          Bạn đang nhập <strong>Axit uric cao.</strong>
          <div>Vui lòng kiểm tra lại dữ liệu đã nhập.</div>
        </div>
      );
    }
    if (gender === 'nam') {
      if (value < 180) {
        return (
          <div>
            <strong>Axit uric thấp.</strong>
            <div>Vui lòng kiểm tra lại dữ liệu đã nhập.</div>
          </div>
        );
      }
    }
    if (gender === 'nu') {
      if (value < 150) {
        return (
          <div>
            <strong>Axit uric thấp.</strong>
            <div>Vui lòng kiểm tra lại dữ liệu đã nhập.</div>
          </div>
        );
      }
    }

    return null;
  };

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        date: dayjs(item.date),
        value: item.value?.toString() || ''
      });
    } else {
      form.setFieldsValue({
        date: dayjs()
      });
    }
  }, [form, item]);

  useEffect(() => {
    if (loading) return;

    if (createSuccess === false && errorMessage) {
      console.error('Cập nhật thất bại:', errorMessage);
      // TODO: Show error notification (e.g., using Ant Design message or notification)
    } else if (createSuccess) {
      console.log('Cập nhật thành công!');
      // TODO: Show success notification
      dispatch(resetConclusionStatus());
    }
  }, [loading, errorMessage, createSuccess, dispatch]);

  useEffect(() => {
    if (items && items.length > 0) {
      const date = items.find((item) => item.dataType === 'Date');
      if (date) {
        const dateValue = dayjs(date.value, 'DD/MM/YYYY');
        if (dateValue.isValid()) {
          form.setFieldsValue({ date: dateValue });
        }
      }

      const number = items.find((item) => item.dataType === 'Number');
      if (number) {
        form.setFieldsValue({ value: number.value?.toString() || '' });
      }
    }
  }, [items, form]);

  return (
    <div css={rootStyles}>
      <div css={headerStyles}>Cập nhật chỉ số Axit uric</div>
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        onValuesChange={() => (validateStepRef.current = 0)}
      >
        <Form.Item
          label={<CustomLabel label='Ngày đo' bold required />}
          required={false}
          name='date'
          rules={[
            {
              required: true,
              message: VALIDATION_MESSAGE.UPDATE_INDEX
            }
          ]}
        >
          <CustomDatePicker
            placeholder='Ngày đo'
            disabledDate={dayjs()}
            disabledType='max'
          />
        </Form.Item>

        <Form.Item
          label={
            <CustomLabel
              label='Axit uric'
              required
              bold
              tooltip='Chỉ số quan trọng để đánh giá nguy cơ gây ra các bệnh lý như gout, và sỏi thận'
              tooltipOffset={{
                x: -67,
                y: 8
              }}
              arrowOffset={{
                x: -15,
                y: 0
              }}
            />
          }
          required={false}
          name='value'
          rules={[
            {
              required: true,
              message: VALIDATION_MESSAGE.UPDATE_INDEX
            }
          ]}
        >
          <UnitInput
            placeholder='Nhập chỉ số'
            acceptDecimal
            parentForm={form}
            onFocus={() => setValidateMessage(null)}
          />
        </Form.Item>

        {validateMessage && (
          <div css={warningStyles}>
            <div>
              {/* <Warning /> */}
              Cảnh báo
            </div>
            {validateMessage}
          </div>
        )}

        <Button
          css={buttonStyles}
          shape='round'
          type='primary'
          size='large'
          block
          onClick={handleSubmit}
          loading={loading}
        >
          Cập nhật
        </Button>
      </Form>
    </div>
  );
}

const rootStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  form {
    width: 100%;
  }
`;

const headerStyles = css`
  font-weight: 800;
  font-size: ${isDesktop ? '3.2rem' : '1.8rem'};
  color: var(--text-label-color);
  padding-bottom: ${isDesktop ? '2.8rem' : ' 1rem'};
`;

const buttonStyles = css`
  margin-top: 1.6rem;
`;

const warningStyles = css`
  background-color: var(--light-orange-color);
  border-radius: 0.8rem;
  padding: 0.8rem;
  font-size: ${isMobile ? '1.4rem' : '1.8rem'};

  & > div:first-of-type {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-weight: 700;
    padding-bottom: 0.8rem;

    svg {
      width: ${isMobile ? '4rem' : '6rem'};
      height: ${isMobile ? '4rem' : '6rem'};
    }
  }
`;
