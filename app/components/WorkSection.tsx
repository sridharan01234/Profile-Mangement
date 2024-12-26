import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Select from "react-select";
import { WorkSectionProps } from "@/types";
import dayjs from "dayjs";

export default function WorkSection({
  sectionIndex,
  value,
  onChange,
  setLoading,
  loading,
}: WorkSectionProps) {
  const [companies, setCompanies] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    fetchCompanies();
    console.log(value);
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label htmlFor="company" className="block font-medium">
          Company
        </label>
        <Select<{
          value: string;
          label: string;
        }>
          value={companies.find((option) => option.value === value.company)}
          options={companies}
          onChange={(selectedOption) =>
            onChange(sectionIndex, "company", selectedOption?.value || "")
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
            value={value.startDate ? dayjs(value.startDate) : null}
            onChange={(date) => onChange(sectionIndex, "startDate", date)}
            maxDate={value.endDate ? dayjs(value.endDate) : undefined}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="endDate" className="block font-medium">
            End Date
          </label>
          <DatePicker
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={value.endDate ? dayjs(value.endDate) : null}
            onChange={(date) => onChange(sectionIndex, "endDate", date)}
            minDate={value.startDate ? dayjs(value.startDate) : undefined}
          />
        </div>
      </LocalizationProvider>
    </div>
  );
}
