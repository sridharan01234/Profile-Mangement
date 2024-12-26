import { useState, useEffect } from "react";
import Select from "react-select";

interface SkillSectionProps {
  sectionIndex: number;
  value: any[];
  onChange: (skills: any[], index: number) => void;
}

export default function SkillSection({
  sectionIndex,
  value,
  onChange,
}: SkillSectionProps) {
  const [skillOptions, setSkillOption] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/profile/skills");
      const data = await response.json();
      let options = data.map((skill: { id: string; name: string }) => ({
        value: skill.id,
        label: skill.name,
      }));
      setSkillOption(options);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  };

  return (
    <>
      <Select
        value={value}
        isMulti={true}
        options={skillOptions}
        onChange={(selectedOptions: any) =>
          onChange(selectedOptions, sectionIndex)
        }
        className="mb-4"
      />
    </>
  );
}
