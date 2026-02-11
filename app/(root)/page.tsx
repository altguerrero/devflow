import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import ROUTES from "@/constants/routes";

const Page = () => {
  return (
    <main className="p-8">
      <h1 className="mb-4 text-4xl font-bold">Titulo con Inter</h1>
      <h2 className="font-space-grotesk text-4xl font-bold">Titulo con Space Grotesk</h2>
      <form
        className="px-10 pt-25"
        action={async () => {
          "use server";

          await signOut({ redirectTo: ROUTES.SIGN_IN });
        }}
      >
        <Button type="submit">Log out</Button>
      </form>
    </main>
  );
};

export default Page;
