import React, { useEffect } from 'react';
import axios from 'axios';

const HardwareInput = ({ children, setDataPackage }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.1.167:5500/data');
        setDataPackage(response.data.dataPackage);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, [setDataPackage]);

  return (
    <div>
      {children}
    </div>
  );
};

export default HardwareInput;
