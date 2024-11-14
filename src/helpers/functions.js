import { useNavigate } from "react-router-dom";

export const HelperFunctions = {
    CheckIfRoleIsAllowed: (currentRole, rolesToCheck) => {
        const navigate = useNavigate();
        if(!currentRole || !rolesToCheck){
            return;
        }
        const roleFound = rolesToCheck.includes(currentRole);
        if(!roleFound){
            navigate('/unauthorized');
        }
    }
}