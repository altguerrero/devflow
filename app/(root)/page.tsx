import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/cards/QuestionCard";

const questions = [
  {
    _id: "1",
    title: "How to implement authentication in React?",
    tags: [
      { _id: "1", name: "react" },
      { _id: "2", name: "authentication" },
      { _id: "3", name: "javascript" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      image: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
    },
    createdAt: new Date("2023-01-01T00:00:00Z"),
    upvotes: 10,
    answers: 5,
    views: 150,
  },
  {
    _id: "2",
    title: "What is the difference between useState and useReducer?",
    tags: [
      { _id: "1", name: "react" },
      { _id: "4", name: "hooks" },
      { _id: "5", name: "state-management" },
    ],
    author: {
      _id: "2",
      name: "John Doe",
      image: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
    },
    createdAt: new Date("2023-01-02T00:00:00Z"),
    upvotes: 8,
    answers: 3,
    views: 120,
  },
];

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
        {questions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
};

export default HomePage;
