import {Nav} from "@douyinfe/semi-ui";
import {Link} from "react-router-dom";
import "./BottomNavBar.scss"
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
                {itemKey: "HistoryData", icon: <img src={"history-data-page-icon.svg"} alt={"history-icon"}
                                                    style={currentPage==="history"?{border:"lightblue 2px solid"}:{}}
                    />},
                {itemKey: "Home", icon: <img src={"main-page-icon.svg"} alt={"home-icon"}
                                             style={currentPage==="home"?{border:"lightblue 2px solid"}:{}}
                    />},
                {itemKey: "Profile", icon: <img src={"profile-page-icon.svg"} alt={"profile-icon"}
                                                style={currentPage==="profile"?{border:"lightblue 2px solid"}:{}}
                    />},
            ]}
        ></Nav>
    )
}