import {IconCamera} from "@douyinfe/semi-icons";
import {useNavigate} from "react-router-dom";

export const PhotoSnapButton=()=>{
    const navigate=useNavigate()
    return(
        <IconCamera onClick={()=>{navigate('/snapshot')}} />
    )
}