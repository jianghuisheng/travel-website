// 创建组件
import React, {Component} from 'react';
import './About.css';
import {Col, Row,Card, Input} from 'antd';
import axios from 'axios';
import {Link} from 'react-router-dom';
const { Meta } = Card;
const Search = Input.Search;
class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cargos:[]
        }
    }
    onSubmit=(value)=>{
        let data={
            title:value
        };
        axios.post('/about/search',data).then((res)=>{
            this.setState({
               cargos: res.data.cargos
            })
        }).catch((err)=>{
            console.log(err);
        })
    };
    render() {
        return (
            <div className='about'>
                <Search
                    placeholder="请输入搜索内容"
                    enterButton="搜索"
                    size="large"
                    style={{width:'50vw',marginTop:'5vh'}}
                    onSearch={value=>this.onSubmit(value)}
                />
                {
                    this.state.cargos.length>0?
                        <div className='smallTitleContent' style={{width:'80vw',margin:'20px auto'}}>
                            <Row gutter={16}>
                                {
                                    this.state.cargos.map((cargo,index)=>{
                                        return(
                                            <Col span={6} key={index} >
                                                <Link to={'/cargoDetail/' + cargo.cargo_name + '/' + cargo._id} key={index} >
                                                    <Card key={cargo._id} style={{width:'300px',position:'relative'}}
                                                          cover={<img alt="example" src={cargo.cargo_image} style={{width:'300px',height:'200px'}}/>}>
                                                        <Meta
                                                            title={<h1 style={{position:'absolute',top:'70px',left:'100px',color:'#ffffff'}}>{cargo.cargo_name}</h1>}
                                                            description={
                                                                <div>
                                                                   <span style={{color:'red',fontSize:'40px',fontWeight:'800',marginRight:'20px',display:'block'}}>
                                                                       <strong style={{fontSize:'20px'}}>现价:</strong>
                                                                       {cargo.cargo_price}元
                                                                    </span>
                                                                    <s>
                                                                   <span style={{color:'#8a8a8a',fontSize:'20px',display:'block'}}>
                                                                       原价:{cargo.before_price}
                                                                   </span>
                                                                    </s>
                                                                </div>
                                                            }
                                                        />
                                                    </Card>
                                                </Link>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </div>: <h1 style={{marginTop:'10vh'}}>亲，请输入正确的内容</h1>
                }
            </div>
        )
    }
}
export default About;
