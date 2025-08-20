export enum Department {
  // Engineering
  COMPUTER_ENGINEERING = "COMPUTER_ENGINEERING",
  ELECTRICAL_ENGINEERING = "ELECTRICAL_ENGINEERING",
  CIVIL_ENGINEERING = "CIVIL_ENGINEERING",
  MECHANICAL_ENGINEERING = "MECHANICAL_ENGINEERING",
  CHEMICAL_ENGINEERING = "CHEMICAL_ENGINEERING",

  // Medical & Health
  PHYSIOTHERAPY = "PHYSIOTHERAPY",
  PHARMACY = "PHARMACY",

  // Science
  MICROBIOLOGY = "MICROBIOLOGY",
  AGRICULTURE = "AGRICULTURE",
  BIOTECHNOLOGY = "BIOTECHNOLOGY",
  CHEMISTRY = "CHEMISTRY",
  PHYSICS = "PHYSICS",
  MATHEMATICS = "MATHEMATICS",

  // Business & Law
  BUSINESS_ADMINISTRATION = "BUSINESS_ADMINISTRATION",
  LAW = "LAW",
  COMMERCE = "COMMERCE",

  // Computer Applications
  COMPUTER_APPLICATION = "COMPUTER_APPLICATION",
  INFORMATION_TECHNOLOGY = "INFORMATION_TECHNOLOGY",

  // Arts & Humanities
  ARTS = "ARTS",
  ENGLISH = "ENGLISH",
  HISTORY = "HISTORY",

  // Sports & Physical Education
  SPORTS = "SPORTS",
  PHYSICAL_EDUCATION = "PHYSICAL_EDUCATION",

  // Other
  OTHER = "OTHER",
}

export interface DepartmentConfig {
  name: string;
  displayName: string;
  color: string;
  category: string;
}

export const DEPARTMENT_COLORS: Record<string, string> = {
  // Engineering - Green
  COMPUTER_ENGINEERING: "#1ba62b",
  ELECTRICAL_ENGINEERING: "#1ba62b",
  CIVIL_ENGINEERING: "#1ba62b",
  MECHANICAL_ENGINEERING: "#1ba62b",
  CHEMICAL_ENGINEERING: "#1ba62b",

  // Medical & Health
  PHYSIOTHERAPY: "#30e9f2",
  PHARMACY: "#0a888a",

  // Science - Blue
  MICROBIOLOGY: "#2563eb",
  AGRICULTURE: "#2563eb",
  BIOTECHNOLOGY: "#2563eb",
  CHEMISTRY: "#2563eb",
  PHYSICS: "#2563eb",
  MATHEMATICS: "#2563eb",

  // Business & Law - Gray
  BUSINESS_ADMINISTRATION: "#999999",
  LAW: "#999999",
  COMMERCE: "#999999",

  // Computer Applications - Dark Blue
  COMPUTER_APPLICATION: "#1d2447",
  INFORMATION_TECHNOLOGY: "#1d2447",

  // Arts & Humanities - Purple
  ARTS: "#7c3aed",
  ENGLISH: "#7c3aed",
  HISTORY: "#7c3aed",

  // Sports - Orange
  SPORTS: "#ea580c",
  PHYSICAL_EDUCATION: "#ea580c",

  // Other - Default
  OTHER: "#6b7280",
};

export const DEPARTMENTS: DepartmentConfig[] = [
  // Engineering
  {
    name: Department.COMPUTER_ENGINEERING,
    displayName: "Computer Engineering",
    color: DEPARTMENT_COLORS.COMPUTER_ENGINEERING,
    category: "Engineering",
  },
  {
    name: Department.ELECTRICAL_ENGINEERING,
    displayName: "Electrical Engineering",
    color: DEPARTMENT_COLORS.ELECTRICAL_ENGINEERING,
    category: "Engineering",
  },
  {
    name: Department.CIVIL_ENGINEERING,
    displayName: "Civil Engineering",
    color: DEPARTMENT_COLORS.CIVIL_ENGINEERING,
    category: "Engineering",
  },
  {
    name: Department.MECHANICAL_ENGINEERING,
    displayName: "Mechanical Engineering",
    color: DEPARTMENT_COLORS.MECHANICAL_ENGINEERING,
    category: "Engineering",
  },
  {
    name: Department.CHEMICAL_ENGINEERING,
    displayName: "Chemical Engineering",
    color: DEPARTMENT_COLORS.CHEMICAL_ENGINEERING,
    category: "Engineering",
  },

  // Medical & Health
  {
    name: Department.PHYSIOTHERAPY,
    displayName: "Physiotherapy",
    color: DEPARTMENT_COLORS.PHYSIOTHERAPY,
    category: "Medical & Health",
  },
  {
    name: Department.PHARMACY,
    displayName: "Pharmacy",
    color: DEPARTMENT_COLORS.PHARMACY,
    category: "Medical & Health",
  },

  // Science
  {
    name: Department.MICROBIOLOGY,
    displayName: "Microbiology",
    color: DEPARTMENT_COLORS.MICROBIOLOGY,
    category: "Science",
  },
  {
    name: Department.AGRICULTURE,
    displayName: "Agriculture",
    color: DEPARTMENT_COLORS.AGRICULTURE,
    category: "Science",
  },
  {
    name: Department.BIOTECHNOLOGY,
    displayName: "Biotechnology",
    color: DEPARTMENT_COLORS.BIOTECHNOLOGY,
    category: "Science",
  },
  {
    name: Department.CHEMISTRY,
    displayName: "Chemistry",
    color: DEPARTMENT_COLORS.CHEMISTRY,
    category: "Science",
  },
  {
    name: Department.PHYSICS,
    displayName: "Physics",
    color: DEPARTMENT_COLORS.PHYSICS,
    category: "Science",
  },
  {
    name: Department.MATHEMATICS,
    displayName: "Mathematics",
    color: DEPARTMENT_COLORS.MATHEMATICS,
    category: "Science",
  },

  // Business & Law
  {
    name: Department.BUSINESS_ADMINISTRATION,
    displayName: "Business Administration",
    color: DEPARTMENT_COLORS.BUSINESS_ADMINISTRATION,
    category: "Business & Law",
  },
  {
    name: Department.LAW,
    displayName: "Law",
    color: DEPARTMENT_COLORS.LAW,
    category: "Business & Law",
  },
  {
    name: Department.COMMERCE,
    displayName: "Commerce",
    color: DEPARTMENT_COLORS.COMMERCE,
    category: "Business & Law",
  },

  // Computer Applications
  {
    name: Department.COMPUTER_APPLICATION,
    displayName: "Computer Application",
    color: DEPARTMENT_COLORS.COMPUTER_APPLICATION,
    category: "Computer Applications",
  },
  {
    name: Department.INFORMATION_TECHNOLOGY,
    displayName: "Information Technology",
    color: DEPARTMENT_COLORS.INFORMATION_TECHNOLOGY,
    category: "Computer Applications",
  },

  // Arts & Humanities
  {
    name: Department.ARTS,
    displayName: "Arts",
    color: DEPARTMENT_COLORS.ARTS,
    category: "Arts & Humanities",
  },
  {
    name: Department.ENGLISH,
    displayName: "English",
    color: DEPARTMENT_COLORS.ENGLISH,
    category: "Arts & Humanities",
  },
  {
    name: Department.HISTORY,
    displayName: "History",
    color: DEPARTMENT_COLORS.HISTORY,
    category: "Arts & Humanities",
  },

  // Sports
  {
    name: Department.SPORTS,
    displayName: "Sports",
    color: DEPARTMENT_COLORS.SPORTS,
    category: "Sports & Physical Education",
  },
  {
    name: Department.PHYSICAL_EDUCATION,
    displayName: "Physical Education",
    color: DEPARTMENT_COLORS.PHYSICAL_EDUCATION,
    category: "Sports & Physical Education",
  },

  // Other
  {
    name: Department.OTHER,
    displayName: "Other",
    color: DEPARTMENT_COLORS.OTHER,
    category: "Other",
  },
];

export function getDepartmentColor(department: string): string {
  return DEPARTMENT_COLORS[department] || DEPARTMENT_COLORS.OTHER;
}

export function getDepartmentDisplayName(department: string): string {
  const dept = DEPARTMENTS.find((d) => d.name === department);
  return dept?.displayName || department;
}

export function getDepartmentsByCategory(): Record<string, DepartmentConfig[]> {
  return DEPARTMENTS.reduce(
    (acc, dept) => {
      if (!acc[dept.category]) {
        acc[dept.category] = [];
      }
      acc[dept.category].push(dept);
      return acc;
    },
    {} as Record<string, DepartmentConfig[]>
  );
}
