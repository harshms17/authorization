import SignIn from "@/components/SignIn";
export default function LoginPage() {
  return <SignIn role="Super Admin" api="/api/superAdmin/login" nextPage="/superAdmin"/>;
}
