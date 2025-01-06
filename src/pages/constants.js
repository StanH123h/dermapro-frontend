export const ACNETYPES={
    "ACNE":"acne",
    "BROWN_SPOT":"brown_spot",
    "ACNE_MARK":"acne_mark",
    "ACNE_PUSTULE":"acne_pustule"
}

export const TRANSLATED_WRINKLE_DATA = {
    forehead_count: "额头皱纹数量",
    left_undereye_count: "左眼下方皱纹数量",
    right_undereye_count: "右眼下方皱纹数量",
    left_mouth_count: "左嘴角皱纹数量",
    right_mouth_count: "右嘴角皱纹数量",
    left_nasolabial_count: "左侧鼻唇沟皱纹数量",
    right_nasolabial_count: "右侧鼻唇沟皱纹数量",
    glabella_count: "眉间皱纹数量",
    left_cheek_count: "左脸颊皱纹数量",
    right_cheek_count: "右脸颊皱纹数量",
    left_crowsfeet_count: "左侧鱼尾纹数量",
    right_crowsfeet_count: "右侧鱼尾纹数量",
};

export const TRANSLATED_SKIN_TYPE={
    0:"油性皮肤",
    1:"干性皮肤",
    2:"中性皮肤",
    3:"混合性皮肤"
}

export const TRANSLATED_SKIN_TONE={
    0:"透白",
    1:"白皙",
    2:"自然",
    3:"小麦",
    4:"黝黑/古铜"
}

export const WATER_SEVERITY_TRANSLATION=(severity)=>{
    if(severity<=20){
        return "正常"
    }
    else if(severity<=50){
        return "轻度缺水"
    }
    else if(severity<=80){
        return "中度缺水"
    }
    else{
        return "重度缺水"
    }
}

export const ROUGH_SEVERITY_TRANSLATION=(severity)=>{
    if(severity<=20){
        return "正常"
    }
    else if(severity<=50){
        return "轻度粗糙"
    }
    else if(severity<=80){
        return "中度粗糙"
    }
    else{
        return "重度粗糙"
    }
}

//黑眼圈类型翻译
export const EYE_DARK_CIRCLE_TYPE_TRANSLATION ={
    0:"无黑眼圈",
    1:"色素型黑眼圈",
    2:"血管型黑眼圈",
    3:"阴影型黑眼圈"
}
