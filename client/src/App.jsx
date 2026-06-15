import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes';
import { checkAuth } from './store/slices/authSlice';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
