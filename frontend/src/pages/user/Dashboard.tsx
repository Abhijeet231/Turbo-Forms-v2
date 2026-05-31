import DashboardSkeleton from "../../components/skeleton/DashboardSkeleton"
import { useAuth } from "../../context/AuthContext"



const Dashboard = () => {
const {user, status} = useAuth();

if( status === "loading") return <DashboardSkeleton/>

  return (
    <div>
      <h2>Dashboard</h2>
      <p>{user?.fullName}</p>
    </div>
  )
}

export default Dashboard