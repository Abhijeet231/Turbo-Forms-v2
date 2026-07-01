import { useParams } from "react-router-dom"


const FormBuilder = () => {

  const {id} = useParams<{id: string}>();

  return (<>
    <div>FormBuilder</div>
    <p>Your Form Id is : {id} </p>
    </>
  )
}

export default FormBuilder