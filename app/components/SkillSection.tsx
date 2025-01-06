import { useState, useEffect } from "react";
import Select from "react-select";
import { SkillSectionProps } from "@/types";

export default function SkillSection({
  sectionIndex,
  value,
  onChange,
  setLoading,
  loading,
}: SkillSectionProps) {
  const [skillOptions, setSkillOption] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
