interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { id } = await params;

  const recentActivity = [
    "Asked: How to optimize React Server Components rendering?",
    "Answered: Best strategy for handling auth redirects in Next.js",
    "Commented: Suggested adding zod validation for API inputs",
  ];

  return (
    <main className="p-8">
      <section className="border-light-800 dark:border-dark-400 bg-light-900 dark:bg-dark-200 rounded-xl border p-6">
        <div className="flex flex-col gap-1">
          <h1 className="h1-bold text-dark100_light900">Profile</h1>
          <p className="paragraph-regular text-dark500_light700">User ID: {id}</p>
        </div>

        <p className="paragraph-regular text-dark500_light700 mt-6 max-w-2xl">
          Frontend engineer focused on React and Next.js. This is a starter profile page you can replace with data
          from your database.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border-light-800 dark:border-dark-400 rounded-lg border p-4">
            <p className="small-medium text-dark500_light700">Reputation</p>
            <p className="h3-bold text-dark100_light900 mt-2">1,245</p>
          </div>
          <div className="border-light-800 dark:border-dark-400 rounded-lg border p-4">
            <p className="small-medium text-dark500_light700">Questions</p>
            <p className="h3-bold text-dark100_light900 mt-2">18</p>
          </div>
          <div className="border-light-800 dark:border-dark-400 rounded-lg border p-4">
            <p className="small-medium text-dark500_light700">Answers</p>
            <p className="h3-bold text-dark100_light900 mt-2">42</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="h3-bold text-dark100_light900">Recent Activity</h2>
        <ul className="mt-4 space-y-3">
          {recentActivity.map((item) => (
            <li key={item} className="border-light-800 dark:border-dark-400 rounded-lg border p-4">
              <p className="paragraph-regular text-dark300_light900">{item}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default ProfilePage;
