import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    retail_price: '',
    asking_price: '',
    color: '',
    mileage: '',
    description: '',
    images: [],
    vehicleType: '',
    driveTrain: '',
    engine: '',
    engineType: '',
    stock: '',
    transmission: '',
    trim: '',
    vin: '',
    fuelType: ''
  });

  const [addCar] = useMutation(ADD_CAR);
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarDetails((prevDetails) => ({
      ...prevDetails,
      [name]: name === 'year' || name === 'mileage' || name === 'retail_price' || name == 'asking_price' || name == 'stock' ? parseInt(value, 10) : value,
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
    console.log(carDetails);
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
    <form onSubmit={handleSubmit} className="space-y-4 overfow-hidden overflow-y-scroll z-50">
      <div className="flex justify-center">
        <h1>Insert a new vehicle into Inventory</h1>
      </div>
      <Button type="button" onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:bg-red-700 transition-colors rounded-full">✕</Button>
      <Input name="year" type="number" placeholder="Year" value={carDetails.year} onChange={handleChange} required />
      <Input name="make" type="text" placeholder="Make" value={carDetails.make} onChange={handleChange} required />
      <Input name="model" type="text" placeholder="Model" value={carDetails.model} onChange={handleChange} required />
      <Input name="color" type="text" placeholder="Color" value={carDetails.color} onChange={handleChange} required />
      <Input name="trim" type="text" placeholder="Trim" value={carDetails.trim} onChange={handleChange} required />
      <Input name="mileage" type="number" placeholder="Mileage" value={carDetails.mileage} onChange={handleChange} required />
      <Input name="stock" type="number" placeholder="Stock No." value={carDetails.stock} onChange={handleChange} required />
      <Input name="engine" type="text" placeholder="Engine Size" value={carDetails.engine} onChange={handleChange} required />
      <Input name="engineType" type="text" placeholder="Engine Type" value={carDetails.engineType} onChange={handleChange} required />
      <Input name="transmission" type="text" placeholder="Transmission" value={carDetails.transmission} onChange={handleChange} required />
      <Input name="driveTrain" type="text" placeholder="Drive Train" value={carDetails.driveTrain} onChange={handleChange} required />
      <Input name="vehicleType" type="text" placeholder="Vehicle/Cab Type" value={carDetails.vehicleType} onChange={handleChange} required />
      <Input name="vin" type="text" placeholder="VIN" value={carDetails.vin} onChange={handleChange} required />
      <Input name="fuelType" type="text" placeholder="Fuel Type" value={carDetails.fuelType} onChange={handleChange} required />
      <Input name="retail_price" type="number" placeholder="Retail Price" value={carDetails.retail_price} onChange={handleChange} required />
      <Input name="asking_price" type="number" placeholder="Asking Price" value={carDetails.asking_price} onChange={handleChange} required />
      <Textarea name="description" placeholder="Optional Description" value={carDetails.description} onChange={handleChange} />      
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Images</label>
        <input type="file" name="images" multiple onChange={handleFileChange} className="mt-1 block w-full" />
      </div>
      <div className="flex justify-center">
        <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-700 transition-colors">Submit</Button>
      </div>
    </form>
  );
}

export default NewCarForm;