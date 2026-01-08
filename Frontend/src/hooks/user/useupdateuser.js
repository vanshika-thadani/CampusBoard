import axios from "axios";
import { useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useUpdateUser = () => {
  const [updateUserResponse, setUpdateUserResponse] = useState(null);
  

  const updateUser = async (updateData, imageFile) => {
   
    try {
      const formdata = new FormData();
      formdata.append("oldPassword", updateData.oldpassword);
      formdata.append("newPassword", updateData.newpassword);
      formdata.append("confirmPassword", updateData.confirmpassword);
      formdata.append("email", updateData.email);
      formdata.append("username", updateData.username);
      if (imageFile) {
        formdata.append("profilephoto", imageFile);
      }

      const res = await axios.put(
        `${BASE_URL}/api/user`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      setUpdateUserResponse(res.data);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return { updateUser, updateUserResponse};
};