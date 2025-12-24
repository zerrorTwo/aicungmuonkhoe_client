import CustomLabel from '@/components/ui/custom-label';
import { VALIDATION_MESSAGE } from '@/constants/message.constant';
import { css } from '@emotion/react';
import { Button, Form } from 'antd';
import { isDesktop } from 'react-device-detect';
import UnitInput from '@/components/ui/unit-input';
import CustomDatePicker from '@/components/date-picker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect } from 'react';
import type { Range } from '@/components/range-picker';
import { DATE_TIME_FORMAT } from '@/constants/common.constant';
import { BMIAgeRange, BMIChildrenTabs } from '@/enum/health';
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

type BMIUpdateProps = {
  rangeDate: Range;
  healthDocumentId?: string;
  createdBy?: string;
  item?: Conclusion;
  ageRange?: BMIAgeRange;
  age?: number;
  activeTab?: BMIChildrenTabs;
  onStartDateChange: (date: Dayjs) => void;
  onEndDateChange: (date: Dayjs) => void;
  filter?: Sort;
  items?: Item[];
};

type FormValues = {
  time?: string;
  date: Dayjs;
  healthDocumentId?: string;
  value_height: string;
  value_weight: string;
};

export default function BMIUpdate({
  rangeDate,
  item,
  healthDocumentId,
  createdBy,
  ageRange,
  age,
  activeTab,
  onStartDateChange,
  onEndDateChange,
  filter,
  items
}: BMIUpdateProps) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(watchConclusionLoading);
  const createSuccess = useAppSelector(watchConclusionCreateStatus);
  const conclusionPagination = useAppSelector(watchConclusionPagination);
  const errorMessage = useAppSelector(watchConclusionError);

  const [form] = Form.useForm<FormValues>();

  let viewBy = ageRange;
  if (age !== undefined && age >= 0) {
    if (age < 2) {
      viewBy = BMIAgeRange.FROM_0_LESS_THAN_2;
    } else if (age < 5) {
      viewBy = BMIAgeRange.FROM_2_LESS_THAN_5;
    }
  }

  const handleFinish = async (values: FormValues) => {
    if (age !== undefined) {
      const { date, value_height, value_weight } = values;

      const normalizedValueHeight =
        typeof value_height === 'string' && value_height.includes(',')
          ? value_height.replace(',', '.')
          : value_height;

      const normalizedValueWeight =
        typeof value_weight === 'string' && value_weight.includes(',')
          ? value_weight.replace(',', '.')
          : value_weight;

      if (!item?.id) {
        await dispatch(
          createConclusion({
            model: BMIChildrenTabs.BMI,
            healthDocumentId,
            createdBy,
            dateTime: date.format(DATE_TIME_FORMAT),
            value_height: Number(normalizedValueHeight),
            value_weight: Number(normalizedValueWeight),
            ageType: viewBy
          })
        );
      } else {
        await dispatch(
          updateConclusion({
            ...item,
            model: BMIChildrenTabs.BMI,
            date: date.format(DATE_TIME_FORMAT),
            value_height: Number(normalizedValueHeight),
            value_weight: Number(normalizedValueWeight),
            ageType: viewBy,
            createdBy: createdBy
          })
        );
      }

      await dispatch(
        getDetailConclusionByModelPagination({
          model: BMIChildrenTabs.BMI,
          limit: conclusionPagination.limitPage,
          id: healthDocumentId,
          activeTab: activeTab,
          ageType: viewBy,
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
    }
  };

  const handleSubmit = () => {
    form.submit();
  };

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        healthDocumentId,
        date: dayjs(item.date),
        value_height: item.valueHeight?.toString() || '',
        value_weight: item.valueWeight?.toString() || ''
      });
    } else {
      form.setFieldsValue({
        date: dayjs()
      });
    }
  }, [form, item, healthDocumentId]);

  useEffect(() => {
    if (loading) return;

    if (errorMessage && createSuccess === false) {
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

      const height = items.find(
        (item) =>
          item.dataType === 'Number' && String(item.ingredient) === 'Height'
      );
      if (height) {
        form.setFieldsValue({ value_height: height.value.toString() });
      }

      const weight = items.find(
        (item) =>
          item.dataType === 'Number' && String(item.ingredient) === 'Weight'
      );
      if (weight) {
        form.setFieldsValue({ value_weight: weight.value.toString() });
      }
    }
  }, [items, form]);

  return (
    <div css={rootStyles}>
      <div css={headerStyles}>Cập nhật chỉ số BMI</div>
      <Form form={form} layout='vertical' onFinish={handleFinish}>
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
          label={<CustomLabel label='Chiều cao' bold required />}
          required={false}
          name='value_height'
          rules={[
            {
              required: true,
              message: VALIDATION_MESSAGE.UPDATE_INDEX
            }
          ]}
        >
          <UnitInput
            placeholder='Nhập chỉ số (Ví dụ: 50 cm)'
            parentForm={form}
            defaultUnit='cm'
            acceptDecimal
          />
        </Form.Item>

        <Form.Item
          label={<CustomLabel label='Cân nặng' bold required />}
          required={false}
          name='value_weight'
          rules={[
            {
              required: true,
              message: VALIDATION_MESSAGE.UPDATE_INDEX
            }
          ]}
        >
          <UnitInput
            placeholder='Nhập chỉ số (Ví dụ: 10 kg)'
            parentForm={form}
            defaultUnit='kg'
            acceptDecimal
          />
        </Form.Item>

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
