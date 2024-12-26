import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Select from "react-select";

interface WorkSectionProps {
  sectionIndex: number;
  value: any;
  onChange: (seactionIndex: number, field: string, value: any) => void;
}

export default function WorkSection({
  sectionIndex,
  value,
  onChange,
}: WorkSectionProps) {
  const [companies, setCompanies] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    fetchCompanies();
    console.log(value);
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/profile/work");
      const data = await response.json();
      const options = data.map((company: { id: string; name: string }) => ({
        value: company.id,
        label: company.name,
      }));
      setCompanies(options);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label htmlFor="company" className="block font-medium">
          Company
        </label>
        <Select
          value={value.company}
          options={companies}
          onChange={(selectedOption) =>
            onChange(sectionIndex, "company", selectedOption)
          }
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="position" className="block font-medium">
          Job Title
        </label>
        <input
          id="position"
          name="position"
          type="text"
          value={value.position}
          onChange={(e) => onChange(sectionIndex, "position", e.target.value)}
          placeholder="Enter your position"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="space-y-2">
          <label htmlFor="startDate" className="block font-medium">
            Start Date
          </label>
          <DatePicker
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={value.startDate}
            onChange={(date) => onChange(sectionIndex, "startDate", date)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endDate" className="block font-medium">
            End Date
          </label>
          <DatePicker
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={value.endDate}
            onChange={(date) => onChange(sectionIndex, "endDate", date)}
          />
        </div>
      </LocalizationProvider>
    </div>
  );
}
