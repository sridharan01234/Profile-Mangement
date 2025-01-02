import { PersonalFormProps } from "@/types";
import React, { useState } from "react";

const PersonalForm: React.FC<PersonalFormProps> = ({
  formData,
  handleInputChange,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center transition-opacity duration-500">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 transition-opacity duration-500">
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
      <div className="space-y-2">
        <label className="block font-medium">Photo</label>
        <input
          id="photo"
          accept="image/*"
          name="photo"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                handleInputChange({
                  target: {
                    name: e.target.name,
                    value: reader.result as string,
                  },
                } as React.ChangeEvent<HTMLInputElement>);
              };
              reader.readAsDataURL(file);
            }
          }}
          className="p-1 w-full text-slate-500 text-sm rounded-full leading-6 file:bg-blue-200 file:text-blue-700 file:font-semibold file:border-none file:px-4 file:py-1 file:mr-6 file:rounded-full hover:file:bg-blue-100 border border-gray-300"
          aria-describedby="file_input_help"
          type="file"
        />
      </div>
    </div>
  );
};

export default PersonalForm;
