// 创建组件
import React, {Component} from 'react';
import './CargoDelete.css';
import history from '../../history.js';
import {message, Avatar,Button,Table} from 'antd';
import axios from 'axios';
import {Link} from 'react-router-dom';

class CargoDelete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cargos:[]
        }
    }
    success = (msg) => {
        message.success(msg)
    };
    error = (msg) => {
        message.error(msg)
    };
    //点击删除
    deleteCargos=(id,that)=>{
        axios.get('/show/delete',{
            params:id
        }).then((res)=>{
            if (res.status === 200) {
                if (res.data.error === 0) {
                    this.success(res.data.msg);
                    history.go(0);
                }
                if (res.data.error === 1) {
                    this.error(res.data.msg);
                }
            }
        }).catch((err)=>{
            console.log(err);
        })
    };
    //点击修改信息
    updateCargos=(id,that)=>{
        let data={
            updateId:id
        }
        axios.post('/show/updateCargo',data).then((res)=>{
            if (res.status === 200) {
                if (res.data.error === 0) {
                    this.success(res.data.msg);
                }
                if (res.data.error === 1) {
                    this.error(res.data.msg);
                }
            }
        }).catch((err)=>{
            console.log(err);
        })
    };
    //查找到该管理员的所有添加商品
    componentDidMount() {
        axios.get('/show/addCargo').then((res) => {
            console.log(res);
            if (res.status === 200) {
                if (res.data.error === 0) {
                    const cargos=[];
                    for(let i=0;i < res.data.cargos.length;i++){
                        cargos.push({
                            key:i,
                            name:res.data.cargos[i].cargo_name,
                            image:res.data.cargos[i].cargo_image,
                            price:res.data.cargos[i].cargo_price,
                            create_time:res.data.cargos[i].create_time,
                            update_time:res.data.cargos[i].update_time,
                            before_fee:res.data.cargos[i].before_price,
                            cargoAllNum:res.data.cargos[i].cargoAllNum,
                            cargo_remain:res.data.cargos[i].cargo_remain,
                            cargo_sales:res.data.cargos[i].cargo_sales,
                            id:res.data.cargos[i]._id
                        });
                        this.setState({
                            cargos:cargos
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
    }
    render() {
        const columns = [ {
            title: '商品图片',
            dataIndex: 'image',
            width:'10%',
            render:(record)=>{
                return <Avatar src={record} shape="square" size={100}  alt=""/>
            }}, {
            title: '商品名称',
            width:'5%',
            dataIndex: 'name',
        },{
            title: '单价',
            width:'5%',
            dataIndex: 'price',
            sorter:(a,b) =>a.price - b.price
        },
            {
                title: '原价',
                width:'5%',
                dataIndex: 'before_fee',
                sorter:(a,b) =>a.before_fee - b.before_fee
            },
            {
                title: '商品总量',
                width:'5%',
                dataIndex: 'cargoAllNum',
                sorter:(a,b) =>a.cargoAllNum- b.cargoAllNum
            }, {
                title: '销量',
                width:'5%',
                dataIndex: 'cargo_sales',
                sorter:(a,b) =>a.before_fee - b.before_fee
            }, {
                title: '库存',
                width:'5%',
                dataIndex: 'cargo_remain',
                sorter:(a,b) =>a.cargo_remain - b.cargo_remain
            },{
                title: '添加时间',
                width:'15%',
                dataIndex: 'create_time',
                sorter: (a, b) => {
                    let stringA = a.create_time.toUpperCase();
                    let stringB = b.create_time.toUpperCase();
                    if (stringA < stringB) {
                        return -1;
                    }
                    if (stringA > stringB) {
                        return 1;
                    }
                    return 0;
                }
            }, {
                title: '更新时间',
                width:'15%',
                dataIndex: 'update_time',
                sorter: (a, b) => {
                    let stringA = a.update_time.toUpperCase(); // ignore upper and lowercase
                    let stringB = b.update_time.toUpperCase(); // ignore upper and lowercase
                    if (stringA < stringB) {
                        return -1;
                    }
                    if (stringA > stringB) {
                        return 1;
                    }
                    return 0;
                }
            },{
                title: '操作',
                width:'20%',
                dataIndex: 'id',
                render:(id)=>{ return (<div><Button onClick={this.deleteCargos.bind(this,id)}>删除</Button>
                    <Link to={'/cargoUpdate/' + id} key={id}><Button>修改</Button></Link></div>) },
            }];
        return (
            <div className='cargo_delete' style={{overflowY:'scroll'}}>
                {this.state.cargos.length!==0 ?
                    <div>
                        <Table bordered
                               title={() => '购物车'}
                               columns={columns}  pagination={{ pageSize:5}} dataSource={this.state.cargos}>
                        </Table>
                    </div> : <h1>亲,你还没上传商品！</h1>}
            </div>
        )
    }
}
export default CargoDelete;
