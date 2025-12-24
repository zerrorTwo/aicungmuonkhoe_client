export enum AccountType {
  SelfManager = 'self',
  Link = 'link'
}

export enum BloodPressureTabs {
  Hospital = 'HOSPITAL',
  Home = 'HOME'
}

export enum BloodSugarTabs {
  Hungry = 'HUNGRY',
  TwoHours = '2_HOURS',
  HbA1c = 'HBA1C'
}

export enum KidneyFunctionTabs {
  Ure = 'URE',
  Creatinine = 'CREA'
}

export enum LiverFunctionTabs {
  SGOT = 'SGOT',
  SGPT = 'SGPT'
}

export enum BloodLipidTabs {
  Cholesterol = 'CHOL',
  LDL = 'LDL',
  HDL = 'HDL',
  Triglyceride = 'TRI'
}

export enum BMIChildrenTabs {
  Weight = 'WEIGHT',
  Height = 'HEIGHT',
  WeightHeight = 'WEIGHT_HEIGHT',
  BMI = 'BMI'
}

export enum HealthIndex {
  BloodPressure = 'BloodPressure',
  BloodSugar = 'BloodSugar',
  KidneyFunction = 'KidneyFunction',
  LiverFunction = 'LiverFunction',
  BloodLipid = 'BloodLipid',
  AcidUric = 'AcidUric',
  BMI = 'BMI'
}

export enum Tabs {
  Home = '/',
  HealthTracking = '/health-tracking',
  HealthAdvice = '/health-advice',
  MealChecking = '/meal-planner',
  HealthHistory = '/health-history',
  Goal = '/goal',
  ProfileAccount = '/profile',
  LinkAccount = '/account-link',
  HealthInfo = '/health-info'
}

export enum HealthAdviceTabs {
  Eating,
  Sleep,
  Feeling,
  Water,
  PhysicalActivity,
  DevelopingFeature
}

export enum EatingTabs {
  SaltSugar = 'salt-sugar',
  PersonalMenu = 'personal-menu',
  NutritionalStandards = 'nutritional-standards',
  Food = 'food',
}

export enum BMIAgeRange {
  FROM_0_LESS_THAN_5 = 'FROM_0_LESS_THAN_5',
  FROM_0_LESS_THAN_2 = 'FROM_0_LESS_THAN_2',
  FROM_2_LESS_THAN_5 = 'FROM_2_LESS_THAN_5',
  FROM_5_LESS_THAN_12 = 'FROM_5_LESS_THAN_12',
  FROM_12_LESS_THAN_20 = 'FROM_12_LESS_THAN_20',
  FROM_20_LESS_THEN_70 = 'FROM_20_LESS_THEN_70',
  EQUAL_MORE_THAN_70 = 'EQUAL_MORE_THAN_70'
}

export enum BMISliderAgeRange {
  FROM_0_LESS_THAN_5 = 'FROM_0_LESS_THAN_5',
  FROM_5_LESS_THAN_12 = 'FROM_5_LESS_THAN_12',
  FROM_12_LESS_THAN_20 = 'FROM_12_LESS_THAN_20',
  FROM_20_LESS_THEN_70 = 'FROM_20_LESS_THEN_70',
  EQUAL_MORE_THAN_70 = 'EQUAL_MORE_THAN_70'
}

export enum BMIGender {
  Male = 'nam',
  Female = 'nu'
}
