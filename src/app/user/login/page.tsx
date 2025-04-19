import SignIn from "@/components/SignIn";
export default function LoginPage() {
  return <SignIn role="User" api="/api/user/login" nextPage="/user"/>;
}
