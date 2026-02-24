import AUTH_APP_ROUTES from "@/constants/app-routes/auth";
import NAVIGATION_APP_ROUTES from "@/constants/app-routes/navigation";
import PROFILE_APP_ROUTES from "@/constants/app-routes/profile";
import QUESTION_APP_ROUTES from "@/constants/app-routes/questions";
import TAG_APP_ROUTES from "@/constants/app-routes/tags";

const APP_ROUTES = {
  ...NAVIGATION_APP_ROUTES,
  ...AUTH_APP_ROUTES,
  ...PROFILE_APP_ROUTES,
  ...TAG_APP_ROUTES,
  ...QUESTION_APP_ROUTES,
};

export default APP_ROUTES;
