import {Route} from "react-router-dom";

const createRoutes = (routes) => {
    return routes.map(({ index, path, component}) => {
        return <Route key={index} path={path} element={component} />;
    });
};

export default createRoutes