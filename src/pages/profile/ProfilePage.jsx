import { Avatar, Card, Layout, Toast } from "@douyinfe/semi-ui";
import { BottomNavBar } from "../../components/BottomNavBar/BottomNavBar";
import React, {useState, useRef, useEffect} from "react";
import axiosInstance from "../../api/axiosInstance";
import "./ProfilePage.scss";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion"

export const ProfilePage = () => {
    const [userInfo,setUserInfo] = useState({})
    useEffect(() => {
        const res = {
            data:{

                "name": "knknknk",
                "phoneNumber": "bjbjbjbjbjj",
                "email": "1735443634@qq.com",
                "age": 0,
                "avatar": null,
                "gender": 0
            }
        }
        // axiosInstance.get("user/userInfo").then(
        //     res=>{
        //         setUserInfo(res.data)
        //     }
        // )
        setUserInfo(res.data)
    }, []);
    const navigate=useNavigate()
    const { Header, Content, Footer } = Layout;
    const [avatar, setAvatar] = useState(null); // 用于存储用户头像的 URL 或文件
    const fileInputRef = useRef(null); // 引用文件输入框

    const handleAvatarClick = () => {
        fileInputRef.current.click(); // 模拟点击文件上传控件
    };

    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {

            const response = await axiosInstance.post("/user/uploadAvatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 200) {
                Toast.success("头像上传成功！");
                setAvatar(URL.createObjectURL(file)); // 更新头像显示
            }
        } catch (error) {
            Toast.error("头像上传失败，请稍后重试！");
        }
    };

    return (
        <div className="profile-page">
            <Layout>
                <Header className="header">
                </Header>
                <Content className="content">
                    <div className="user-name-and-avatar-and-email">
                        <motion.div className="avatar" initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}>
                            <Avatar
                                size="large"
                                src={avatar}
                                style={{margin: 4, cursor: "pointer"}}
                                alt="User Avatar"
                                onClick={handleAvatarClick} // 点击头像触发文件选择
                            >
                                {avatar ? null : "U"}
                            </Avatar> <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{display: "none"}} // 隐藏文件输入框
                            onChange={handleAvatarUpload}
                        />
                        </motion.div>
                        <div className="text">
                            <motion.h3 initial={{ opacity: 0, scale: 0 }}
                                       animate={{ opacity: 1, scale: 1 }}>User</motion.h3>
                            <motion.div initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }} className="email">{userInfo.email}</motion.div>
                        </div>
                    </div>
                    <div className="skin-history-and-trend">
                    <Card onClick={()=>navigate("/history",{state:{dataType:"insight"}})} className="skin-trend">
                            <h4>肤质变化</h4>
                        </Card>
                        <Card onClick={()=>navigate("/history",{state:{dataType:"history"}})} className="skin-history">
                            <h4>肤质历史</h4>
                        </Card>
                    </div>
                    <Card className="my-skin-info">
                        <h4>我的信息</h4>
                        <br />
                        <h4>年龄:{userInfo.age||"未填写"}</h4>
                        <h4>性别:{userInfo.gender||"未填写"}</h4>
                        <h4>手机号:{userInfo.phoneNumber||"未填写"}</h4>
                        <br />
                    </Card>
                    <Card className="my-footprint">
                        <h4>我的浏览足迹</h4>
                    </Card>
                    <Card className="my-subscribes">
                        <h4>我收藏的文章</h4>
                    </Card>
                </Content>
                <Footer className="footer">
                    <BottomNavBar currentPage="profile" />
                </Footer>
            </Layout>
        </div>
    );
};
