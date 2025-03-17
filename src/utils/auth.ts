// In src/utils/auth.ts
import { NavigateFunction } from 'react-router-dom';

export const logout = (navigate: NavigateFunction): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');
  
  navigate('/login');
};

