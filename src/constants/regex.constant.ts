export const phoneNumberRegex = /^0[3|5|7|8|9][0-9]{8,9}$/;
export const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
export const numberRegex = /^\d+$/;
export const decimalRegex = /^\d*\.?\d{0,2}$/;
export const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯƠẠ-ỹ\s]+$/;
export const commaDecimalRegex	 = /^[\d.,]*$/; 