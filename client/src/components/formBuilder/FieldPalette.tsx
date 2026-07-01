// lefft side bar that contians all the fields
import {useGetAllFields} from "@/hooks/form-field/useGetAllFields"
import { useParams } from "react-router-dom";

const FieldPalette = () => {

    const {id} = useParams<{id: string}>();
    
  const {data, isLoading, error, refetch} = useGetAllFields(id!);

  console.log("DATAAAA", data)

  return (
    <div>FieldPalette</div>
  )
}

export default FieldPalette