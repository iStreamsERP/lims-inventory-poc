import React, { useReducer, useState } from 'react';

// Reducer for managing form state
const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    case 'RESET':
      return {
        textInput: '',
        emailInput: '',
        passwordInput: '',
        numberInput: '',
        dateInput: '',
        colorInput: '#000000',
        rangeInput: 50,
        selectInput: 'option1',
        radioInput: 'radio1',
        checkboxInput: false,
        textareaInput: '',
        fileInput: null
      };
    default:
      return state;
  }
};

const ReactInputsChange = () => {
  // Form state managed by reducer
  const [formState, dispatch] = useReducer(formReducer, {
    textInput: '',
    emailInput: '',
    passwordInput: '',
    numberInput: '',
    dateInput: '',
    colorInput: '#000000',
    rangeInput: 50,
    selectInput: 'option1',
    radioInput: 'radio1',
    checkboxInput: false,
    textareaInput: '',
    fileInput: null
  });

  // State for checkbox selection popup
  const [showCheckboxPopup, setShowCheckboxPopup] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Checkbox options data
  const checkboxOptions = [
    { id: 'opt1', label: 'Option 1', value: 'value1' },
    { id: 'opt2', label: 'Option 2', value: 'value2' },
    { id: 'opt3', label: 'Option 3', value: 'value3' },
    { id: 'opt4', label: 'Option 4', value: 'value4' },
    { id: 'opt5', label: 'Option 5', value: 'value5' },
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    dispatch({
      type: 'UPDATE_FIELD',
      field: name,
      value: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    });
  };

  // Handle checkbox selection
  const handleCheckboxChange = (option) => {
    setSelectedOptions(prev => {
      if (prev.includes(option.value)) {
        return prev.filter(item => item !== option.value);
      } else {
        return [...prev, option.value];
      }
    });
  };

  // Filter options based on search
  const [searchTerm, setSearchTerm] = useState('');
  const filteredOptions = checkboxOptions.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(formState, null, 2));
  };

  // Reset form
  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">React Inputs Examples</h1>
        
        {/* Text Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="textInput">
            Text Input
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="textInput"
            name="textInput"
            type="text"
            value={formState.textInput}
            onChange={handleInputChange}
            placeholder="Enter text"
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emailInput">
            Email Input
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="emailInput"
            name="emailInput"
            type="email"
            value={formState.emailInput}
            onChange={handleInputChange}
            placeholder="Enter email"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passwordInput">
            Password Input
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="passwordInput"
            name="passwordInput"
            type="password"
            value={formState.passwordInput}
            onChange={handleInputChange}
            placeholder="Enter password"
          />
        </div>

        {/* Number Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numberInput">
            Number Input
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="numberInput"
            name="numberInput"
            type="number"
            value={formState.numberInput}
            onChange={handleInputChange}
            placeholder="Enter number"
          />
        </div>

        {/* Date Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateInput">
            Date Input
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="dateInput"
            name="dateInput"
            type="date"
            value={formState.dateInput}
            onChange={handleInputChange}
          />
        </div>

        {/* Color Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="colorInput">
            Color Input
          </label>
          <div className="flex items-center">
            <input
              className="h-10 w-16 cursor-pointer"
              id="colorInput"
              name="colorInput"
              type="color"
              value={formState.colorInput}
              onChange={handleInputChange}
            />
            <span className="ml-2 text-gray-700">{formState.colorInput}</span>
          </div>
        </div>

        {/* Range Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rangeInput">
            Range Input: {formState.rangeInput}
          </label>
          <input
            className="w-full"
            id="rangeInput"
            name="rangeInput"
            type="range"
            min="0"
            max="100"
            value={formState.rangeInput}
            onChange={handleInputChange}
          />
        </div>

        {/* Select Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="selectInput">
            Select Input
          </label>
          <select
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            id="selectInput"
            name="selectInput"
            value={formState.selectInput}
            onChange={handleInputChange}
          >
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>

        {/* Radio Inputs */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Radio Inputs
          </label>
          <div className="flex items-center mb-2">
            <input
              id="radio1"
              name="radioInput"
              type="radio"
              value="radio1"
              checked={formState.radioInput === 'radio1'}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="radio1" className="text-gray-700">Radio 1</label>
          </div>
          <div className="flex items-center">
            <input
              id="radio2"
              name="radioInput"
              type="radio"
              value="radio2"
              checked={formState.radioInput === 'radio2'}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="radio2" className="text-gray-700">Radio 2</label>
          </div>
        </div>

        {/* Single Checkbox */}
        <div className="mb-4">
          <div className="flex items-center">
            <input
              id="checkboxInput"
              name="checkboxInput"
              type="checkbox"
              checked={formState.checkboxInput}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="checkboxInput" className="text-gray-700">Single Checkbox</label>
          </div>
        </div>

        {/* Multiple Checkbox Popup Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowCheckboxPopup(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Open Checkbox Selection ({selectedOptions.length} selected)
          </button>
        </div>

        {/* Textarea Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="textareaInput">
            Textarea Input
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="textareaInput"
            name="textareaInput"
            rows="4"
            value={formState.textareaInput}
            onChange={handleInputChange}
            placeholder="Enter multiline text"
          ></textarea>
        </div>

        {/* File Input */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fileInput">
            File Input
          </label>
          <input
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            id="fileInput"
            name="fileInput"
            type="file"
            onChange={handleInputChange}
          />
          {formState.fileInput && (
            <p className="mt-2 text-sm text-gray-600">Selected file: {formState.fileInput.name}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Checkbox Selection Popup */}
      {showCheckboxPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Select Options</h2>
              
              {/* Search Filter */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search options..."
                  className="w-full p-2 border rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Checkbox Options */}
              <div className="space-y-2 mb-4">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map(option => (
                    <div key={option.id} className="flex items-center">
                      <input
                        id={option.id}
                        type="checkbox"
                        checked={selectedOptions.includes(option.value)}
                        onChange={() => handleCheckboxChange(option)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={option.id} className="ml-2 block text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No options found</p>
                )}
              </div>
              
              {/* Selected Options Preview */}
              <div className="mb-4 p-3 bg-gray-100 rounded">
                <h3 className="font-medium text-gray-700 mb-1">Selected:</h3>
                {selectedOptions.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {selectedOptions.map((value, index) => (
                      <li key={index} className="text-gray-600">{value}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No options selected</p>
                )}
              </div>
              
              {/* Popup Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCheckboxPopup(false);
                    alert(`Selected values: ${selectedOptions.join(', ')}`);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowCheckboxPopup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactInputsChange;