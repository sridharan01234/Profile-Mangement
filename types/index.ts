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
  year: string;
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
}

export interface Skills {
  skillSet: string[];
}

export interface FormData {
  name: string;
  phone: string;
  address: string;
  email: string;
  experience: Experience[];
  skills: Skills[];
  education: Education[];
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