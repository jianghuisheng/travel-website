// 创建组件
import React, {Component} from 'react';
import {Carousel,Icon,message, Rate} from 'antd';
import './CargoDetail.css';
import axios from 'axios';


class CargoDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cargoInfo: {cargo_photos:[],delivery:[],cargo_actives:[]},
            comments:[]
        }
    }
    componentDidMount() {
        axios.get('/cargo/info', {
            params: this.props.match.params
        }).then((res) => {
            console.log(res);
            this.setState({
                cargoInfo: res.data.cargo
            })
        }).catch((err) => {
            console.log(err);
        })
        let data={
            shopId:this.props.match.params.id
        }
        axios.post('/cargo/comment/show',data).then((res) => {
            // console.log(res);
            if(res.status===200){
                if(res.data.error===0){
                    this.setState({
                        comments: res.data.comments
                    })
                    this.success(res.data.msg);
                }
                if(res.data.error===1){
                    this.warning(res.data.msg);
                }
            }

        }).catch((err) => {
            console.log(err);
        })
    }
    success = (msg) => {
        message.success(msg)
    };
    warning = (msg) => {
        message.warning(msg)
    };
    //等价于watch
    componentWillReceiveProps(nextProps) {
        console.log(nextProps.match.params);
    }
    //点击收藏
    handleCollected=()=>{
           axios.get('/cargo/collected',{
               params:{
                   cargo_name:this.props.match.params.name,
                   cargo_id:this.props.match.params.id,
               }
           }).then((res)=>{
               if(res.status===200){
                   if(res.data.error===0){
                       this.success(res.data.msg);
                   }
                   if(res.data.error===1){
                       this.warning(res.data.msg);
                   }
               }
           }).catch((err)=>{
               console.log(err);
           })
    };
    //点击购买
    handleBuy=()=>{
            axios.get('/cargo/buy', {
                params:this.props.match.params
            }).then((res) => {
                if(res.status===200){
                    if(res.data.error===0){
                        this.success(res.data.msg);
                    }
                    if(res.data.error===1){
                        this.warning(res.data.msg);
                    }
                }
            }).catch((err) => {
                console.log(err);
            })
    };
    render() {
        return (
            <div className='cargo_detail'>
                <div className='detail_head'>
                    <h1 style={{textAlign:'left'}}>{this.state.cargoInfo.cargo_name}</h1>
                </div>
                <div className='detail_left'>
                    <Carousel autoplay dots='false'>
                        {
                            this.state.cargoInfo.cargo_photos.map((photo,index)=>{
                                   return (
                                       photo !==null && <div key={index}>
                                                            <img src={photo} style={{width: '600px', height: '350px'}} alt=""/>
                                                        </div>
                                )
                            })
                        }
                    </Carousel>
                    <div className='cargo_side'>
                        <span>
                            <Icon onClick={this.handleCollected.bind(this)} type='heart'/>
                        </span>
                        <span >
                            <Icon onClick={this.handleBuy.bind(this)} type='shopping-cart'/>
                        </span>
                        <span><Icon type='bars'/></span>
                    </div>
                    <div className="detail_left_footer">
                        <p className='line1'>
                            折后价格:<span>￥<strong>{this.state.cargoInfo.cargo_price}</strong></span>
                            原价:<span>{this.state.cargoInfo.before_price}</span>
                        </p>
                        <p className='line2' style={{color:'orange'}}>
                            快递合作:{
                                this.state.cargoInfo.delivery.map((delivery,index)=>{
                                    return  (
                                        <span key={index} style={{width:'50px',lineHeight:'20px',textAlign:'center',
                                            background:'rgba(255,0,0,0.3)',marginRight:'10px',color:'#ffffff',borderRadius:'10px'}}>{delivery}</span>
                                    )
                                })
                            }
                        </p>
                        <p className='line3'>
                            <Icon type='sound' style={{color:'orange'}}/>介绍： {this.state.cargoInfo.description}
                        </p>
                        <p className='line4'>
                            <span><strong style={{color:'orange'}}>收藏人数：</strong><Icon type='heart' style={{marginRight:'10px',color:'red'}}/>{this.state.cargoInfo.cargo_collected}</span>
                            <span><strong style={{marginRight:'10px',color:'orange'}}>已售：</strong >{this.state.cargoInfo.cargo_sales}</span>
                            <span><strong style={{marginRight:'10px',color:'orange'}}>库存：</strong>{this.state.cargoInfo.cargo_remain}</span>
                        </p>
                        <p className='line5'>
                            {this.state.cargoInfo.cargo_actives.map((active,index)=>{
                                    return(
                                        active !== null && <span key={index} style={{display:'inline-block',width:'70%',marginLeft:'20px',color:'orange'}}>{active}</span>
                                )
                            })}
                        </p>
                    </div>
                </div>
                <div className='detail_right'>
                    <h2 style={{textAlign:'left',color:'red',fontFamily:'楷体'}}>经典景点:</h2>
                    {
                        this.state.cargoInfo.cargo_photos.map((photo,index)=>{
                            return (
                                photo !==null && <div key={index}>
                                    <img src={photo} style={{width: '150px', height: '100px',display:'inline-block',float:'left',marginRight:'10px'}} alt=""/>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='detail_right_comment'>
                    {
                        this.state.comments.length>0 ?
                        <div>
                            <h2 style={{textAlign:'left'}}>用户评论:</h2>
                            {
                                this.state.comments.map((comment,index)=>{
                                    return(
                                       <p style={{textAlign:'left'}}>
                                           <strong>{comment.buyOrderUserName}:</strong>
                                           <Rate disabled defaultValue={comment.rate}/>
                                           <span style={{marginRight:'20px'}}>{comment.rate}分</span>
                                           {comment.comment_text}
                                       </p>
                                    )
                                })
                            }
                        </div>:<h1 style={{textAlign:'left'}}>还没有用户进行评论没有评论</h1>
                    }
                </div>
            </div>
        )
    }
}

export default CargoDetail;
