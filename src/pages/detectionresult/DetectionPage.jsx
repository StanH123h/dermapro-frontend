import "./DetectionPage.scss";
import { Layout, Table, TabPane, Tabs} from "@douyinfe/semi-ui";
import {IconChevronLeft} from "@douyinfe/semi-icons";
import {useEffect, useRef, useState} from "react";
import {ACNETYPES, TRANSLATED_SKIN_TONE, TRANSLATED_SKIN_TYPE, TRANSLATED_WRINKLE_DATA} from "./constants";
import {useLocation, useNavigate} from "react-router-dom";

export const AcneAnalyze = ({imgUrl, data}) => {
    const imageRef = useRef(null); // 用于访问 img
    const [imageSize, setImageSize] = useState({width: 0, height: 0}); // 图片的显示尺寸
    const [imageLoaded, setImageLoaded] = useState(false); // 标记图片是否加载完成
    const [currentDisplayData, setCurrentDisplayData] = useState("acne");
    const currentDisplayDataTitle = {
        acne: "痤疮",
        brown_spot: "色斑",
        acne_mark: "痘印",
        acne_pustule: "脓包"
    };

    // 计算缩放比例并生成 SVG 标记
    const generateAnnotations = (acneType) => {
        const {width, height} = imageSize;
        const image = imageRef.current;

        if (image) {
            const scaleX = width / image.naturalWidth;
            const scaleY = height / image.naturalHeight;

            // 根据缩放比例计算每个标记的坐标
            const generateRectangles = (rectangles, color) => {
                return rectangles.map((rect, index) => {
                    const x = rect.left * scaleX;
                    const y = rect.top * scaleY;
                    const rectWidth = rect.width * scaleX;
                    const rectHeight = rect.height * scaleY;

                    return (
                        <rect
                            key={`rect-${color}-${index}`}
                            x={x}
                            y={y}
                            width={rectWidth}
                            height={rectHeight}
                            fill="none"
                            stroke={color}
                            strokeWidth="1"
                        />
                    );
                });
            };

            return (
                <>
                    {acneType === ACNETYPES.ACNE && generateRectangles(data.result.acne.rectangle, "red")}
                    {acneType === ACNETYPES.BROWN_SPOT && generateRectangles(data.result.brown_spot.rectangle, "blue")}
                    {acneType === ACNETYPES.ACNE_MARK && generateRectangles(data.result.acne_mark.rectangle, "green")}
                    {acneType === ACNETYPES.ACNE_PUSTULE && generateRectangles(data.result.acne_pustule.rectangle, "purple")}
                </>
            );
        }
        return null;
    };

    // 当图片加载或窗口大小变化时，更新图片显示尺寸
    useEffect(() => {
        const updateImageSize = () => {
            if (imageRef.current) {
                const rect = imageRef.current.getBoundingClientRect();
                setImageSize({width: rect.width, height: rect.height});
            }
        };

        if (imageLoaded) {
            updateImageSize();
        }

        window.addEventListener("resize", updateImageSize);
        return () => window.removeEventListener("resize", updateImageSize);
    }, [imageLoaded]);

    return (
        <div className={"acne-analysis"}>
            <h3 className="dry-skin-analysis">
                <span className="title">{"痤疮分析"}</span>
            </h3>
            <Tabs
                onTabClick={(key) => {
                    setCurrentDisplayData(key);
                }}
                type="line"
                className={"data-display-type-nav-bar"}
            >
                <TabPane
                    tab={currentDisplayDataTitle[ACNETYPES.ACNE]}
                    itemKey="acne"
                ></TabPane>
                <TabPane
                    tab={currentDisplayDataTitle[ACNETYPES.ACNE_MARK]}
                    itemKey="acne_mark"
                ></TabPane>
                <TabPane
                    tab={currentDisplayDataTitle[ACNETYPES.ACNE_PUSTULE]}
                    itemKey="acne_pustule"
                ></TabPane>
                <TabPane
                    tab={currentDisplayDataTitle[ACNETYPES.BROWN_SPOT]}
                    itemKey="brown_spot"
                ></TabPane>
            </Tabs>

            <div className="acne-graph" style={{position: "relative"}}>
                {/* 图片加载完成时触发 onLoad */}
                <img
                    ref={imageRef}
                    id="acne-image"
                    src={imgUrl}
                    alt="检测图片"
                    style={{width: "100%", height: "auto", display: "block"}}
                    onLoad={() => setImageLoaded(true)}
                />

                {imageLoaded && (
                    <svg
                        width={imageSize.width}
                        height={imageSize.height}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            pointerEvents: "none", // 避免阻挡鼠标事件
                            zIndex: 1,
                        }}
                    >
                        {generateAnnotations(currentDisplayData)}
                    </svg>
                )}
            </div>

        </div>
    );
};

const renderBlock = (blockTitle, columns, dataSource) => (
    <div style={{ marginBottom: '20px' }} className={"data-block"}>
        <h3>{blockTitle}</h3>
        <Table columns={columns} dataSource={dataSource} pagination={false} className={"table"} />
    </div>
);

const SkinAnalysis = ({ data }) => {
    const basicInfoColumns = [
        { title: '项目', dataIndex: 'name' },
        { title: '值', dataIndex: 'value' },
    ];
    const basicInfoData = [
        { key: '1', name: '皮肤年龄', value: data.skin_age.value },
        { key: '2', name: '肤色', value: TRANSLATED_SKIN_TONE[data.skintone.value] },
        { key: '3', name: '皮肤类型', value: TRANSLATED_SKIN_TYPE[data.skin_type.skin_type] },
    ];

    const hydrationColumns = [
        { title: '项目', dataIndex: 'name' },
        { title: '值', dataIndex: 'value' },
    ];
    const hydrationData = [
        { key: '1', name: '水分程度', value: data.water.water_severity },
        { key: '2', name: '粗糙度', value: data.rough.rough_severity },
    ];

    const poresColumns = [
        { title: '项目', dataIndex: 'name' },
        { title: '值', dataIndex: 'value' },
    ];
    const poresData = [
        { key: '1', name: '毛孔数量', value: data.enlarged_pore_count.forehead_count },
        { key: '2', name: '黑头数量', value: data.blackhead_count },
    ];

    const wrinkleColumns = [
        { title: '部位', dataIndex: 'part' },
        { title: '皱纹数量', dataIndex: 'count' },
    ];
    const wrinkleData = Object.entries(data.wrinkle_count).map(([key, value], index) => ({
        key: index,
        part: TRANSLATED_WRINKLE_DATA[key] || key, // 使用翻译后的变量名
        count: value,
    }));

    const darkCircleColumns = [
        { title: '项目', dataIndex: 'name' },
        { title: '值', dataIndex: 'value' },
    ];
    const darkCircleData = [
        { key: '1', name: '黑眼圈程度', value: data.dark_circle.value },
        { key: '2', name: '左眼黑眼圈得分', value: data.score_info.dark_circle_type_score.left_dark_circle_score },
        { key: '3', name: '右眼黑眼圈得分', value: data.score_info.dark_circle_type_score.right_dark_circle_score },
    ];

    const otherSkinColumns = [
        { title: '项目', dataIndex: 'name' },
        { title: '值', dataIndex: 'value' },
    ];
    const otherSkinData = [
        { key: '1', name: '雀斑', value: data.freckle.value },
        { key: '2', name: '黄褐斑', value: data.melasma.value },
    ];

    return (
        <div>
            {renderBlock('基本信息', basicInfoColumns, basicInfoData)}
            {renderBlock('水分和粗糙度', hydrationColumns, hydrationData)}
            {renderBlock('毛孔和黑头', poresColumns, poresData)}
            {renderBlock('皱纹和细纹', wrinkleColumns, wrinkleData)}
            {renderBlock('黑眼圈', darkCircleColumns, darkCircleData)}
            {renderBlock('其他皮肤状况', otherSkinColumns, otherSkinData)}
        </div>
    );
};

export const DetectionPage = () => {
    const location=useLocation();
    const responseData=location.state?.responseData;
    const capturedImage=location.state?.capturedImage;
    const navigate=useNavigate();
    const {Header,Content,Footer}=Layout;

    return (
        <div className={"detection-page"}>
            <Layout>
                <Header className="header">
                    <IconChevronLeft onClick={()=>{navigate("/")}}/>
                </Header>
                <Content className="content">
                    <div className="report-info">
                        <h3 className={"title"}>皮肤报告:2024/09/27</h3>
                        <span className={"result-id"} style={{color: "rgb(150,152,152)"}}>
                            ID:912839081283
                        </span>
                    </div>
                    <AcneAnalyze imgUrl={capturedImage} data={responseData}/>
                    <SkinAnalysis data={responseData.result}></SkinAnalysis>
                </Content>
                <Footer className="footer"></Footer>
            </Layout>
        </div>
    )
        ;
};

