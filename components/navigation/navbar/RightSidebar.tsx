import ROUTES from "@/constants/routes";
import Link from "next/link";
import Image from "next/image";
import TagCard from "@/components/cards/TagCard";

const hotQuestions = [
  {
    _id: 1,
    title: "How to implement a binary search algorithm in Python?",
    votes: 150,
    answers: 25,
    views: 5000,
  },
  {
    _id: 2,
    title: "What is the difference between Java and JavaScript?",
    votes: 120,
    answers: 30,
    views: 4500,
  },
  {
    _id: 3,
    title: "How to optimize SQL queries for better performance?",
    votes: 100,
    answers: 20,
    views: 4000,
  },
];

const popularTags = [
  {
    _id: 1,
    name: "JavaScript",
    questions: 5000,
  },
  {
    _id: 2,
    name: "Python",
    questions: 4500,
  },
  {
    _id: 3,
    name: "Java",
    questions: 4000,
  },
];

const RightSidebar = () => {
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 right-0 flex h-screen w-87.5 flex-col gap-6 overflow-y-auto border-l px-6 pt-36 max-xl:hidden dark:shadow-none">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <div className="mt-7 flex w-full flex-col gap-7.5">
          {hotQuestions.map((question) => (
            <Link
              key={question._id}
              href={ROUTES.QUESTIONS(question._id.toString())}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="text-dark500_light700 body-medium">{question.title}</p>
              <Image
                src="/icons/chevron-right.svg"
                alt="Chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <TagCard
              key={tag._id}
              _id={tag._id.toString()}
              name={tag.name}
              questions={tag.questions}
              compact
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
