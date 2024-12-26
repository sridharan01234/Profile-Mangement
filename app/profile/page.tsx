"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import Select from "react-select";
import PersonalForm from "@/app/components/PersonalForm";
import WorkSection from "@/app/components/WorkSection";
import EducationSection from "@/app/components/EducationSection";
import SkillSection from "@/app/components/SkillSection";
import { Plus, X } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [activeSection, setActiveSection] = useState("work");

  // Add states for multiple sections
  const [workSections, setWorkSections] = useState([0]);
  const [educationSections, setEducationSections] = useState([0]);
  const [skillSections, setSkillSections] = useState([0]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    experience: [{ company: "", position: "", duration: "" }],
    skills: [{ skillSet: [] }],
    education: [{ degree: "", institution: "", year: "" }],
  });

  // Add section handlers
  const addWorkSection = () => {
    setWorkSections([...workSections, workSections.length]);
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", position: "", duration: "" },
      ],
    }));
  };

  const addEducationSection = () => {
    setEducationSections([...educationSections, educationSections.length]);
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", year: "" }],
    }));
  };

  // Remove section handlers
  const removeWorkSection = (index: number) => {
    setWorkSections(workSections.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const removeEducationSection = (index: number) => {
    setEducationSections(educationSections.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    sectionIndex?: number,
    sectionType?: string
  ) => {
    const { name, value } = e.target;

    if (sectionType && typeof sectionIndex === "number") {
      setFormData((prev) => ({
        ...prev,
        [sectionType]: prev[sectionType].map((item: any, index: number) =>
          index === sectionIndex ? { ...item, [name]: value } : item
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const renderPersonalForm = () => (
    <PersonalForm formData={formData} handleInputChange={handleInputChange} />
  );

  function handleExperienceChnage(sectionIndex, field, value) {
    console.log(field, value);
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((section, index) =>
        index === sectionIndex ? { ...section, [field]: value } : section
      ),
    }));
  }

  function handleEducationChange(sectionIndex, field, value) {
    console.log(field, value);
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((section, index) =>
        index === sectionIndex ? { ...section, [field]: value } : section
      ),
    }));
  }

  const renderWorkSection = () => (
    <div className="space-y-6">
      {workSections.map((_, index) => (
        <div key={index} className="relative border p-4 rounded-lg">
          {index > 0 && (
            <button
              type="button"
              onClick={() => removeWorkSection(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <WorkSection
            sectionIndex={index}
            value={formData.experience[index]}
            onChange={handleExperienceChnage}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addWorkSection}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <Plus className="w-5 h-5" />
        <span>Add Work Experience</span>
      </button>
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-6">
      {educationSections.map((_, index) => (
        <div key={index} className="relative border p-4 rounded-lg">
          {index > 0 && (
            <button
              type="button"
              onClick={() => removeEducationSection(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <EducationSection
            sectionIndex={index}
            value={formData.education[index]}
            onChange={handleEducationChange}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addEducationSection}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <Plus className="w-5 h-5" />
        <span>Add Education</span>
      </button>
    </div>
  );

const renderSkillsSection = () => (
  <div className="space-y-6">
    {skillSections.map((_, index) => (
      <div key={index} className="relative border p-4 rounded-lg">
        {index > 0 && (
          <button
            type="button"
            onClick={() => removeSkillSection(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <SkillSection
          sectionIndex={index}
          value={formData.skills[index].skillSet}
          onChange={handleSkillChange}
        />
      </div>
    ))}
  </div>
);

  const handleSkillChange = (selectedSkills: any[], sectionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((section, index) =>
        index === sectionIndex
          ? { ...section, skillSet: selectedSkills }
          : section
      ),
    }));
  };

  // Update addSkillSection function
  const addSkillSection = () => {
    setSkillSections([...skillSections, skillSections.length]);
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { skillSet: [] }],
    }));
  };

  // Update removeSkillSection function
  const removeSkillSection = (index: number) => {
    setSkillSections(skillSections.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Update handleCancel function
  const handleCancel = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [{ skillSet: [] }],
    }));
    setSkillSections([0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Add your logic to submit the form data
  };

  const renderProfessionalForm = () => {
    if (activeSection === "Work history") return renderWorkSection();
    if (activeSection === "Education") return renderEducationSection();
    if (activeSection === "Skills") return renderSkillsSection();
  };

  const moveToNextSection = () => {
    if (activeTab === "personal") {
      setActiveTab("professional")
      setActiveSection("Education");
    }
      if (activeSection === "Work history") {
        setActiveSection("Skills");
      } else if (activeSection === "Education") {
        setActiveSection("Work history");
      } else if (activeSection === "Skills") {
        setActiveSection("");
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-8">
      <div className="container max-w-6xl mx-auto flex flex-col md:flex-row gap-6 p-4">
        {/* Sidebar */}

        <div className="space-y-6">
          <Sidebar
            setActiveTab={setActiveTab}
            setProfessionalActiveSection={setActiveSection}
            activeTab={activeTab}
            activeSection={activeSection}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-8">
              {activeTab === "personal"
                ? "Personal Information"
                : "Professional Information"}
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {activeTab === "personal"
                ? renderPersonalForm()
                : renderProfessionalForm()}

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={moveToNextSection}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
