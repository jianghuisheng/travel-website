// 创建组件
import React, {Component} from 'react';
import './ShopCart.css';
import {message,Popconfirm,Avatar,Table,Button} from 'antd';
import axios from 'axios';
class ShopCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info:[],
            allPrice:0,
            selectedRowKeys:[]
        }
    }
    success = (msg) => {
        message.success(msg)
    };
    error = (msg) => {
        message.error(msg)
    };
    componentDidMount() {
        this.getCartCargo();
    }
    //获取数据，显示
    getCartCargo=()=>{
        axios.get('/show/shoppingCart').then((res) => {
            // console.log(res);
            if (res.status === 200) {
                if (res.data.error === 0) {
                    const info=[];
                    for(let i=0;i < res.data.cart.length;i++){
                        info.push({
                            key:i,
                            name:res.data.cart[i].shopName,
                            image:res.data.cart[i].shopImage,
                            price:res.data.cart[i].shopPrice,
                            create_time:res.data.cart[i].create_time,
                            buyNum:res.data.cart[i].buyNum,
                            sumPrice:res.data.cart[i].buyNum * res.data.cart[i].shopPrice,
                            id:res.data.cart[i]._id
                        });
                        this.setState({
                            info:info
                        });
                    }
                    this.success(res.data.msg);
                }
                if (res.data.error === 1) {
                    this.error(res.data.msg);
                }
            }
        }).catch((err) => {
            console.log(err);
        })
    };
    //点击选中商品结算
    onSelectChange=(selectedRowKeys)=>{
        // console.log('选择到的key值:', selectedRowKeys);
        this.setState({ selectedRowKeys });
        let info = this.state.info;
        let allPrice = 0;
        for (let k = 0; k < selectedRowKeys.length; k++){
            let item = selectedRowKeys[k];
            allPrice += info[item].buyNum * info[item].price;
        }
        this.setState({
           allPrice
        });
    };
    //删除购物车中的商品
    deleteCartCargo=(id,that)=>{
        // console.log(that);
        // console.log(id);
        let data = {
            token:localStorage.getItem("token"),
            username:localStorage.getItem("username"),
            shopId:id
        };
            axios.post('/user/cartCargo/delete',data).then((res) => {
                console.log(res.data);
                if(res.data.error===0){
                    this.success(res.data.msg);
                    this.getCartCargo();
                }else{
                    this.error(res.data.msg)
                }
            }).catch((err)=>{
                console.log(err);
            })
    };
    //点击确定结算时的回调函数
    //选中的商品的id
    confirm= ()=> {
        let selectedRowKeys= this.state.selectedRowKeys;
        let data={
            shopId:[],
            username:localStorage.getItem('username')
        };
        for(let j=0;j<selectedRowKeys.length;j++){
            let item = selectedRowKeys[j];
            data.shopId.push(this.state.info[item].id);
        }
        //结算成功，清除购物车，创建订单集合，
        axios.post('/user/buyGood',data).then((res) => {
            if(res.data.error===0){
                this.success(res.data.msg);
                this.getCartCargo();
            }else{
                this.error(res.data.msg)
            }
        }).catch((err)=>{
            console.log(err);
        })
    };
    render() {
        const columns = [ {
            title: '商品图片',
            dataIndex: 'image',
            width:'15%',
            render:(record)=>{
                return <Avatar src={record} shape="square" size={100}  alt=""/>
            }}, {
            title: '商品名称',
            width:'10%',
            dataIndex: 'name',
        },{
            title: '单价',
            width:'10%',
            dataIndex: 'price',
            sorter:(a,b) =>a.price - b.price
        },{
            title: '数量',
            width:'10%',
            dataIndex: 'buyNum',
            sorter:(a,b) =>a.buyNum - b.buyNum
        },
            {
                title: '添加时间',
                width:'20%',
                dataIndex: 'create_time',
                sorter: (a, b) => {
                    let stringA = a.create_time.toUpperCase(); // ignore upper and lowercase
                    let stringB = b.create_time.toUpperCase(); // ignore upper and lowercase
                    if (stringA < stringB) {
                        return -1;
                    }
                    if (stringA > stringB) {
                        return 1;
                    }
                    return 0;
                }
            },{
                title: '小计',
                width:'10%',
                dataIndex: 'sumPrice',
                sorter:(a,b) =>a.sumPrice - b.sumPrice
            },{
                title: '操作',
                width:'20%',
                dataIndex: 'id',
                render:(id)=>{ return (<Button onClick={this.deleteCartCargo.bind(this,id)}>删除</Button> ) },
            }];
        const { selectedRowKeys,allPrice} = this.state;
        const hasSelected = selectedRowKeys.length > 0;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        const text ='共' + (allPrice) + '元确定要结算吗？亲';
        return (
            <div className='shop_cart'>
                {this.state.info.length!==0 ?
                  <div>
                    <Table bordered
                           title={() => '购物车'}
                           columns={columns}  rowSelection={rowSelection}   pagination={{ pageSize:5}} dataSource={this.state.info}>
                    </Table>
                    <div className='handle—footer'>
                        <Popconfirm placement="top" title={text} onConfirm={this.confirm.bind(this)} okText="确定" cancelText="否">
                             <span style={{width:'300px',height:'50px',color:'red',display:'inline-block'}}>
                                   <strong>选中：</strong>{this.state.selectedRowKeys.length} <strong style={{marginRight:'20px'}}>件商品</strong>
                                   <strong>总计：</strong>{this.state.allPrice} <strong>元</strong>
                             </span>
                            <Button disabled={!hasSelected} style={{marginRight:'50px'}}>结算</Button>
                        </Popconfirm>
                    </div>
                </div> : <h1>亲，你的购物车中还没有商品呢！</h1>}

            </div>
        )
    }
}
export default ShopCart;
