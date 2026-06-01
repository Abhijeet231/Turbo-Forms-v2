import DashboardSkeleton from "../../components/skeleton/DashboardSkeleton"
import { useAuth } from "../../context/AuthContext"



const Dashboard = () => {
const { status} = useAuth();

if( status === "loading") return <DashboardSkeleton/>

  return (
    <div>
      <h2>Dashboard</h2>
      
    </div>
  )
}

export default Dashboard