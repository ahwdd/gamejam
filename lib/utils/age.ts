export function calculateAge(dateOfBirth: Date | string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export function isMinor(dateOfBirth: Date | string): boolean {
  return calculateAge(dateOfBirth) < 18;
}

export function isAgeValid(
  dateOfBirth: Date | string,
  minAge: number = 4,
  maxAge: number = 18
): boolean {
  const age = calculateAge(dateOfBirth);
  return age >= minAge && age <= maxAge;
}