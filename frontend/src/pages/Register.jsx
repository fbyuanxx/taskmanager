import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()){
      newErrors.name = 'Name is required.';
    }
    if (!formData.email.trim()){
      newErrors.email = 'Email is required.';
    }else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email.trim())){
        newErrors.email = 'please enter a valid email address.';
      }
    }

    if (!formData.password){
      newErrors.password = 'Password is required.';
    }

    if (!formData.confirmPassword){
      newErrors.confirmPassword = 'Please confirm your password.';
    }else if (formData.password !== formData.confirmPassword){
      newErrors.confirmPassword = 'Password do not match.';
    }
    setErrors (newErrors);
    return Object.keys(newErrors).length === 0;
  };
    const handleSubmit = async (e) => {
    e.preventDefault();
    if (! validateForm()){
      return;
    }
    try {
      await axiosInstance.post('/api/auth/register', formData);
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      alert(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} noValidate className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-1 text-center">Register</h1>
        <label htmlFor='name' className='block mb-1 font-medium'>Name</label>
        <input
          id='name'
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && (
          <p className='text-red-600 text-sm mb-4'>
            {errors.name}
          </p>
        )}
        <label htmlFor='email' className='block mb-1 font-medium'>Email</label>
        <input
          id='email'
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
          aria-invalid={Boolean(errors.email)}
        />
         {errors.email && (
          <p className='text-red-600 text-sm mb-4'>
            {errors.email}
          </p>
        )}
        <label htmlFor='password' className='block mb-1 font-medium'>Password</label>
        <input
          id='password'
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password && (
          <p className='text-red-600 text-sm mb-4'>
            {errors.password}
          </p>
        )}
        <label htmlFor='confirmPassword' className='block mb-1 font-medium'>confirmPassword</label>
        <input
          id='confirmPassword'
          type="password"
          placeholder='Confirm Password'
          value={formData.confirmPassword}
          onChange={(e) =>setFormData({ ...formData, confirmPassword: e.target.value }) }
          className='w-full mb-4 p-2 border rounded'
          required
          aria-invalid={Boolean(errors.confirmPassword)}
          />
          {errors.confirmPassword &&(
            <p className='text-red-600 text-sm mb-4'>
              {errors.confirmPassword}
            </p>
          )}
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
