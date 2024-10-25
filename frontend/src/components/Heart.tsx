import { GoHeart, GoHeartFill } from "react-icons/go";

const Heart: React.FC<{ isFilled: boolean }> = ({ isFilled }) => (
	<>
		{isFilled ? <GoHeartFill size={20} color="red" /> : <GoHeart size={20} />}
	</>
);

export default Heart;
