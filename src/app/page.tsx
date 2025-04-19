import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Landing from "@/components/Landing"; // Capitalized and used as JSX
import { checkSuperAdmin } from "@/lib/checkSuperAdmin";

export default async function Home() {
  const token = (await cookies()).get("token")?.value;

  if (token) {
    const res = await fetch(
      `/api/user/getUser`,
      {
        method: "GET",
        headers: { token },
        cache: "no-store", // optional: avoids cached responses
      }
    );

    if (res.ok) {
      const user = await res.json();

      if (user.isAdmin) {
        redirect("/admin");
      } else {
        redirect("/user");
      }
    }

    const isSuperAdmin = await checkSuperAdmin(
      new Request(``, {
        headers: {
          token,
        },
      })
    );
    if (isSuperAdmin) {
      redirect("/superAdmin");
    }

    //clear the cookie token if user is not found
    (await cookies()).delete("token");
    redirect("/");
  }

  return <Landing />;
}
