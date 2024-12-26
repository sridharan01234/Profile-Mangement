import { useState, useEffect } from "react";
import Select from "react-select";

interface EducationSectionProps {
  sectionIndex: number;
  value: any;
  onChange: (sectionIndex: number, field: string, value: any) => void;
}

export default function EducationSection({
  sectionIndex,
  value,
  onChange,
}: EducationSectionProps) {
  const [degrees, setDegrees] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    fetchEducationData();
  }, []);

  const fetchEducationData = async () => {
    try {
      const response = await fetch("/api/profile/education");
      const data = await response.json();
      const degreeOptions = data.DegreeList.map((degree) => ({
        value: degree.id,
        label: degree.name,
      }));
      const institutionOptions = data.InstitutionList.map((institution) => ({
        value: institution.id,
        label: institution.name,
      }));
      setDegrees(degreeOptions);
      setInstitutions(institutionOptions);
    } catch (error) {
      console.error("Error fetching education data:", error);
    }
  };

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
