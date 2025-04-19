import SignIn from "@/components/SignIn";
export default function LoginPage() {
  return <SignIn role="Admin" api="/api/admin/login" nextPage="/admin"/>;
}
