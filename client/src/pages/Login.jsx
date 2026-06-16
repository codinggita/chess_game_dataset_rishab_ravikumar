/* ── Login Page ──
   Split-screen layout via AuthLayout.
   Left: chess art. Right: Formik + Yup login form.
*/

import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

import { loginUser } from '../store/slices/authSlice';
import { showToast } from '../components/ui/Toast';
import { usePageMeta } from '../hooks/usePageMeta';
import AuthLayout from '../features/auth/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

export default function Login() {
  usePageMeta('Sign In');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useSelector((state) => state.auth);
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await dispatch(loginUser(values));
      if (loginUser.fulfilled.match(result)) {
        navigate(from, { replace: true });
      } else {
        showToast(result.payload || 'Invalid email or password', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.15em] text-text-tertiary">
        Welcome back
      </p>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ getFieldProps, errors, touched, isSubmitting }) => (
          <Form className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={touched.email && errors.email}
              disabled={isSubmitting || isLoading}
              {...getFieldProps('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder={'\u2022'.repeat(8)}
              error={touched.password && errors.password}
              disabled={isSubmitting || isLoading}
              {...getFieldProps('password')}
            />

            <div className="text-right">
              <button
                type="button"
                className="text-[12px] text-gold-primary transition-colors hover:text-gold-hover"
              >
                Forgot password?
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              loading={isSubmitting || isLoading}
              type="submit"
            >
              Sign In
            </Button>
          </Form>
        )}
      </Formik>

      <div className="my-8 flex items-center gap-3">
        <span className="h-px flex-1 bg-border-subtle" />
        <span className="text-[12px] text-text-tertiary">or</span>
        <span className="h-px flex-1 bg-border-subtle" />
      </div>

      <p className="text-center text-[13px] text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="font-medium text-gold-primary transition-colors hover:text-gold-hover"
        >
          Register &rarr;
        </Link>
      </p>
    </AuthLayout>
  );
}
