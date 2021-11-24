/*
 * @Descripttion:
 * @version:
 * @Author: yuanyun
 * @Date: 2021-11-19 09:59:56
 * @LastEditors: yuanyun
 * @LastEditTime: 2021-11-23 17:49:49
 */
import React from 'react'
import { Card } from 'antd'
import styles from './index.less'

const Home: React.FC<any> = () => {
    return (
        <div className={styles.main}>
            <div className={styles.preview}>
                <div className={styles.previewImage}>
                    <div className={styles.previewOverlay}>
                        <svg className={styles.previewWaves} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                            <defs>
                                <path id="gentleWave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                            </defs>
                            <g className={styles.previewParallax}>
                                <use xlinkHref="#gentleWave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
                                <use xlinkHref="#gentleWave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                                <use xlinkHref="#gentleWave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                                <use xlinkHref="#gentleWave" x="48" y="7" fill="#fff" />
                            </g>
                        </svg>
                    </div>
                </div>
                <div className={styles.previewMottoWrapper}>
                    <h2 className={styles.previewMotto}>showballer</h2>
                    <span className={styles.previewCursor}>_</span>
                </div>
                <div className={styles.previewScroll}>
                    <a href="#container">
                        <i style={{ fontSize: '2rem' }} className="iconfont icon-Mouse" />
                    </a>
                </div>
            </div>
            <div id="container" className={styles.container}>
                <Card>123</Card>
            </div>
        </div>
    )
}

export default Home