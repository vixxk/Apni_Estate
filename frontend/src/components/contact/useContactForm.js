import { useState } from 'react';
import axios from 'axios';

const useContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrors({});
    
    try {

      const response = await axios.post('/api/forms', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message
      });
      
      if (response.data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        alert('✅ Message sent successfully!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      
      if (error.response?.data?.errors) {
        const backendErrors = {};
        
        if (Array.isArray(error.response.data.errors)) {
          error.response.data.errors.forEach(err => {
            const fieldName = err.path || err.param;
            backendErrors[fieldName] = err.msg;
          });
        }
        
        setErrors(backendErrors);
      } else if (error.code === 'ERR_NETWORK') {
        alert('❌ Cannot connect to server. Please make sure the backend is running.');
      } else {
        alert('❌ ' + (error.response?.data?.message || 'Failed to submit form'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    handleChange,
    handleSubmit
  };
};

export default useContactForm;
