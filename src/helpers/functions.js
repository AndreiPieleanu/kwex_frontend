import { useNavigate } from "react-router-dom";

export const useHelperFunctions = () => {
    const navigate = useNavigate();

    const CheckIfRoleIsAllowed = (currentRole, rolesToCheck) => {
        if (!currentRole || !rolesToCheck) {
            return;
        }
        const roleFound = rolesToCheck.includes(currentRole);
        if (!roleFound) {
            navigate('/unauthorized');
        }
    };

    return { CheckIfRoleIsAllowed };
};
