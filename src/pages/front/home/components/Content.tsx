/*
 * @Descripttion:
 * @version:
 * @Author: yuanyun
 * @Date: 2021-11-24 13:12:28
 * @LastEditors: yuanyun
 * @LastEditTime: 2021-11-26 16:41:39
 */
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import { Spin } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import ScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import WaterfallLayout from './WaterfallLayout';
import ticker from 'rc-tween-one/lib/ticker';
import styles from './Content.less'
import data from './template.config'


let waterfallDom: any = null
let maxLength = 0;
Object.keys(data).forEach((key) => {
    const d = data[key].data;
    if (key !== 'Other') {
        d.forEach(() => {
            maxLength += 1;
        });
    }
});

interface articleProps {
    key: any;
    backgroundImage?: string;
    title?: string;
    description?: string
    updateDate?: string
}

const Article: React.FC<any> = ({ tkey }) => {
    const [spinning, setSpinning] = useState(true)


    const handleImgRender = () => {
        setSpinning(false)
        console.log(tkey, 'key')
    }

    return (
        <div className={styles.articleWrapper}>
            <Spin spinning={spinning}>
                <a href="" className={styles.articleImage}>
                    <img onLoad={() => handleImgRender()} src="https://showballer.github.io/images/titles/endofyear.jpeg" alt="" />
                </a>
            </Spin>
            <div className={styles.articleConent}>
                <div className={styles.articleContentWrap}>
                    <h3>
                        <a style={{ color: '#33333d', fontSize: '1.2rem' }} href="">测试标题</a>
                    </h3>
                    <p style={{ color: '#4e4e4e', fontSize: '1rem' }}>测试文字</p>
                </div>
                <div style={{ padding: 'inherit', position: 'absolute', bottom: 0, left: 0, fontFamily: 'Hiragino Sans GB', color: '#999' }}>
                    <CalendarOutlined />
                    <span style={{ marginLeft: '1em' }}>一月 30, 2020</span>
                </div>
            </div>
        </div>
    )
}

const Content: React.FC<any> = () => {
    const [type, setType] = useState('all')
    const [pageSize, setPageSize] = useState(10)
    const [imageData, setImageData] = useState({})
    const [isSwitchTween, setIsSwitchTween] = useState(false)

    const imgInLoad = {};
    let childrenLength = 0
    const inQueue = {};
    let num = 0
    let timeout: any = null;
    let timeout2: any = null



    useEffect(() => {
        if (pageSize < 5) return
        num = 0
    }, [pageSize])

    const scrollEventListener = (e: any) => {
        const showHeight = e.showHeight;
        // console.log(showHeight, 'showHeight')
        // console.log(parseFloat(waterfallDom.style.height), 'waterfall height')
        if (parseFloat(waterfallDom.style.height)
            && num + pageSize < maxLength
            && showHeight > parseFloat(waterfallDom.style.height) + 100) {
            num += 10;
            ticker.clear(timeout);
            timeout = ticker.timeout(() => {
                // 添加延时处理增加页面，避逸图片加载完后的刷新冲突。。
                // console.log(pageSize + num, 'test size');
                setPageSize(pageSize + num)
            }, 17);
        }
    }

    const loadImage = (src: any, key: any) => {
        if (imgInLoad[key]) {
            return;
        }
        const img = new Image();
        const load = (e: any) => {
            const target = e.target;

            const scale = 352 / target.naturalWidth;
            imageData[key] = {
                width: 352,
                height: e.type === 'error' ? 26 : target.naturalHeight * scale,
            };
            // delete this.imgInLoad[key];
            const length = Object.keys(imageData).length;
            if (length >= pageSize || length >= maxLength) {
                setImageData(imageData)
            }
        };
        img.onload = load;
        // img.onerror = load;
        img.src = src;
        imgInLoad[key] = true;
    }

    // const onLabelChange = (v: any) => {
    //     const newType = v.target.value;
    //     setType(newType)
    //     setPageSize(10)
    //     setIsSwitchTween(true)
    // }

    // const getHeaderChildrenToRender = () => Object.keys(data).map((key) => (
    //     key !== 'Other' && (
    //         <RadioButton value={key} key={key}>
    //             {key}
    //             {key === 'Teams' ? '' : 's'}
    //         </RadioButton>
    //     )
    // ));

    const onSwitchEnd = (e: any) => {
        if (e.type === 'enter') {
            inQueue[e.key] = true;
        } else {
            delete inQueue[e.key];
        }
        if (Object.keys(inQueue).length >= childrenLength) {
            setIsSwitchTween(false)
        }
    }

    const getChildrenToRender = (v: any, imgData: any) => {
        const children: any = [];
        let number = 0;
        Object.keys(data).forEach((key) => {
            const d = data[key].data;
            if (key !== 'Other' && (v === 'all' || v === key)) {
                d.forEach((item: any, i: any) => {
                    if (item.disabled) {
                        return;
                    }
                    const tKey = `${key}_${i}`;
                    const style = imgData[tKey];
                    if (number < pageSize) {
                        number += 1;
                        if (!style) {
                            loadImage(item.src, tKey);
                        } else {
                            children.push(
                                <div
                                    style={{ width: 350, height: 400 }}
                                    key={tKey}
                                >
                                    <Article tkey={tKey} />
                                </div>
                            );
                        }
                    }
                });
            }
        });
        childrenLength = children.length;
        return children;
    }

    // console.log(pageSize, 'pageSize')

    return (
        <div style={{ padding: '128px 24px', maxWidth: 1200, margin: 'auto' }}>
            <ScrollOverPack
                playScale="0.3"
                className={styles.contentPage}
                onChange={(e) => {
                    const newPageSize = e.mode === 'enter' ? 5 : 0;
                    // 改变页面高度出现多次变更事件
                    ticker.clear(timeout2);
                    timeout2 = ticker.timeout(() => {
                        // console.log(newPageSize, 'newpagesize')
                        setPageSize(newPageSize)
                    }, 17);
                }}
                onScroll={!isSwitchTween ? scrollEventListener : undefined}
            >
                {/* <TweenOne
                    key="queue"
                    component={RadioGroup}
                    componentProps={{ onChange: onLabelChange, defaultValue: 'all' }}
                    className="contentHeader"
                    animation={{ y: 30, opacity: 0, type: 'from' }}
                >
                    <RadioButton value="all" key="all">
                        ALL
                    </RadioButton>
                    {getHeaderChildrenToRender()}
                </TweenOne> */}
                <WaterfallLayout
                    key="a"
                    queueAnimProps={{
                        leaveReverse: true,
                        interval: [80, 0],
                        duration: 300,
                        // onEnd: onSwitchEnd,
                    }}
                    itemMargin={48}
                    gridWidth={16}
                    ref={(c) => {
                        waterfallDom = ReactDOM.findDOMNode(c);
                    }}
                >
                    {getChildrenToRender(type, imageData)}
                </WaterfallLayout>
            </ScrollOverPack>
        </div >
    )
}

export default Content