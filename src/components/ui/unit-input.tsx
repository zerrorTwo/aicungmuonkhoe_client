import { css } from '@emotion/react';
import { Form, type FormInstance, Input, type InputProps, Select } from 'antd';
import { type ChangeEvent, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

const numberRegex = /^\d+$/;
const commaDecimalRegex = /^\d+([.,]\d*)?$/;

type UnitInputProps = InputProps & {
    acceptDecimal?: boolean;
    defaultUnit?: string;
    parentForm: FormInstance;
    unitFormName?: string | string[];
    units?: Array<{ label: string; value: string }>;
};

export default function UnitInput({
    acceptDecimal = false,
    defaultUnit,
    parentForm,
    unitFormName = 'indicator',
    units = [],
    onChange,
    ...props
}: UnitInputProps) {
    const [value, setValue] = useState('');
    const [unit, setUnit] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (
            newValue === '' ||
            (acceptDecimal ? commaDecimalRegex : numberRegex).test(newValue)
        ) {
            setValue(newValue);
            onChange?.(e);
        }
    };

    useEffect(() => {
        if (
            value !== '' &&
            !(acceptDecimal ? commaDecimalRegex : numberRegex).test(value)
        ) {
            setValue('');
        }
    }, [acceptDecimal, value]);

    useEffect(() => {
        if (props.value) {
            setValue(props.value.toString());
        }
    }, [props.value]);

    useEffect(() => {
        if (defaultUnit) {
            setUnit(defaultUnit);
        } else {
            if (Array.isArray(unitFormName)) {
                parentForm.setFieldsValue({
                    conclusions: {
                        [unitFormName[1]]: {
                            indicator: units?.[0]?.value ?? ''
                        }
                    }
                });
            } else {
                parentForm.setFieldsValue({ indicator: units?.[0]?.value ?? '' });
            }
            setUnit(units?.[0]?.value ?? '');
        }
    }, [defaultUnit, parentForm, units, unitFormName]);

    return (
        <div css={inputStyles}>
            <Input {...props} onChange={handleChange} value={value} />
            {defaultUnit ? (
                <Select
                    css={selectStyles}
                    options={[{ label: defaultUnit, value: defaultUnit }]}
                    value={unit}
                    disabled={props.disabled}
                />
            ) : (
                <Form.Item name={unitFormName}>
                    <Select
                        css={selectStyles}
                        options={units}
                        disabled={props.disabled}
                    />
                </Form.Item>
            )}
        </div>
    );
}

const inputStyles = css`
  position: relative;

  & > input {
    padding-right: 14rem !important;
    font-size: ${isMobile ? '1.4rem' : '1.8rem'};
  }
  .ant-input-outlined.ant-input-disabled {
    background-color: #ffffff !important;
    color: rgba(0, 0, 0, 0.88) !important;
  }
  .ant-input-suffix {
    display: none !important;
  }

  .ant-form-item {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0.4rem;
    margin-bottom: 0;
  }
`;

const selectStyles = css`
  width: ${isMobile ? '10rem' : '12rem'} !important;
  height: 3.2rem !important;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0.4rem;

  .ant-select-selection-item {
    font-weight: 700;
    text-align: right;
    font-size: ${isMobile ? '1.4rem' : '1.8rem'} !important;
  }
`;
