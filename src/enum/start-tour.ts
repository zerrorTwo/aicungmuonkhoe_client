export const StartTourModule = {
  HOME: "HOME",
  HEALTH_TRACKING: "HEALTH_TRACKING",
  HEALTH_CONSULTING: "HEALTH_CONSULTATION",
  MEAL_PLANNER: "MEAL_PLANNER",
  HEALTH_HISTORY: "HEALTH_HISTORY",
  YOUR_GOAL: "YOUR_GOAL",
} as const

export type StartTourModule =
  (typeof StartTourModule)[keyof typeof StartTourModule]
