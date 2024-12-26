"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/SideBar";
import PersonalForm from "@/app/components/PersonalForm";
import WorkSection from "@/app/components/WorkSection";
import EducationSection from "@/app/components/EducationSection";
import SkillSection from "@/app/components/SkillSection";
import { Plus, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import {
  FormData,
  Education,
  CompletionPercentages,
  Experience,
  Skills,
} from "@/types";

const calculatePersonalCompletion = (formData: FormData) => {
  const personalFields = ["name", "phone", "address", "email"] as const;
  type PersonalField = (typeof personalFields)[number];

  const filledFields = personalFields.filter((field: PersonalField) =>
    Boolean(formData[field])
  ).length;

  return Math.round((filledFields / personalFields.length) * 100);
};

const calculateEducationCompletion = (education: Array<Education>) => {
  if (!education.length) return 0;
  const filledEducations = education.filter(
    (edu) => edu.degree && edu.institution
  ).length;
  return Math.round((filledEducations / education.length) * 100);
};

const calculateWorkCompletion = (experience: Array<Experience>) => {
  if (!experience.length) return 0;
  const filledExperience = experience.filter(
    (exp) => exp.company && exp.position && exp.startDate && exp.endDate
  ).length;
  return Math.round((filledExperience / experience.length) * 100);
};

const calculateSkillsCompletion = (skills: Array<Skills>) => {
  if (!skills.length) return 0;
  return skills.some((skill) => skill.skillSet && skill.skillSet.length > 0)
    ? 100
    : 0;
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [activeSection, setActiveSection] = useState<string>("");
  const [workSections, setWorkSections] = useState<Experience[]>([]);
  const [educationSections, setEducationSections] = useState<Education[]>([]);
  const [skillSections] = useState<Skills[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>(["personal"]);
  const { user, loading, setLoading } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    email: "",
    experience: [{ company: "", position: "", startDate: "", endDate: "" }],
    skills: [{ skillSet: [] }],
    education: [{ degree: "", institution: "" }],
  });

  useEffect(() => {
    getProfileData();
  }, [user]);

  const getProfileData = async () => {
    setLoading(true);
    try {
      if (!user) return;
      const response = await fetch(`api/profiles/${user.userId}`);
      const profileData = await response.json();

      console.log(profileData);

      if (profileData) {
        setFormData(profileData);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addWorkSection = () => {
    const newExperience: Experience = {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
    };
    setWorkSections((prev: Experience[]) => [...prev, newExperience]);
    setFormData((prev: FormData) => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
  };

  const addEducationSection = () => {
    const newEducation: Education = {
      degree: "",
      institution: "",
    };

    // Update education sections
    setEducationSections((prev) => [...prev, newEducation]);

    // Update form data
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

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

  const renderPersonalForm = () => (
    <PersonalForm
      formData={formData}
      handleInputChange={handlePersonalFormInputChange}
    />
  );

  const handlePersonalFormInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function handleExperienceChnage(
    sectionIndex: number,
    field: string,
    value: FormData
  ) {
    console.log(field, value);
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((section, index) =>
        index === sectionIndex ? { ...section, [field]: value } : section
      ),
    }));
  }

  function handleEducationChange(
    sectionIndex: number,
    field: string,
    value: FormData
  ) {
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
      {formData.experience.map((experience, index) => (
        <div key={index} className="relative border p-4 rounded-lg">
          {index >= 0 && (
            <button
              type="button"
              onClick={() => removeWorkSection(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <WorkSection
            key={index}
            sectionIndex={index}
            value={experience}
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
          {index >= 0 && (
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
        <div className="relative border p-4 rounded-lg">
          <SkillSection
            sectionIndex={0}
            value={formData.skills[0]?.skillSet ?? []}
            onChange={handleSkillChange}
          />
        </div>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (completionPercentages.total !== 100) {
      toast.error("Please complete all the section");
      return;
    }
    toast.success("Profile Updated succesfully");
    return;
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create profile");
      }

      const data = await response.json();
      console.log("Profile created:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderProfessionalForm = () => {
    if (activeSection === "Work history") return renderWorkSection();
    if (activeSection === "Education") return renderEducationSection();
    if (activeSection === "Skills") return renderSkillsSection();
  };

  const validateForm = () => {
    if (activeTab === "personal") {
      const { name, phone, address, email } = formData;
      if (!name || !phone || !address || !email) {
        toast.error("Please fill all the fields", {
          duration: 1000,
        });
        return false;
      }
    }

    if (activeTab === "professional") {
      if (activeSection === "Work history") {
        if (formData.experience.length === 0) {
          toast.error("Please fill all the fields", {
            duration: 1000,
          });
          return false;
        }
        const { company = "", position = "" } = formData.experience[0] ?? {};
        if (!company || !position) {
          toast.error("Please fill all the fields", {
            duration: 1000,
          });
          return false;
        }
      }

      if (activeSection === "Education") {
        if (formData.education.length === 0) {
          toast.error("Please fill all the fields", {
            duration: 1000,
          });
          return false;
        }
        const { degree = "", institution = "" } = formData.education[0] ?? {};
        if (!degree || !institution) {
          toast.error("Please fill all the fields", {
            duration: 1000,
          });
          return false;
        }
      }

      if (activeSection === "Skills") {
        if (formData.skills.length === 0) {
          toast.error("Please fill all the fields", {
            duration: 1000,
          });
          return false;
        }
        const { skillSet = "" } = formData.skills[0] ?? {};
        if (!skillSet || skillSet.length === 0) {
          toast.error("Please fill all the fields", {
            duration: 1000,
          });
          return false;
        }
      }
    }

    return true;
  };

  const completionPercentages = useMemo((): CompletionPercentages => {
    try {
      if (!formData) {
        console.error("formData is undefined");
        return { personal: 0, education: 0, work: 0, skills: 0, total: 0 };
      }

      const personal = calculatePersonalCompletion(formData);
      const education = calculateEducationCompletion(formData.education || []);
      const work = calculateWorkCompletion(formData.experience || []);
      const skills = calculateSkillsCompletion(formData.skills || []);

      const total = Math.round(
        (personal * 30 + education * 25 + work * 30 + skills * 15) / 100
      );

      return {
        personal,
        education,
        work,
        skills,
        total,
      };
    } catch (error) {
      console.error("Error calculating completion percentages:", error);
      return { personal: 0, education: 0, work: 0, skills: 0, total: 0 };
    }
  }, [formData]);

  const moveToNextSection = (e: React.FormEvent) => {
    try {
      if (!validateForm()) {
        console.warn("Form validation failed");
        return;
      }

      if (activeTab === "personal") {
        setActiveTab("professional");
        setActiveSection("Education");
        toggleExpanded("professional");
        return;
      }

      if (activeTab === "professional") {
        switch (activeSection) {
          case "Education": {
            const nextCompletion = completionPercentages.work;
            setActiveSection("Work history");
            break;
          }
          case "Work history": {
            const nextCompletion = completionPercentages.skills;
            setActiveSection("Skills");
            break;
          }
          case "Skills": {
            setActiveSection("Skills");
            handleSubmit(e);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error in moveToNextSection:", error);
    }
  };

  useEffect(() => {
    console.log("Current state:", {
      activeTab,
      activeSection,
      completionPercentages,
      formData,
    });
  }, [activeTab, activeSection, completionPercentages, formData]);

  const moveToPreviousSection = () => {
    if (activeTab === "professional") {
      switch (activeSection) {
        case "Work history":
          setActiveSection("Education");
          break;
        case "Skills":
          setActiveSection("Work history");
          break;
        case "Education":
          setActiveTab("personal");
          setActiveSection("");
          break;
        default:
          break;
      }
    } else {
      setActiveTab("personal");
      setActiveSection("");
      toggleExpanded("personal");
    }
  };

  const toggleExpanded = (label: string) => {
    setActiveTab(label);
    if (label === "professional") {
      setExpandedItems(["professional"]);
      setActiveSection("Education");
    } else {
      setExpandedItems([]);
      setExpandedItems((prev) => (prev.includes(label) ? [] : [label]));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-8">
      <Toaster />
      <div className="container max-w-6xl mx-auto flex flex-col md:flex-row gap-6 p-4">
        {/* Sidebar */}

        <div className="space-y-6">
          <Sidebar
            setProfessionalActiveSection={setActiveSection}
            activeTab={activeTab}
            activeSection={activeSection}
            expandedItems={expandedItems}
            toggleExpanded={toggleExpanded}
            completionPercentage={completionPercentages.total}
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
                {/* Only show Back button if not on the first screen */}
                {activeTab !== "personal" && (
                  <button
                    type="button"
                    onClick={moveToPreviousSection}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={moveToNextSection}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {/* Change button text based on section */}
                  {activeTab === "professional" && activeSection === "Skills"
                    ? "Submit"
                    : "Next"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
