export interface Skill {
  name: string;
  id: string;
}

export interface Option {
  value: string;
  label: string;
}

export interface Education {
  degree: string;
  institution: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
}

export interface Skills {
  skillSet: string[];
}

export interface FormData {
  name: string;
  phone: string;
  address: string;
  email: string;
  experience: Array<Experience>;
  skills: Array<Skills>;
  education: Array<Education>;
}

export interface CreateProfileDto {
  userId: string;
  address?: string;
  phoneNumber?: string;
  bio?: string;
  education: {
    degree: string;
    institution: string;
    startDate: Date;
    endDate?: Date;
  }[];
  workHistory: {
    jobTitle: string;
    companyName: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  }[];
  skills: {
    name: string;
  }[];
}

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

export interface CompletionPercentages {
  personal: number;
  education: number;
  work: number;
  skills: number;
  total: number;
}
