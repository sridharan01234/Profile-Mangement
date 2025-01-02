import React, { useMemo } from "react";
import { ChevronDown, ChevronRight, User, Briefcase } from "lucide-react";

type SidebarProps = {
  activeSection: string;
  completionPercentage: number;
};

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  completionPercentage,
}) => {
  const menuItems = useMemo(
    () => [
      {
        id: 1,
        label: "personal",
        completed: false,
        percentage: 30,
        subItems: [
          {
            id: "basic",
            label: "Basic Info",
            completed: false,
            percentage: 30,
          },
        ],
      },
      {
        id: 2,
        label: "professional",
        completed: false,
        percentage: 70,
        subItems: [
          { id: "edu", label: "Education", completed: false, percentage: 25 },
          {
            id: "work",
            label: "Work history",
            completed: false,
            percentage: 25,
          },
          { id: "skills", label: "Skills", completed: false, percentage: 20 },
        ],
      },
    ],
    [],
  );

  return (
    <div className="w-full fixed top-0 left-0 bg-white shadow-lg z-50">
      <div className="p-4 flex flex-row items-center">
        <div className="ml-6 bg-gray-50 rounded-lg flex items-center">
          <div className="mr-4">
            <span className="text-2xl font-semibold text-blue-600">
              {completionPercentage}%
            </span>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>
        </div>
        <div className="ml-n4 flex-1 flex flex-row items-center justify-center space-x-4">
          {menuItems.map((item) => (
            <div key={item.id} className="select-none relative">
              {item.subItems ? (
                <div className="flex items-center space-x-4">
                  {item.subItems.map((subItem) => (
                    <div key={subItem.id} className="flex items-center">
                      {activeSection === subItem.label ? (
                        <ChevronDown className="text-blue-600" />
                      ) : (
                        <ChevronRight className="text-gray-600" />
                      )}
                      <span
                        className={`ml-2 transition-colors
                        ${
                          activeSection === subItem.label
                            ? "text-blue-600 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {subItem.label}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-colors
                      ${item.completed ? "bg-blue-500" : "bg-gray-200"}
                      ${activeSection === item.label ? "ring-2 ring-blue-200" : ""}`}
                  />
                  <button
                    className={`ml-2 hover:text-blue-600 transition-colors
                      ${
                        activeSection === item.label
                          ? "text-blue-600 font-medium"
                          : "text-gray-600"
                      }`}
                  >
                    {item.label}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
