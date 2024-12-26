interface PersonalFormProps {
  formData: {
    name: string;
    phone: string;
    address: string;
    email: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalForm: React.FC<PersonalFormProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
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
};

export default PersonalForm;
