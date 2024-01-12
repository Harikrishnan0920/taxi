import { Api_url } from "./env_variable";
import axios from "axios";

export const fetchUserDetails = async (setData) => {
   let userId=sessionStorage.getItem('uID')
    try {
      const response = await axios.get(`${Api_url}/getUserDetails/${userId}`);
      debugger
      if(response.data.statusCode==200){
        setData(response.data.data)
        return 
      }else{
      setData([])
      return 
      }
    } catch (error) {
     return console.error(error)
    }
  };