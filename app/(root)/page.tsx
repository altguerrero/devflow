import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";

const HomePage = () => {
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button className="primary-gradient text-light-900! min-h-11.5 px-4 py-3" asChild>
          <Link href={ROUTES.ASK_QUESTION}>Ask a question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.HOME}
          imgSrc="/icons/search.svg"
          placeholder="Search Questions..."
          otherClasses="flex-1"
          iconPosition={"left"}
        />
      </section>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        <p>Question Card 1</p>
        <p>Question Card 2</p>
        <p>Question Card 3</p>
      </div>
    </>
  );
};

export default HomePage;
