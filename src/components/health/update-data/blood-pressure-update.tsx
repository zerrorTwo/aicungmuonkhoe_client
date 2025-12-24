import UnitInput from '@/components/ui/unit-input';
import type { Range } from '@/components/range-picker';
import { DATE_TIME_FORMAT } from '@/constants/common.constant';
import { VALIDATION_MESSAGE } from '@/constants/message.constant';
import { BloodPressureTabs } from '@/enum/health';
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
import { css } from '@emotion/react';
import { Button, Form } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { isDesktop, isMobile } from 'react-device-detect';
import CustomLabel from '@/components/ui/custom-label';
import CustomDatePicker from '@/components/date-picker';
import { clampDateToRange } from '@/utils/health';
import { TimePicker } from 'antd';

const MobileTimePicker = TimePicker;
const DesktopTimePicker = TimePicker;

type BloodPressureUpdateProps = {
  rangeDate: Range;
  activeTab: BloodPressureTabs;
  item?: Conclusion;
  healthDocumentId?: string;
  createdBy?: string;
  onStartDateChange: (date: Dayjs) => void;
  onEndDateChange: (date: Dayjs) => void;
  filter?: Sort;
  items?: Item[];
};

type FormValues = {
  time?: string;
  date: Dayjs;
  healthDocumentId?: string;
  valueSys: string;
  valueDia: string;
  indicator: string;
};

export default function BloodPressureUpdate({
  rangeDate,
  activeTab,
  item,
  healthDocumentId,
  createdBy,
  onStartDateChange,
  onEndDateChange,
  filter,
  items
}: BloodPressureUpdateProps) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(watchConclusionLoading);
  const createSuccess = useAppSelector(watchConclusionCreateStatus);
  const conclusionPagination = useAppSelector(watchConclusionPagination);
  const [form] = Form.useForm<FormValues>();

  const validateStepRef = useRef(0);

  const [validateMessage, setValidateMessage] = useState<ReactNode>();
  const errorMessage = useAppSelector(watchConclusionError);

  const handleFinish = async (values: FormValues) => {
    const { time, date, valueSys, valueDia, indicator } = values;

    const hour = time ? Number(time.split(':')[0]) : 0;
    const minute = time ? Number(time.split(':')[1]) : 0;

    const validateMess = validateInput(Number(valueSys), Number(valueDia));
    setValidateMessage(validateMess);

    if (Number(valueDia) > Number(valueSys)) {
      return;
    }

    if (validateMess && validateStepRef.current === 0) {
      validateStepRef.current = 1;
      return;
    }

    const dateTime = date
      .set('hour', 0)
      .set('minute', 0)
      .add(hour, 'hour')
      .add(minute, 'minute')
      .format(DATE_TIME_FORMAT);

    if (!item?.id) {
      await dispatch(
        createConclusion({
          model: activeTab,
          dateTime,
          healthDocumentId,
          createdBy,
          valueSys: Number(valueSys),
          valueDia: Number(valueDia),
          indicator
        })
      );
    } else {
      if (activeTab === BloodPressureTabs.Home) {
        await dispatch(
          updateConclusion({
            ...item,
            time: `${time}:00`,
            date: date.format(DATE_TIME_FORMAT),
            valueSys: Number(valueSys),
            valueDia: Number(valueDia),
            indicator,
            createdBy
          })
        );
      } else {
        await dispatch(
          updateConclusion({
            ...item,
            date: date.format(DATE_TIME_FORMAT),
            valueSys: Number(valueSys),
            valueDia: Number(valueDia),
            indicator,
            createdBy
          })
        );
      }
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

  const validateInput = (sys: number, dia: number) => {
    if (dia > sys) {
      return (
        <div>
          <strong>Huyết áp Tâm thu luôn lớn hơn Huyết áp Tâm trương.</strong>{' '}
          Tuy nhiên bạn đang nhập "Huyết áp Tâm thu" nhỏ hơn "Huyết áp Tâm
          trương". Vui lòng kiểm tra lại dữ liệu đã nhập.
        </div>
      );
    }

    if (sys > 160) {
      return (
        <div>
          <strong>Bạn đang nhập Huyết áp Tâm thu cao.</strong>
          <div>Vui lòng kiểm tra lại dữ liệu đã nhập.</div>
        </div>
      );
    }

    if (dia < 50) {
      return (
        <div>
          <strong>Bạn đang nhập Huyết áp Tâm trương thấp.</strong>
          <div>Vui lòng kiểm tra lại dữ liệu đã nhập.</div>
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        date: dayjs(item.date),
        valueSys: item.valueSys?.toString() || '',
        valueDia: item.valueDia?.toString() || '',
        time: item.time || '00:00'
      });
    } else {
      form.setFieldsValue({
        date: dayjs(),
        time: dayjs().format('HH:mm')
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

      const sys = items.find(
        (item) =>
          item.dataType === 'Number' && String(item.ingredient) === 'SYS'
      );
      if (sys) {
        form.setFieldsValue({ valueSys: sys.value.toString() });
      }

      const dia = items.find(
        (item) =>
          item.dataType === 'Number' && String(item.ingredient) === 'DIA'
      );
      if (dia) {
        form.setFieldsValue({ valueDia: dia.value.toString() });
      }
    }
  }, [items, form]);

  return (
    <div css={rootStyles}>
      <div css={headerStyles}>Cập nhật chỉ số huyết áp</div>
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        onValuesChange={() => (validateStepRef.current = 0)}
      >
        {activeTab === BloodPressureTabs.Home && (
          <Form.Item
            label={<CustomLabel label='Giờ đo' required bold />}
            required={false}
            name='time'
            rules={[
              {
                required: true,
                message: VALIDATION_MESSAGE.UPDATE_INDEX
              }
            ]}
          >
            {isMobile ? (
              <MobileTimePicker placeholder='Giờ đo' />
            ) : (
              <DesktopTimePicker placeholder='Giờ đo' />
            )}
          </Form.Item>
        )}

        <Form.Item
          label={<CustomLabel label='Ngày đo' required bold />}
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
              label='Huyết áp Tâm thu (SYS)'
              bold
              required
              tooltip='Huyết áp tối đa'
              tooltipOffset={{
                x: -65,
                y: 8
              }}
            />
          }
          required={false}
          name='valueSys'
          rules={[
            {
              required: true,
              message: VALIDATION_MESSAGE.UPDATE_INDEX
            }
          ]}
        >
          <UnitInput
            placeholder='Nhập chỉ số'
            defaultUnit='mmHg'
            parentForm={form}
            onFocus={() => setValidateMessage(null)}
          />
        </Form.Item>

        <Form.Item
          label={
            <CustomLabel
              label='Huyết áp Tâm trương (DIA)'
              required
              bold
              tooltip='Huyết áp tối thiểu'
              tooltipOffset={{
                x: -79,
                y: 8
              }}
            />
          }
          required={false}
          name='valueDia'
          rules={[
            {
              required: true,
              message: VALIDATION_MESSAGE.UPDATE_INDEX
            }
          ]}
        >
          <UnitInput
            placeholder='Huyết áp Tâm trương (DIA)'
            defaultUnit='mmHg'
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
