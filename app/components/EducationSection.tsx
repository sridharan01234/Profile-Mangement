import { useState, useEffect } from "react";
import Select from "react-select";
import { EducationSectionProps, selectInput } from "@/types";

export default function EducationSection({
  sectionIndex,
  value,
  onChange,
  loading,
  setLoading,
}: EducationSectionProps) {
  const [degrees, setDegrees] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    fetchEducationData();
  }, []);

  const fetchEducationData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/profile/education");
      const data = await response.json();
      const degreeOptions = data.DegreeList.map((degree: selectInput) => ({
        value: degree.id,
        label: degree.name,
      }));
      const institutionOptions = data.InstitutionList.map(
        (institution: selectInput) => ({
          value: institution.id,
          label: institution.name,
        }),
      );
      setDegrees(degreeOptions);
      setInstitutions(institutionOptions);
    } catch (error) {
      console.error("Error fetching education data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="degree" className="block font-medium">
          Degree
        </label>
        <Select
          value={value.degree}
          options={degrees}
          onChange={(selectedOption) =>
            onChange(sectionIndex, "degree", selectedOption)
          }
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="institution" className="block font-medium">
          Institution
        </label>
        <Select
          value={value.institution}
          options={institutions}
          onChange={(selectedOption) =>
            onChange(sectionIndex, "institution", selectedOption)
          }
        />
      </div>
    </>
  );
}
