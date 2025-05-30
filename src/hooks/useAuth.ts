import { useSelector } from "react-redux";
import { StateType } from "store/root-reducer";

export const useAuth = () => {
    const { data: {
        email,
        token,
        id
    }, errors } = useSelector((state: StateType) => state.user);

    return {
        isAuth: !!email,
        email,
        token,
        id,
        errors,
    }
}