// 创建组件
import React, {Component} from 'react';
import './Footer.css';
class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div className='footer' style={{height:'500px',marginTop:'100px'}}>
                <div className='footer_top'>
                    <img src='http://ssl1.tuniucdn.com/img/2016070111/footer/thr_sun.jpg' alt=""
                    style={{width:'100%',height:'60px'}}/>
                </div>
                <div className='footer_content' style={{width:'80%',margin:'0 auto'}}>
                    <div className='images'>
                        <img src="http://images.tuniucdn.com/u/mainpic/footer/tn_footer_042.jpg" alt=""/>
                        <img src="http://images.tuniucdn.com/u/mainpic/footer/tn_footer_06.jpg" alt=""/>
                        <img src="https://m4.tuniucdn.com/fb2/t1/G3/M00/89/C0/Cii_LlmSlsaICijDAABiOObnKkEAAHXXABQ4z0AAGJQ76.jpeg" alt=""/>
                        <img src="http://m.tuniucdn.com/fb2/t1/G1/M00/B2/6E/Cii9EFaWDQ2IFdVUAAAaUoTPAnAAABcxwP_x9YAABpq60.jpeg" alt=""/>
                    </div>
                    <div className='images'>
                        <img src="https://m4.tuniucdn.com/fb2/t1/G4/M00/65/B8/Cii_J1nIphSIet_kAABV-FnEriEAABk8AAbUSQAAFYQ30.jpeg" alt=""/>
                    </div>
                    <div className='text' style={{marginTop:'10px'}}>
                        <p>途牛客服中心设立在江苏南京及江苏宿迁，来电显示号码请查看：途牛会员中心外呼电话号码汇总</p>
                        <p>北京途牛国际旅行社有限公司，旅行社业务经营许可证编号：L-BJ-CJ00144　　上海途牛国际旅行社有限公司，旅行社业务经营许可证编号：L-SH-CJ00107 </p>
                        <p>
                            <span>关于我们</span> <span>Investor Relations</span> <span>联系我们</span> <span>投诉建议</span>
                            <span>广告服务</span> <span>旅游券</span> <span style={{color:'red'}}>途牛招聘</span> <span>隐私保护</span> <span>免责声明</span>
                            <span>旅游度假资质</span> <span>主题旅游</span> <span>用户协议</span> <span>网站地图</span> <span>UEIP</span>
                            <span>帮助中心</span>
                        </p>
                        <p>Copyright © 2006-2018 南京途牛科技有限公司 Tuniu.com | 营业执照 | ICP证：苏B2-20130006 | 苏ICP备12009060号 | 上海旅游网</p>
                        <p>上海市互联网违法和不良信息举报中心电话（021-55056666） 旅游违法行为举报电话（12318） 服务质量投诉电话（962020）</p>
                    </div>
                    <div className='images' style={{paddingBottom:'10px',borderBottom:'1px solid #cccccc'}}>
                        <img src="http://images.tuniucdn.com/u/mainpic/footer_1.jpg" alt=""/>
                        <img src="https://m3.tuniucdn.com/fb2/t1/G4/M00/E9/49/Cii-VVoWgdSIb711AAAQl3qGbAgAADlgQMoMUoAABCv188.png" alt=""/>
                        <img src="http://img2.tuniucdn.com/site/file/zt/public/images/bottom.jpg" alt=""/>
                    </div>
                    <div className='text'>
                        <p>友情链接： 笛风假期途牛微博客首都航空网易旅游中国经济网旅游百度旅游人民网旅游中国制造网51766旅游网成都青年旅行社欣欣旅游网驴妈妈旅游网奇艺旅游拉拉勾旅</p>
                        <p><span>游网</span><span>米胖旅游网</span><span>百程旅行网</span><span>新疆旅游酷讯旅游</span> <span>wed114结婚网</span>
                            <span>新通留学网</span><span>二手车中国签证资讯网</span><span>19楼途家网</span></p>
                        <p style={{lineHeight:'100px'}}>Made with <span style={{color:'red'}}>❤</span> byDRR</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer;
