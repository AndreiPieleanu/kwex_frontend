import { useNavigate } from "react-router-dom";
let navigate = useNavigate();
export const HelperFunctions = {
    
    CheckIfRoleIsAllowed: (currentRole, rolesToCheck) => {
        if(!currentRole || !rolesToCheck){
            return;
        }
        const roleFound = rolesToCheck.includes(currentRole);
        if(!roleFound){
            navigate('/unauthorized');
        }
    }
}