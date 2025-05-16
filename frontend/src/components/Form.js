import React from 'react';

function Form({ onSubmit, formData, setFormData, fields = [], buttonText }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing field ${name} to ${value}`);
    setFormData({ ...formData, [name]: value });
  };

  const formatLabel = (name) => {
    if (!name || typeof name !== 'string') {
      console.warn(`Invalid field name: ${name}`);
      return 'Unnamed Field';
    }
    return name
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const effectiveFields = fields.length > 0
    ? fields
    : Object.keys(formData).map(key => ({
        name: key,
        type: key === 'password' ? 'password' : 'text'
      }));

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        {Array.isArray(effectiveFields) && effectiveFields.length > 0 ? (
          effectiveFields.map((field, index) => {
            const fieldName = typeof field === 'string' ? field : field?.name;
            const fieldType = typeof field === 'string' ? 'text' : field?.type || 'text';
            const fieldOptions = typeof field === 'string' ? null : field?.options;

            if (!fieldName) {
              console.warn(`Field at index ${index} is missing a name`);
              return null;
            }

            return (
              <div key={fieldName} className="relative">
                <label
                  htmlFor={fieldName}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {formatLabel(fieldName)}
                </label>
                {fieldType === 'select' ? (
                  <select
                    id={fieldName}
                    name={fieldName}
                    value={formData[fieldName] || ''}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="">Select a {formatLabel(fieldName)}</option>
                    {fieldOptions && Array.isArray(fieldOptions) && fieldOptions.length > 0 ? (
                      fieldOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))
                    ) : (
                      <option disabled>No options available</option>
                    )}
                  </select>
                ) : (
                  <input
                    type={fieldType}
                    id={fieldName}
                    name={fieldName}
                    value={formData[fieldName] || ''}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                    placeholder={`Enter ${formatLabel(fieldName).toLowerCase()}`}
                  />
                )}
              </div>
            );
          })
        ) : (
          <p className="text-red-500 text-center py-4 bg-red-50 rounded-md">
            No fields defined for this form.
          </p>
        )}
      </div>
      <button
        type="submit"
        className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm"
        disabled={!Array.isArray(effectiveFields) || effectiveFields.length === 0}
      >
        {buttonText || 'Submit'}
      </button>
    </form>
  );
}

export default Form;