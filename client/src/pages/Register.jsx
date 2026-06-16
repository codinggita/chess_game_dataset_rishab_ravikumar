/* ── Register Page ──
   Split-screen layout via AuthLayout + PasswordStrengthBar.
   Left: chess art. Right: Formik + Yup register form.
*/

import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import { registerUser } from '../store/slices/authSlice';
import { usePageMeta } from '../hooks/usePageMeta';
import AuthLayout from '../features/auth/AuthLayout';
import PasswordStrengthBar from '../features/auth/PasswordStrengthBar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const registerSchema = Yup.object({
  name: Yup.string().min(2, 'Minimum 2 characters').required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function Register() {
  usePageMeta('Create Account');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await dispatch(
        registerUser({ name: values.name, email: values.email, password: values.password }),
      );
      if (registerUser.fulfilled.match(result)) {
        toast.success('Account created!');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(result.payload || 'Registration failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.15em] text-text-tertiary">
        Create account
      </p>

      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ getFieldProps, errors, touched, isSubmitting, values }) => (
          <Form className="flex flex-col gap-5">
            <Input
              label="Name"
              type="text"
              placeholder="Your name"
              error={touched.name && errors.name}
              disabled={isSubmitting || isLoading}
              {...getFieldProps('name')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={touched.email && errors.email}
              disabled={isSubmitting || isLoading}
              {...getFieldProps('email')}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder={'\u2022'.repeat(8)}
                error={touched.password && errors.password}
                disabled={isSubmitting || isLoading}
                {...getFieldProps('password')}
              />
              <PasswordStrengthBar password={values.password} />
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder={'\u2022'.repeat(8)}
              error={touched.confirmPassword && errors.confirmPassword}
              disabled={isSubmitting || isLoading}
              {...getFieldProps('confirmPassword')}
            />

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              loading={isSubmitting || isLoading}
              type="submit"
            >
              Create Account
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
        Already have an account?{' '}
        <a
          href="/login"
          className="font-medium text-gold-primary transition-colors hover:text-gold-hover"
        >
          Sign in &rarr;
        </a>
      </p>
    </AuthLayout>
  );
}
