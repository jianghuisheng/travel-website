// 创建组件
import React, {Component} from 'react';
import './CargoUpdate.css';
import { Form, Input, Button,Layout, Row,Col,Radio,Checkbox,InputNumber,message,DatePicker,Select} from 'antd';
import axios from "axios/index";
const FormItem = Form.Item;
const { Header, Content, Footer} = Layout;
const { TextArea } = Input;
const Option = Select.Option;
class CargoUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: []
        }
    }
    success = (msg) => {
        message.success(msg)
    };
    error = (msg) => {
        message.error(msg)
    };
    //提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('接收到的数据: ', values);
                let data={
                    values,
                    id: this.props.match.params.id
                };
                axios.post('/cargo/update',data).then((res)=>{
                    if(res.status===200){
                        if(res.data.error===0){
                            this.success(res.data.msg)
                        }
                        if(res.data.error===1){
                            this.error(res.data.msg);
                        }
                    }
                }).catch((err)=>{
                    console.log(err);
                })
            }
        });
    };
    componentWillReceiveProps(nextProps) {
        console.log(nextProps.match.params);
    }
    //清除
    handleReset = () =>{
        this.props.form.resetFields();
    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 4},
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 15 },
            },
        };
        const leftItemLayout = {
            labelCol: {
                xs: { span:12},
                sm: { span:10},
            },
            wrapperCol: {
                xs: { span:12},
                sm: { span:14},
            },
        };
        return (
            <div className='cargo_update'>
                <Layout>
                    <Header style={{background:'#f0f2f5', padding: 0,height:'100px'}}>
                        <h1 style={{fontSize:'50px',color:'rgba(14,144,155)',display:'block',marginTop:'20px'}}>
                            修改商品信息
                        </h1>
                    </Header>
                    <Content>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem{...formItemLayout} label="商品名称">
                                {getFieldDecorator('cargo_name', {
                                    rules: [{required: true, message: '输入商品的名称',}],
                                })(
                                    <Input placeholder='商品名称' />
                                )}
                            </FormItem>
                            <FormItem{...formItemLayout} label="商品类型">
                                {getFieldDecorator('type')(
                                    <Select>
                                        <Option value="异域风情">异域风情</Option>
                                        <Option value="日本温泉">日本温泉</Option>
                                        <Option value="国内山川">国内山川</Option>
                                        <Option value="泰国">泰国</Option>
                                        <Option value="欧洲">欧洲</Option>
                                        <Option value="意大利">意大利</Option>
                                        <Option value="法国">法国</Option>
                                        <Option value="北疆">北疆</Option>
                                        <Option value="北京">北京</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem{...formItemLayout} label="出发城市">
                                {getFieldDecorator('start_city')(
                                    <Select>
                                        <Option value="郑州">郑州</Option>
                                        <Option value="南京">南京</Option>
                                        <Option value="北京">北京</Option>
                                        <Option value="上海">上海</Option>
                                        <Option value="沈阳">沈阳</Option>
                                        <Option value="大连">大连</Option>
                                        <Option value="武汉">武汉</Option>
                                        <Option value="石家庄">石家庄</Option>
                                        <Option value="天津">天津</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="出发时间" hasFeedback>
                                {getFieldDecorator('start_time', {
                                    rules: [{required: true, message: '输入出发时间',}],
                                })(
                                    <DatePicker style={{ width: '100%' }} />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label='商品图片'>
                                {getFieldDecorator('cargo_image', {
                                    rules: [{ required: true, message: '请输入商品的图片!', whitespace: true }],
                                })(
                                    <Input placeholder='商品图片'/>
                                )}
                            </FormItem>
                            {/*商品的附图*/}
                            <Row gutter={24}>
                                <Col span={5} offset={2}>
                                    <FormItem {...leftItemLayout} label='商品附图1'>
                                        {getFieldDecorator('cargo_photo1')(
                                            <Input placeholder='商品图片1'/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={5}>
                                    <FormItem {...leftItemLayout} label='商品附图2'>
                                        {getFieldDecorator('cargo_photo2')(
                                            <Input placeholder='商品图片2'/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={5} >
                                    <FormItem {...leftItemLayout} label='商品附图3'>
                                        {getFieldDecorator('cargo_photo3')(
                                            <Input placeholder='商品图片3'/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={5} offset={2}>
                                    <FormItem {...leftItemLayout} label='商品附图4'>
                                        {getFieldDecorator('cargo_photo4')(
                                            <Input placeholder='商品图片4'/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={5}>
                                    <FormItem {...leftItemLayout} label='商品附图5'>
                                        {getFieldDecorator('cargo_photo5')(
                                            <Input placeholder='商品图片5'/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={5} >
                                    <FormItem {...leftItemLayout} label='商品附图6'>
                                        {getFieldDecorator('cargo_photo6')(
                                            <Input placeholder='商品图片6'/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <FormItem label="描述" {...formItemLayout}>
                                {getFieldDecorator('description', {
                                    rules: [{required: true, message: '请输入描述信息'}],
                                })(
                                    <TextArea rows={4} placeholder='例如：途径。。。。。。'/>
                                )}
                            </FormItem>
                            {/*标签tags*/}
                            <Row gutter={24}>
                                <Col span={5} offset={2}>
                                    <FormItem {...leftItemLayout} label='标签一'>
                                        {getFieldDecorator('tag1', {
                                            rules: [{required: true,message: '商品标签'}],
                                        })(
                                            <Input placeholder='标签1'/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={5}>
                                    <FormItem {...leftItemLayout} label='标签二'>
                                        {getFieldDecorator('tag2')(
                                            <Input placeholder='标签2'/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={5} >
                                    <FormItem {...leftItemLayout} label='标签三'>
                                        {getFieldDecorator('tag3')(
                                            <Input placeholder='标签3'/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={5} offset={2}>
                                    <FormItem {...leftItemLayout} label='标签四'>
                                        {getFieldDecorator('tag4')(
                                            <Input placeholder='标签4'/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            {/*活动*/}
                            <Row gutter={24}>
                                <Col span={5} offset={2}>
                                    <FormItem {...leftItemLayout} label='活动一'>
                                        {getFieldDecorator('cargo_active1',{
                                            rules: [{required: true, message: '请输入活动内容',}],
                                        })(
                                            <Input placeholder='活动1'/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={5}>
                                    <FormItem {...leftItemLayout} label='活动二'>
                                        {getFieldDecorator('cargo_active2')(
                                            <Input placeholder='活动2'/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={5}>
                                    <FormItem {...leftItemLayout} label='活动三'>
                                        {getFieldDecorator('cargo_active3')(
                                            <Input placeholder='活动3'/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={5} offset={2}>
                                    <FormItem {...leftItemLayout} label='活动四'>
                                        {getFieldDecorator('cargo_active4')(
                                            <Input placeholder='活动4'/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={5}>
                                    <FormItem {...leftItemLayout} label='活动五'>
                                        {getFieldDecorator('cargo_active5')(
                                            <Input placeholder='活动5'/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            {/*/!*价格*!/*/}
                            <Row gutter={24}>
                                <Col span={5} offset={2}>
                                    <FormItem {...leftItemLayout} label='商品价格'>
                                        {getFieldDecorator('cargo_price', {
                                            rules: [{required: true,message: '商品价格'}],
                                        })(
                                            <InputNumber placeholder='商品价格' style={{width:'10vw'}}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={5} >
                                    <FormItem {...leftItemLayout} label='库存数量'>
                                        {getFieldDecorator('cargoAllNum', {
                                            rules: [{required: true, message: '请输入库存数量'}],
                                        })(
                                            <InputNumber placeholder='商品库存' style={{width:'10vw'}}/>
                                        )}
                                    </FormItem>
                                </Col>
                                {/*<Col span={5}>*/}
                                {/*<FormItem {...leftItemLayout} label='大众评分'>*/}
                                {/*{getFieldDecorator('star',{initialValue:3},{*/}
                                {/*rules: [{required: true,message: '大众评分'}],*/}
                                {/*})(*/}
                                {/*<InputNumber min={0} max={5} style={{width:'10vw'}} />*/}
                                {/*)}*/}
                                {/*</FormItem>*/}
                                {/*</Col>*/}
                            </Row>
                            <Row gutter={24}>
                                <Col span={5} offset={2}>
                                    <FormItem {...leftItemLayout} label='折前价'>
                                        {getFieldDecorator('before_price')(
                                            <InputNumber placeholder='原价' style={{width:'10vw'}}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={5}>
                                    <FormItem {...leftItemLayout} label='运费'>
                                        {getFieldDecorator('delivery_fee', {
                                            rules: [{required: true, message: '请输入运费'}],
                                        })(
                                            <InputNumber placeholder='运费' style={{width:'10vw'}}/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <FormItem {...formItemLayout} label='快递方式'>
                                {getFieldDecorator('delivery')(
                                    <Checkbox.Group style={{ width: '100%' }}>
                                        <Row>
                                            <Col span={2}><Checkbox value="圆通">圆通</Checkbox></Col>
                                            <Col span={2}><Checkbox value="顺丰">顺丰</Checkbox></Col>
                                            <Col span={2}><Checkbox value="菜鸟">菜鸟</Checkbox></Col>
                                            <Col span={2}><Checkbox value="韵达">韵达</Checkbox></Col>
                                            <Col span={2}><Checkbox value="邮政">邮政</Checkbox></Col>
                                        </Row>
                                    </Checkbox.Group>,
                                )}
                            </FormItem>
                            <Row>
                                <Col span={12} offset={2}>
                                    <FormItem label="免运费" {...formItemLayout}>
                                        {getFieldDecorator('success_fee',{initialValue:"true"})(
                                            <Radio.Group  buttonStyle="solid">
                                                <Radio.Button value="false" style={{width:'150px'}}>支持到付</Radio.Button>
                                                <Radio.Button value="true" style={{width:'150px'}}>不支持到付</Radio.Button>
                                            </Radio.Group>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <FormItem>
                                <Button type="primary" style={{width:'100px'}} htmlType="submit">提交</Button>
                                <Button style={{ marginLeft:'10px' ,width:'100px'}} onClick={this.handleReset}>清除</Button>
                            </FormItem>
                        </Form>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2018 Created by Ant UED
                    </Footer>
                </Layout>
            </div>
        )
    }
}
CargoUpdate = Form.create({})(CargoUpdate);
export default CargoUpdate;
