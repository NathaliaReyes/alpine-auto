import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@apollo/client';
import { ADD_CAR } from '@/utils/mutations';
import Auth from '@/utils/auth';
import axios from 'axios';

function NewCarForm({ closeModal, refetchCars }) {
  const [carDetails, setCarDetails] = useState({
    year: '',
    make: '',
    model: '',
    retailPrice: '',
    askingPrice: '',
    color: '',
    mileage: '',
    description: '',
    images: [],
    cabType: '',
    doors: '',
    driveTrain: '',
    engine: '',
    engineType: '',
    stock: '',
    transmission: '',
    trim: '',
    vin: ''
  });

  const [addCar] = useMutation(ADD_CAR);
  const [files, setFiles] = useState([]);
  const [validationMessages, setValidationMessages] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarDetails((prevDetails) => ({
      ...prevDetails,
      [name]: name === 'year' || name === 'mileage' || name === 'retailPrice' || name == 'askingPrice' || name == 'stock' || name == 'doors' ? parseInt(value, 10) : value,
    }));

    // Clear validation message for the field being changed
    setValidationMessages((prevMessages) => ({
      ...prevMessages,
      [name]: '',

    }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const uploadFiles = async () => {
    const uploadedImagePaths = [];
    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post('http://localhost:3001/upload', formData);
        console.log('File upload response:', response.data); // Debug response
        if (response.data.filePath) {
          uploadedImagePaths.push(response.data.filePath);
        } else {
          console.error('No file path in response:', response.data);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    return uploadedImagePaths;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }

    try {
      const imagePaths = await uploadFiles();
      console.log('imagePaths', imagePaths);
      const { data } = await addCar({
        variables: {
          ...carDetails,
          images: imagePaths
        },
      });
      if (data) {
        refetchCars(); // Refetch the cars query to update the UI
        closeModal();  // Close the modal after successful submission
      }
    } catch (error) {
      if (error.networkError) {
        console.error('Network error:', error.networkError);
      }
      if (error.graphQLErrors) {
        console.error('GraphQL errors:', error.graphQLErrors);
      }
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full pr-2 md:px-3 mt-3 overflow-hidden overflow-y-scroll z-50">
      <div className="flex justify-center">
        <h1 className='text-blue-500 font-bold tracking-tight md:tracking-wide text-shadow mb-1 text-center text-base md:text-xl'>Insert a New Vehicle Into Inventory</h1>
      </div>
      <Button type="button" onClick={closeModal} className="absolute top-0.5 md:top-4 right-3 md:right-12 p-1.5 md:p-3 border-gray-400 text-gray-800 hover:bg-red-600 hover:font-bold transition-colors rounded bg-white border-4">
        ✕
      </Button>
      <Label htmlFor="year" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Car Year:</Label>
      <Input name="year" type="number" placeholder="Car Year" value={carDetails.year} onChange={handleChange} required  />
      <Label htmlFor="make" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Make:</Label>
      <Input name="make" type="text" placeholder="Car Make" value={carDetails.make}  onChange={handleChange} required />
      <Label htmlFor="model" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Model:</Label>
      <Input name="model" type="text" placeholder="Car Model" value={carDetails.model}
        onChange={handleChange} required />
      <Label htmlFor="color" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Color:</Label>
      <Input name="color" type="text" placeholder="Car Color" value={carDetails.color} onChange={handleChange} required />
      <Label htmlFor="trim" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Trim:</Label>
      <Input name="trim" type="text" placeholder="Trim Color" value={carDetails.trim} onChange={handleChange} required />
      <Label htmlFor="mileage" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Mileage:</Label>
      <Input name="mileage" type="number" placeholder="Car Mileage" value={carDetails.mileage} onChange={handleChange} required />
      <Label htmlFor="stock" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Stock No.</Label>
      <Input name="stock" type="number" placeholder="Stock No." value={carDetails.stock} onChange={handleChange} required />
      <Label htmlFor="engine" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Engine:</Label>
      <Input name="engine" type="text" placeholder="Car Engine" value={carDetails.engine} onChange={handleChange} required />
      <Label htmlFor="engineType" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Engine Type:</Label>
      <Input name="engineType" type="text" placeholder="Engine Type" value={carDetails.engineType} onChange={handleChange} required />
      <Label htmlFor="transmission" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Transmission:</Label>
      <Input name="transmission" type="text" placeholder="Transmission Type" value={carDetails.transmission} onChange={handleChange} required />
      <Label htmlFor="driveTrain" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Drive Train:</Label>
      <Input name="driveTrain" type="text" placeholder="Drive Train" value={carDetails.driveTrain} onChange={handleChange} required />
      <Label htmlFor="doors" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Number of Doors:</Label>
      <Input name="doors" type="number" placeholder="Number of Doors" value={carDetails.doors} onChange={handleChange} required />
      <Label htmlFor="cabType" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Cab Type:</Label>
      <Input name="cabType" type="text" placeholder="Cab Type" value={carDetails.cabType} onChange={handleChange} required />
      <Label htmlFor="vin" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">VIN:</Label>
      <Input name="vin" type="text" placeholder="VIN" value={carDetails.vin} onChange={handleChange} required />
      <Label htmlFor="retailPrice" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Retail Price:</Label>
      <Input name="retailPrice" type="number" placeholder="Retail Price" value={carDetails.retailPrice} onChange={handleChange} required />
      <Label htmlFor="askingPrice" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Asking Price:</Label>
      <Input name="askingPrice" type="number" placeholder="Asking Price" value={carDetails.askingPrice} onChange={handleChange} required />
      <Label htmlFor="description" className="block text-gray-700 text-base font-semibold mt-2 md:mt-3 tracking-tight md:tracking-normal">Description:</Label>
      <Textarea name="description" placeholder="Car Description" value={carDetails.description} onChange={handleChange} rows="4" />

      <div>
        <label className="block text-gray-700 text-base font-medium">Upload Images</label>
        <input type="file" name="images" multiple onChange={handleFileChange} className="mt-1 block w-full" />
      </div>
      <div className="flex justify-center">
        <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700 transition-colors hover:font-bold">Submit</Button>
      </div>
    </form>
  );
}

export default NewCarForm;