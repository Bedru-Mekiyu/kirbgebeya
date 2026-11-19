import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In | Afar Aid"
        description="Access the Afar Aid admin dashboard to manage operations, users, and activities securely."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
