/**
 * Calculate age from date of birth
 * @param dateOfBirth - Date string in format YYYY-MM-DD or DD/MM/YYYY
 * @returns Age in years
 */
export const calculateAge = (dateOfBirth: string): number => {
  if (!dateOfBirth) return 0;

  // Parse date - support both YYYY-MM-DD and DD/MM/YYYY formats
  let dob: Date;

  if (dateOfBirth.includes("/")) {
    // DD/MM/YYYY format
    const [day, month, year] = dateOfBirth.split("/").map(Number);
    dob = new Date(year, month - 1, day);
  } else if (dateOfBirth.includes("-")) {
    // YYYY-MM-DD format
    dob = new Date(dateOfBirth);
  } else {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  // Adjust if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

/**
 * Check if user is under 5 years old
 */
export const isUnderFiveYears = (dateOfBirth: string): boolean => {
  return calculateAge(dateOfBirth) < 5;
};

/**
 * Format age for display
 */
export const formatAge = (dateOfBirth: string): string => {
  const age = calculateAge(dateOfBirth);
  if (age === 0) return "Dưới 1 tuổi";
  return `${age} tuổi`;
};
