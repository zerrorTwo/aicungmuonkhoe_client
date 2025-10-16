export interface UserInfo {
    USER_ID: number;
    FULL_NAME: string;
    EMAIL: string;
    PHONE: string;
    DOB: string;
    GENDER: string;
    PROVINCE: string | null;
    PROVINCE_ID?: number | null;
    AVATAR?: string;
    IS_ACTIVE?: boolean;
    IS_ADMIN?: boolean;
    HEALTH_DOCUMENT?: {
      ID: number;
      HEIGHT?: string;
      WEIGHT?: string;
      HEALTH_STATUS?: string;
      EXERCISE_FREQUENCY?: string;
    };
}