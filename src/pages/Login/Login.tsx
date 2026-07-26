import AuthLayout from "../../components/AuthLayout/AuthLayout"
import LoginForm from "../../components/LoginForm/LoginForm";

export interface LoginFormState {
    email: string;
    password: string;
}

function Login() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
export default Login;
