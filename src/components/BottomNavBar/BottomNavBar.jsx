import {Nav} from "@douyinfe/semi-ui";
import {Link} from "react-router-dom";
import "./BottomNavBar.scss"
import {
    IconFolder,
    IconFolderStroked,
    IconHome,
    IconHomeStroked,
    IconUser,
    IconUserStroked
} from "@douyinfe/semi-icons";
export const BottomNavBar = ({currentPage}) => {
    return (
        <Nav
            className={"bottom-nav-bar"}
            mode={"horizontal"}
            renderWrapper={({itemElement, isSubNav, isInSubNav, props}) => {
                const routerMap = {
                    Home: "/",
                    HistoryData: "/history",
                    Profile: "/profile",
                };
                return (
                    <Link
                        style={{textDecoration: "none"}}
                        to={routerMap[props.itemKey]}
                    >
                        {itemElement}
                    </Link>
                );
            }}
            items={[
                {itemKey: "HistoryData", icon: currentPage==="history"?<IconFolder/>:<IconFolderStroked/>},
                {itemKey: "Home", icon: currentPage==="home"?<IconHome/>:<IconHomeStroked/>},
                {itemKey: "Profile", icon: currentPage==="profile"?<IconUser/>:<IconUserStroked/>}
            ]}
        ></Nav>
    )
}