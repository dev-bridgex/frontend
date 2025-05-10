import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./Pages/Home/Home";
import Communities from "./Pages/Communities/Communities";
import Community from './Pages/Community/Community';
import SignIn from "./Pages/Auth/SignIn/SignIn";
import SignUp from "./Pages/Auth/SignUp/SignUp";
import RequestResetCode from "./Pages/Auth/RequestResetCode/RequestResetCode";
import VerifyResetCode from "./Pages/Auth/VerifyResetCode/VerifyResetCode";
import ResetPassword from "./Pages/Auth/ResetPassword/ResetPassword";
import VerifyEmail from "./Pages/Auth/VerifyEmail/VerifyEmail";
import Team from './Pages/Team/Team';
import SubTeam from "./Pages/SubTeam/SubTeam";
import LearningPhase from "./Pages/LearningPhase/LearningPhase";
import ManageMembers from "./Pages/ManageMembers/ManageMembers";
import ManageProfile from "./Pages/ManageProfile/ManageProfile";
import NotFound from "./Pages/NotFound/NotFound";
import SubTeamChannel from './Pages/SubTeamChannel/SubTeamChannel';
import TeamChannel from './Pages/TeamChannel/TeamChannel';
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "./components/PublicRoute/PublicRoute";

export default function App() {
  let routers = createBrowserRouter([
    {
      path: "", element: <Layout />, children: [
        { index: true, element: <Home /> },
        {
          path: "communities",
          element: <Communities />
        },
        {
          path: "manageProfile",
          element: <ProtectedRoute><ManageProfile /></ProtectedRoute>
        },
        {
          path: "communities/community/:communityId",
          element: <Community />
        },
        { path: "communities/community/:communityId/teams/:teamId", element: <Team /> },
        { path: "communities/community/:communityId/teams/:teamId/subteams/:subTeamId", element: <SubTeam /> },
        { path: "communities/community/:communityId/teams/:teamId/subteams/:subTeamId/LearningPhase", element: <ProtectedRoute><LearningPhase /></ProtectedRoute> },
        { path: "communities/:communityId/teams/:teamId/subteams/:subTeamId/manageMembers", element: <ProtectedRoute><ManageMembers /></ProtectedRoute> },
        { path: "/communities/:communityId/teams/:teamId/subteams/:subTeamId/channels/:channelName/:channelId", element: <ProtectedRoute><SubTeamChannel /></ProtectedRoute> },
        { path: "/communities/:communityId/teams/:teamId/channels/:channelName/:channelId", element: <ProtectedRoute><TeamChannel /></ProtectedRoute> },
        { path: "*", element: <NotFound /> },
      ]
    },
    { path: "signUp", element: <PublicRoute><SignUp /></PublicRoute> },
    { path: "signIn", element: <PublicRoute><SignIn /></PublicRoute> },
    { path: "/signUp/verifyEmail", element: <PublicRoute><VerifyEmail /></PublicRoute> },
    { path: "RequestResetCode", element: <PublicRoute><RequestResetCode /></PublicRoute> },
    { path: "RequestResetCode/VerifyResetCode", element: <PublicRoute><VerifyResetCode /></PublicRoute> },
    { path: "RequestResetCode/VerifyResetCode/ResetPassword", element: <PublicRoute><ResetPassword /></PublicRoute> },
  ])

  return <RouterProvider router={routers} />
}


