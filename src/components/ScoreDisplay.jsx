import React from 'react';
import { Space, Progress } from '@douyinfe/semi-ui';

export const ScoreDisplay = ({percent}) => {
    // 定义颜色区间
    const colors = ['rgb(249, 57, 32)', '#FFA500', '#FFFF00', '#90EE90', 'green'];
    const strokeArr = [
        {percent:0,color:colors[0]},
        {percent:25,color:colors[1]},
        {percent:50,color:colors[2]},
        {percent:75,color:colors[3]},
        {percent:100,color:colors[4]}
    ]

    return (
        <>
            <Space spacing={20}>
                <div>
                    <Progress
                        percent={percent}
                        stroke={strokeArr}
                        strokeGradient={true}
                        showInfo
                        format={(percent)=>percent+"分"}
                        type="circle"
                        width={100}
                        aria-label="score display"
                    />
                </div>
            </Space>
        </>
    );
};