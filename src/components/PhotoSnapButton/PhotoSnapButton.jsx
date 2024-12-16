import { IconCamera } from "@douyinfe/semi-icons";
import { motion } from "framer-motion";
import "./PhotoSnapButton.scss";
import {useNavigate} from "react-router-dom";

export const PhotoSnapButton = () => {
    const navigate = useNavigate();
    return (
        <motion.div
            className="photo-snap-button"
            onClick={()=>navigate("/snapshot")}
            animate={{
                scale: [1, 1.05, 1], // 动画序列：从1到1.05，再回到1，模拟呼吸
            }}
            transition={{
                duration: 2,
                ease: "easeInOut", // 平滑过渡
                repeat: Infinity,  // 无限循环
                repeatType: "loop",  // 循环方式
            }}
        >
            <IconCamera className="icon" size={"extra-large"} />
        </motion.div>
    );
};
