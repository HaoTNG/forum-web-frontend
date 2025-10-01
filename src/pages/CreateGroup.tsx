import React, { useState } from "react";
import { createGroup } from "../services/group.ts";
import { useNavigate } from "react-router-dom";


export default function CreateGroup(){
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        try{
          const res = await createGroup(name, description);
          navigate(`/group/${res.groupId}`);
          //console.log(res)

        }catch(err: any){
          console.log(err);
          alert("failed to create group")
        }
    }




     return (
       <div className="max-w-5xl mx-auto mt-12">
         <div className="bg-white shadow-lg rounded-2xl p-8 border">
           <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
             Create new group
           </h2>
   
           <form onSubmit={handleSubmit} className="flex flex-col gap-6">
             {/* Title */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 Name
               </label>
               <input
                 className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                 type="text"
                 placeholder="Enter a name for the group"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 required
               />
             </div>
   
             {/* Content */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 Description
               </label>
               <textarea
                 className="w-full border rounded-lg px-3 py-2 h-32 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
                 placeholder="Write the description about your group here..."
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 required
               />
             </div>
   
             {/* Submit button */}
             <button
               className="bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition-transform shadow-md"
               type="submit"
             >
                Create Group
             </button>
           </form>
         </div>
       </div>
     );
}