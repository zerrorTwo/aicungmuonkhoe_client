import UnitInput from '@/components/ui/unit-input';
import CustomLabel from '@/components/ui/custom-label';
import CustomDatePicker from '@/components/date-picker';
import type { Range } from '@/components/range-picker';
import { DATE_TIME_FORMAT } from '@/constants/common.constant';
import { VALIDATION_MESSAGE } from '@/constants/message.constant';
import { BloodSugarTabs } from '@/enum/health';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createConclusion,
  getDetailConclusionByModelPagination,
  resetConclusionStatus,
  updateConclusion,
  watchConclusionCreateStatus,
  watchConclusionError,
  watchConclusionLoading,
  watchConclusionPagination
} from '@/store/slices/conclusionSlice';
import type { Item, Sort } from '@/types/common';
import type { Conclusion } from '@/types/health';
import { clampDateToRange } from '@/utils/health';
import { css } from '@emotion/react';
import { Button, Form } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { isDesktop, isMobile } from 'react-device-detect';

type BloodSugarUpdateProps = {
  rangeDate: Range;
  activeTab: BloodSugarTabs;
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

export default function BloodSugarUpdate({
  rangeDate,
  activeTab,
  item,
  healthDocumentId,
  createdBy,
  onStartDateChange,
  onEndDateChange,
  filter,
  items
}: BloodSugarUpdateProps) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(watchConclusionLoading);
  const createSuccess = useAppSelector(watchConclusionCreateStatus);
  const conclusionPagination = useAppSelector(watchConclusionPagination);
  const errorMessage = useAppSelector(watchConclusionError);

  const [form] = Form.useForm<FormValues>();

  const validateStepRef = useRef(0);

  const [validateMessage, setValidateMessage] = useState<ReactNode>();

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
          model: activeTab,
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
          createdBy
        })
      );
    }

    await dispatch(
      getDetailConclusionByModelPagination({
        model: activeTab,
        limit: conclusionPagination.limitPage,
        id: healthDocumentId,
        activeTab,
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
    switch (activeTab) {
      case BloodSugarTabs.Hungry: {
        if (value >= 7) {
          return (
            <div>
              Bạn đang nhập{' '}
              <strong>Đường huyết (glucose) lúc đói rất cao.</strong>
              <div>Vui lòng kiểm tra lại dữ liệu đã nhập.</div>
            </div>
          );
        }

        if (value <= 3.9) {
          return (
            <div>
              <strong>Đường huyết (glucose) lúc đói rất thấp.</strong>
              <div>Vui lòng kiểm tra lại dữ liệu đã nhập.</div>
            </div>
          );
        }

        return null;
      }
      case BloodSugarTabs.TwoHours: {
        if (value >= 11.1) {
          return (
            <div>
              Bạn đang nhập chỉ số{' '}
              <strong>
                đường huyết sau 2 giờ khi làm nghiệm pháp dung nạp glucose với
                75g glucose bằng đường uống cao.
              </strong>
              <div>Vui lòng kiểm tra lại dữ liệu đã nhập.</div>
            </div>
          );
        }

        return null;
      }
      case BloodSugarTabs.HbA1c: {
        if (value >= 6.5) {
          return (
            <div>
              Bạn đang nhập chỉ số đường huyết <strong>HbA1c cao.</strong>
              <div>Vui lòng kiểm tra lại dữ liệu đã nhập.</div>
            </div>
          );
        }

        if (value < 2.9) {
          return (
            <div>
              Bạn đang nhập chỉ số đường huyết <strong>HbA1c thấp.</strong>
              <div>Vui lòng kiểm tra lại dữ liệu đã nhập.</div>
            </div>
          );
        }

        return null;
      }
    }
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
    } else if (createSuccess) {
      console.log('Cập nhật thành công!');
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

      const hungry = items.find(
        (item) =>
          item.dataType === 'Number' && String(item.ingredient) === 'Hungy'
      );
      if (hungry) {
        form.setFieldsValue({ value: hungry.value.toString() });
      }

      const twoHours = items.find(
        (item) =>
          item.dataType === 'Number' && String(item.ingredient) === '2hrs'
      );
      if (twoHours) {
        form.setFieldsValue({ value: twoHours.value.toString() });
      }

      const hba1c = items.find(
        (item) =>
          item.dataType === 'Number' && String(item.ingredient) === 'HbA1c'
      );
      if (hba1c) {
        form.setFieldsValue({ value: hba1c.value.toString() });
      }
    }
  }, [items, form, activeTab]);

  return (
    <div css={rootStyles}>
      <div css={headerStyles}>Cập nhật chỉ số đường huyết</div>
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
              label={
                activeTab === BloodSugarTabs.Hungry
                  ? 'Đường huyết lúc đói'
                  : activeTab === BloodSugarTabs.TwoHours
                    ? 'Đường huyết sau 2 giờ uống'
                    : 'Đường huyết HbA1c'
              }
              bold
              required
              tooltip='Chỉ số đường huyết được thực hiện khi bệnh nhân không ăn ít nhất trên 8 giờ. Chỉ số này giúp đánh giá tình trạng bệnh đái tháo đường.'
              tooltipOffset={{
                x: -151,
                y: 8
              }}
              arrowOffset={{
                x: 68,
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
            parentForm={form}
            acceptDecimal
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
