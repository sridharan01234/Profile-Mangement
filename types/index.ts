import { Dispatch, SetStateAction } from "react";

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
  address?: string;
  phone?: string;
  bio?: string;
  education: Array<{
    degree: { label: string };
    institution: { label: string };
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string | Date;
    endDate?: string | Date | null;
  }>;
  skills: Array<{
    skillSet: Array<{ label: string }>;
  }>;
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

export interface WorkSectionProps {
  sectionIndex: number;
  value: Experience;
  onChange: (index: number, field: keyof Experience, value: any) => void;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export interface EducationSectionProps {
  sectionIndex: number;
  value: any;
  onChange: (sectionIndex: number, field: string, value: any) => void;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export interface SkillSectionProps {
  sectionIndex: number;
  value: any[];
  onChange: (skills: any[], index: number) => void;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export interface PersonalFormProps {
  formData: {
    name: string;
    phone: string;
    address: string;
    email: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

export interface selectInput {
  id: string;
  name: string;
}
