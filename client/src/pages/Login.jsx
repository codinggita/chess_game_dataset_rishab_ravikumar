/* ── Login Page ──
   Split-screen layout per PRD §9 (PR 18).
   Left: chess art + floating pieces + headline.
   Right: Formik + Yup form, auth thunk, toast errors.
*/

import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { loginUser } from '../store/slices/authSlice';
import { usePageMeta } from '../hooks/usePageMeta';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

/* ─── Validation Schema ─── */

const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

/* ─── Decorative Floating Pieces ─── */

const floatingPieces = [
  { symbol: '\u2654', size: 120, opacity: 0.08, top: '8%', left: '5%', delay: 0 },
  { symbol: '\u265B', size: 100, opacity: 0.06, top: '65%', left: '10%', delay: 1.5 },
  { symbol: '\u265C', size: 80, opacity: 0.05, top: '20%', right: '15%', delay: 0.8 },
  { symbol: '\u265E', size: 90, opacity: 0.07, top: '75%', right: '8%', delay: 2.2 },
  { symbol: '\u265D', size: 70, opacity: 0.04, top: '45%', left: '35%', delay: 0.3 },
];

/* ─── Component ─── */

export default function Login() {
  usePageMeta('Sign In');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useSelector((state) => state.auth);
  const from = location.state?.from?.pathname || '/dashboard';

  /* ─── Submit Handler ─── */

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await dispatch(loginUser(values));
      if (loginUser.fulfilled.match(result)) {
        navigate(from, { replace: true });
      } else {
        toast.error(result.payload || 'Invalid email or password');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left Panel — 60% — Chess Art ── */}
      <div className="chess-bg chess-bg-auth relative hidden w-[60%] flex-col overflow-hidden p-10 lg:flex">
        {/* Floating decorative pieces */}
        {floatingPieces.map((piece, i) => (
          <span
            key={i}
            className="pointer-events-none absolute select-none text-gold-primary"
            style={{
              fontSize: piece.size,
              opacity: piece.opacity,
              filter: 'blur(1px)',
              top: piece.top,
              left: piece.left,
              right: piece.right,
              animation: `float 6s ease-in-out ${piece.delay}s infinite`,
            }}
            aria-hidden="true"
          >
            {piece.symbol}
          </span>
        ))}

        {/* Content container — vertically centered */}
        <div className="relative z-10 flex flex-1 flex-col justify-center">
          {/* Logo */}
          <div className="mb-12">
            <span className="font-display text-[16px] font-semibold text-gold-primary">
              {'\u265E'} ChessIQ Analytics
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-[36px] font-bold leading-tight text-text-primary">
            Every move tells a story.
          </h1>

          {/* Subtext */}
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-text-secondary">
            Uncover the hidden patterns in your chess games with data-driven
            insights and analytics.
          </p>

          {/* Features — inline per spec: ♟ Player performance · ♟ Opening analysis · ♟ Real-time analytics */}
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-text-secondary">
            <span className="text-gold-primary">{'\u265F'}</span> Player performance{' '}
            <span className="text-text-tertiary">&middot;</span>{' '}
            <span className="text-gold-primary">{'\u265F'}</span> Opening analysis{' '}
            <span className="text-text-tertiary">&middot;</span>{' '}
            <span className="text-gold-primary">{'\u265F'}</span> Real-time analytics
          </p>
        </div>
      </div>

      {/* ── Right Panel — 40% — Login Form ── */}
      <div className="flex w-full flex-col justify-center bg-bg-surface px-10 py-12 lg:w-[40%] lg:border-l lg:border-border-subtle">
        <div className="mx-auto w-full max-w-sm">
          {/* Heading */}
          <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.15em] text-text-tertiary">
            Welcome back
          </p>

          {/* ── Form ── */}
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

                {/* Forgot password link */}
                <div className="text-right">
                  <button
                    type="button"
                    className="text-[12px] text-gold-primary transition-colors hover:text-gold-hover"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
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

          {/* ── Divider ── */}
          <div className="my-8 flex items-center gap-3">
            <span className="h-px flex-1 bg-border-subtle" />
            <span className="text-[12px] text-text-tertiary">or</span>
            <span className="h-px flex-1 bg-border-subtle" />
          </div>

          {/* ── Register link ── */}
          <p className="text-center text-[13px] text-text-secondary">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-gold-primary transition-colors hover:text-gold-hover"
            >
              Register &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
