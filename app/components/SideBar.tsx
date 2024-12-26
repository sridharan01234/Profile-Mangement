import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronRight, User, Briefcase } from "lucide-react";

type SidebarProps = {
  setActiveTab: (tab: string) => void;
  setProfessionalActiveSection: (section: string) => void;
  activeTab: string;
  activeSection: string;
};

const Sidebar: React.FC<SidebarProps> = ({
  setActiveTab,
  setProfessionalActiveSection,
  activeTab,
  activeSection
}) => {
  const [expandedItems, setExpandedItems] = useState(["personal"]);

  const menuItems = useMemo(
    () => [
      {
        id: 1,
        label: "personal",
        icon: <User className="w-5 h-5" />,
        completed: false,
        percetage: 30,
      },
      {
        id: 2,
        label: "professional",
        icon: <Briefcase className="w-5 h-5" />,
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
    []
  );

  const completionPercentage = useMemo(() => {
    const calculateCompletion = (items) => {
      const total = items.length;
      const completed = items.filter((item) => item.completed).length;

      const subItemResults = items
        .filter((item) => item.subItems)
        .reduce(
          (acc, item) => {
            const subCompletion = calculateCompletion(item.subItems);
            return {
              total: acc.total + subCompletion.total,
              completed: acc.completed + subCompletion.completed,
            };
          },
          { total: 0, completed: 0 }
        );

      return {
        total: total + subItemResults.total,
        completed: completed + subItemResults.completed,
      };
    };

    const { total, completed } = calculateCompletion(menuItems);
    return Math.round((completed / total) * 100);
  }, [menuItems]);

  const handleMainTabClick = (label: string) => {
    setActiveTab(label);
    if (label === "professional") {
      setExpandedItems(["professional"]);
      setProfessionalActiveSection("Education");
    } else {
      setExpandedItems([]);
    }
  };

  const handleSectionClick = (section: string) => {
    setProfessionalActiveSection(section);
  };


  const toggleExpanded = (label: string) => {
    if (activeTab === "professional") {
      setExpandedItems((prev) => (prev.includes(label) ? [] : [label]));
    }
  };

  return (
    <div className="w-64 p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6">General Menu</h2>

      <div className="space-y-2">
        {menuItems.map((item) => (
          <div key={item.id} className="select-none">
            <div
              onClick={() => {
                handleMainTabClick(item.label);
                if (activeTab === "professional") {
                  toggleExpanded(item.label);
                }
              }}
              className={`flex items-center p-3 rounded-lg transition-all cursor-pointer
                ${
                  activeTab === item.label
                    ? "bg-blue-100"
                    : expandedItems.includes(item.label)
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
            >
              <span
                className={`mr-3 ${
                  activeTab === item.label
                    ? "text-blue-600"
                    : expandedItems.includes(item.label)
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`flex-grow ${
                  activeTab === item.label
                    ? "text-blue-700 font-medium"
                    : expandedItems.includes(item.label)
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {item.label}
              </span>
              {item.subItems && (
                <span className="text-gray-400">
                  {expandedItems.includes(item.label) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </span>
              )}
            </div>

            {item.subItems && expandedItems.includes(item.label) && (
              <div className="ml-6 mt-2">
                {item.subItems.map((subItem, subIndex) => (
                  <div key={subItem.id} className="relative">
                    {subIndex < item.subItems.length - 1 && (
                      <div
                        style={{ height: "60px" }}
                        className="absolute h-full left-[0.25rem] top-0 w-0.5 bg-gray-200"
                      />
                    )}

                    <div className="flex items-center py-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full z-10 transition-colors
                          ${subItem.completed ? "bg-blue-500" : "bg-gray-200"}
                          ${
                            activeSection === subItem.label
                              ? "ring-2 ring-blue-200"
                              : ""
                          }`}
                      />
                      <button
                        onClick={() => handleSectionClick(subItem.label)}
                        className={`ml-4 hover:text-blue-600 transition-colors
                          ${
                            activeSection === subItem.label
                              ? "text-blue-600 font-medium"
                              : "text-gray-600"
                          }`}
                      >
                        {subItem.label}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-4xl font-semibold inline-block text-blue-600">
                {completionPercentage}%
              </span>
              <div className="text-gray-600">Completed</div>
            </div>
          </div>
          <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
            <div
              style={{ width: `${completionPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
