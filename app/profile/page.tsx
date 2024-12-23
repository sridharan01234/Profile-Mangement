"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import type { Skill } from "@/types";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    phone: "",
    address: "",
    email: "",
    // Professional Information
    company: "",
    position: "",
    experience: "",
    skills: [],
    education: "",
    certifications: "",
  });
  const [inputValue, setInputValue] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("work");
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/skills");
        const data = await response.json();
        setSkills(data);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSkillSelection = (skill: Skill) => {
    if (selectedSkills.some((s) => s.id === skill.id)) {
      setSelectedSkills((prev) =>
        prev.filter((selected) => selected.id !== skill.id)
      );
    } else {
      setSelectedSkills((prev) => [...prev, skill]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      email: "",
      company: "",
      position: "",
      experience: "",
      skills: [],
      education: "",
      certifications: "",
    });
  };

  const renderPersonalForm = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label htmlFor="name" className="block font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your name"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="block font-medium">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter your personal number"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="block font-medium">
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter your permanent address"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block font-medium">
          Email ID
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your personal email"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
    </div>
  );

  const renderWorkSection = () => {
    return (
      <>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="company" className="block font-medium">
              Current Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Enter company name"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="position" className="block font-medium">
              Position
            </label>
            <input
              id="position"
              name="position"
              type="text"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="Enter your position"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="experience" className="block font-medium">
            Years of Experience
          </label>
          <input
            id="experience"
            name="experience"
            type="number"
            value={formData.experience}
            onChange={handleInputChange}
            placeholder="Enter years of experience"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </>
    );
  };

  const renderEducationSection = () => {
    return (
      <>
        <div className="space-y-2">
          <label htmlFor="education" className="block font-medium">
            Education
          </label>
          <textarea
            id="education"
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            placeholder="Enter your educational background"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="certifications" className="block font-medium">
            Certifications
          </label>
          <textarea
            id="certifications"
            name="certifications"
            value={formData.certifications}
            onChange={handleInputChange}
            placeholder="Enter your certifications"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[100px]"
          />
        </div>
      </>
    );
  };

  const renderSkillsSection = () => {
    return (
      <div className="w-full max-w-md mx-auto mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="w-full p-2 border rounded-lg"
            placeholder="Search skills..."
          />
          {isOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-md max-h-48 overflow-y-auto">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => toggleSkillSelection(skill)}
                  className={`p-2 cursor-pointer ${
                    selectedSkills.some((s) => s.id === skill.id)
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {skill.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Selected Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full flex items-center"
              >
                {skill.name}
                <button
                  onClick={() => toggleSkillSelection(skill)}
                  className="ml-2 text-white"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderProfessionalForm = () => {
    if (activeSection === "Work history") return renderWorkSection();
    if (activeSection === "Education") return renderEducationSection();
    if (activeSection === "Skills") return renderSkillsSection();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-8">
      <div className="container max-w-6xl mx-auto flex flex-col md:flex-row gap-6 p-4">
        {/* Sidebar */}

        <div className="space-y-6">
          <Sidebar
            setActiveTab={setActiveTab}
            setProfessionalActiveSection={setActiveSection}
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === "personal"
                ? renderPersonalForm()
                : renderProfessionalForm()}

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
