import { useParams } from "react-router-dom"
import BuilderLayout from "@/components/formBuilder/BuilderLayout";

const FormBuilder = () => {

  const {id} = useParams<{id: string}>();

  return (<>
   <BuilderLayout/>
    </>
  )
}

export default FormBuilder